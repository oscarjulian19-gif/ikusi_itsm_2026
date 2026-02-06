from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.db.session import SessionLocal
from app.models.models import Contract as DBContract, ConfigurationItem as DBConfigurationItem
import pandas as pd
import io
from datetime import datetime
import re
import traceback

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def clean_col_name(col):
    import re
    if not col: return ""
    s = str(col).lower().strip()
    # Normalize accents
    s = s.replace('á','a').replace('é','e').replace('í','i').replace('ó','o').replace('ú','u').replace('ñ','n')
    # Replace anything not alphanumeric with underscore
    s = re.sub(r'[^a-z0-9]+', '_', s)
    return s.strip('_')

@router.post("/imports/contracts")
async def import_contracts(file: UploadFile = File(...), db: Session = Depends(get_db)):
    try:
        content = await file.read()
        filename = file.filename.lower()
        
        try:
            if filename.endswith('.csv'):
                df = pd.read_csv(io.BytesIO(content))
            else:
                try: df = pd.read_excel(io.BytesIO(content))
                except: df = pd.read_excel(io.BytesIO(content), engine='openpyxl')
        except Exception as read_err:
             raise HTTPException(status_code=400, detail=f"Error leyendo archivo: {str(read_err)}")

        col_map = {
            'numero de contrato': 'id',
            'cliente': 'client',
            'descripcion contrato': 'description',
            'descripcion del contrato': 'description',
            'descripcion': 'description',
            'objeto': 'description',
            'alcance': 'description',
            'folio': 'folio',
            'ans asociado': 'sla_type',
            'nombre de proyecto': 'project_name',
            'pep': 'pep',
            'estado': 'status',
            'contrato': 'id', 
            'inicio contrato': 'start_date',
            'fin contrato': 'end_date',
            'project manager': 'pm',
            'paquete de servicio': 'service_package',
            'descripcion del paquete de servicio': 'package_description', 
            'descripcion paquete': 'package_description',
            'descripcion del paquete': 'package_description',
            'horario paquete de servicio': 'schedule',
            'sdm': 'sdm',
            'vendor': 'sales_rep',
            'contrato snow': 'snow_contract',
            'snow': 'snow_contract'
        }

        # 1. Map Columns
        target_to_source = {}
        # Normalize df columns map
        df_cols_map = {} # clean -> original
        for c in df.columns:
            clean = clean_col_name(c).strip()
            # If duplicates exist in source (unlikely with this loop but logically possible mapping), 
            # we just keep the first one found or overwrite.
            if clean not in df_cols_map:
                df_cols_map[clean] = c

        # Match keys
        for key, target_field in col_map.items():
            if key in df_cols_map:
                if target_field not in target_to_source:
                    target_to_source[target_field] = df_cols_map[key]

        # 2. Extract Data
        new_data = {}
        for target_col, source_col in target_to_source.items():
            series = df[source_col]
            if isinstance(series, pd.DataFrame):
                series = series.iloc[:, 0]
            new_data[target_col] = series.values # Use values to simplify structure
            
        clean_df = pd.DataFrame(new_data)
        
        # 3. Clean
        clean_df.dropna(how='all', inplace=True)
        
        # 4. Generate ID logic
        now = datetime.now()
        yy = now.strftime("%y")
        prefix = f"CNTR{yy}"
        
        last_c = db.query(DBContract).filter(DBContract.id.like(f"{prefix}%")).order_by(DBContract.id.desc()).first()
        consecutive = 1
        if last_c:
            try:
                num_str = last_c.id[len(prefix):]
                if num_str.isdigit(): consecutive = int(num_str) + 1
            except: pass

        records = []
        
        # --- SAFE HELPERS ---
        def safe_unwrap(v):
            # Recursively unwrap Series/Index/ndarray singletons
            if isinstance(v, (pd.Series, pd.DataFrame, pd.Index)):
                if v.empty: return None
                # Take first
                if hasattr(v, 'iloc'): return v.iloc[0]
                return v[0]
            return v
            
        def get_stat_val(row, col):
            val = row.get(col)
            val = safe_unwrap(val)
            if pd.isna(val) or val is None: return ''
            return str(val).strip()

        def parse_dt(v):
            v = safe_unwrap(v)
            if pd.isna(v) or v is None: return None
            s_val = str(v).strip()
            if not s_val: return None
            
            try: 
                for fmt in ("%d/%m/%Y", "%Y-%m-%d", "%m/%d/%Y", "%Y.%m.%d"):
                    try: return datetime.strptime(s_val, fmt)
                    except: continue
                return pd.to_datetime(s_val).to_pydatetime()
            except: return None
        # --------------------

        for idx, row in clean_df.iterrows():
            client = get_stat_val(row, 'client')
            if not client: continue 

            c_id = get_stat_val(row, 'id')
            if not c_id:
                c_id = f"{prefix}{consecutive:05d}"
                consecutive += 1

            records.append({
                "id": c_id,
                "client": client,
                "pep": get_stat_val(row, 'pep'),
                "folio": get_stat_val(row, 'folio'),
                "description": get_stat_val(row, 'description'),
                "project_name": get_stat_val(row, 'project_name'),
                "service_type": "Servicio Ikusi", 
                "status": get_stat_val(row, 'status') or 'Preliminar',
                "country": "Colombia", 
                "start_date": parse_dt(row.get('start_date')),
                "end_date": parse_dt(row.get('end_date')),
                "service_package": get_stat_val(row, 'service_package'),
                "package_description": get_stat_val(row, 'package_description'),
                "schedule": get_stat_val(row, 'schedule'),
                "pm": get_stat_val(row, 'pm'),
                "sla_type": get_stat_val(row, 'sla_type'),
                "sdm": get_stat_val(row, 'sdm'),
                "sales_rep": get_stat_val(row, 'sales_rep'),
                "snow_contract": get_stat_val(row, 'snow_contract')
            })

        if records:
            ids = [r['id'] for r in records]
            db.query(DBContract).filter(DBContract.id.in_(ids)).delete(synchronize_session=False)
            
            db.bulk_insert_mappings(DBContract, records)
            try:
                db.commit()
            except Exception as commit_err:
                db.rollback()
                raise HTTPException(status_code=500, detail=f"DB Error: {commit_err}")
                
            return {"message": f"Se importaron {len(records)} contratos.", "count": len(records)}
        
        return {"message": "No se encontraron registros válidos.", "count": 0}

    except Exception as e:
        db.rollback()
        print(f"IMPORT ERROR: {e}")
        traceback.print_exc()
        try:
             with open("imports_debug.log", "a") as f:
                 f.write(f"Error: {e}\nTraceback:\n{traceback.format_exc()}\n")
        except: pass
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/imports/cmdb")
async def import_cmdb(file: UploadFile = File(...), db: Session = Depends(get_db)):
    try:
        content = await file.read()
        filename = file.filename.lower()
        
        if filename.endswith('.csv'):
            df = pd.read_csv(io.BytesIO(content))
        else:
            df = pd.read_excel(io.BytesIO(content))

        col_map = {
            'id': 'id', 'numero ci': 'id', 'ci': 'id', 
            'serial': 'serial_number', 'numero serial': 'serial_number', 'sn': 'serial_number',
            'referencia': 'reference_number', 'numero referencia': 'reference_number', 
            'cliente': 'client',
            'descripcion': 'description', 
            'estado': 'status',
            'inicio': 'start_date', 
            'fin': 'end_date',
            'numero de po': 'po_number', 'po': 'po_number', 
            'numero de so': 'so_number', 'so': 'so_number',
            'fecha fin soporte cisco': 'cisco_support_end_date',
            'fecha inicio soporte cisco': 'cisco_support_start_date',
            'contrato cisco': 'cisco_contract_number',
            'contrato snow': 'snow_contract',
            'numero de contrato': 'contract_id',
            'ciudad': 'city', 
            'direccion': 'address',
            'nombre proyecto': 'project_name',
            'pep': 'pep',
            'pais': 'country',
            'tipo': 'type',
            'modelo equipo': 'device_model', 'modelo': 'device_model'
        }
        
        # 1. Map Columns Safely
        df_cols_map = {}
        for c in df.columns:
            clean = clean_col_name(c)
            # Use loose matching like before?
            # The previous logic was: if k in clean_col_name(col). 
            # We must preserve that flexibility but ensure 1:1 final mapping for reconstruction.
            # Strategy: Find the best match for each target field.
            pass

        # We'll invert the logic: For each DF column, see if it matches a known key.
        # If multiple DF columns match the same key, last one wins? Or first?
        # Better: For each TARGET field, find the first DF column that matches.
        
        target_to_source = {}
        
        # We need a list of (key, target) from col_map
        # And we iterate DF columns.
        
        assigned_cols = set()
        
        for col in df.columns:
            cc = clean_col_name(col)
            # specific fix for 'contrato' vs 'numero de contrato'
            # 'contrato' keyword is in both. 'numero de contrato' is more specific.
            # If we iterate col_map, we might pick wrong one.
            # But here we are iterating DF columns.
            
            # Let's simple check:
            matched_target = None
            maxLength = -1
            
            for k, v in col_map.items():
                if k in cc:
                    # Found a match. Is it the best match?
                    # e.g. "numero de contrato" matches "contrato" and "numero de contrato".
                    # "numero de contrato" is longer. Prefer longer matches?
                    if len(k) > maxLength:
                        maxLength = len(k)
                        matched_target = v
            
            if matched_target:
                # We map this source col to this target.
                # If target already has a source? Overwrite?
                target_to_source[matched_target] = col
        
        # 2. Extract Data
        new_data = {}
        for target_col, source_col in target_to_source.items():
             series = df[source_col]
             # Handle duplicates in source if DF read produced duplicates (unlikely with just names)
             # But if source has "Col" and "Col.1", target_to_source only points to one string name.
             # df[name] returns Series.
             if isinstance(series, pd.DataFrame):
                 series = series.iloc[:, 0] # Take first
             new_data[target_col] = series.values
             
        clean_df = pd.DataFrame(new_data)
        clean_df.fillna('', inplace=True) # Fill NaNs with empty string generally, or handle per row
        
        records = []
        consecutive = 1
        
        def safe_get(row, col):
            if col not in row: return ''
            val = row[col]
            if pd.isna(val): return ''
            return str(val).strip()
            
        def to_dt(v):
            if not v: return None
            if pd.isna(v): return None
            try: return pd.to_datetime(v).to_pydatetime()
            except: return None
            
        seen_ids = set()
        for _, row in clean_df.iterrows():
            c_id = safe_get(row, 'id')
            if not c_id:
                 sn = safe_get(row, 'serial_number')
                 if sn: c_id = sn
                 else:
                     c_id = f"CI-GEN-{consecutive:06d}"
                     consecutive += 1
            
            # Simple in-memory de-duplication for current batch
            if c_id in seen_ids:
                # If ID exists, maybe append a suffix or skip? 
                # User error shows duplicate key violation. 
                # Let's skip duplicates in the file to avoid crashing.
                print(f"Skipping duplicate ID in import file: {c_id}")
                continue
            seen_ids.add(c_id)

            records.append({
                "id": c_id,
                "serial_number": safe_get(row, 'serial_number'),
                "reference_number": safe_get(row, 'reference_number'),
                "client": safe_get(row, 'client') or 'Unknown',
                "description": safe_get(row, 'description'),
                "status": safe_get(row, 'status') or 'Activo',
                "start_date": to_dt(row.get('start_date')),
                "end_date": to_dt(row.get('end_date')),
                "po_number": safe_get(row, 'po_number'),
                "so_number": safe_get(row, 'so_number'),
                "cisco_support_end_date": to_dt(row.get('cisco_support_end_date')),
                "cisco_support_start_date": to_dt(row.get('cisco_support_start_date')),
                "cisco_contract_number": safe_get(row, 'cisco_contract_number'),
                "city": safe_get(row, 'city'),
                "address": safe_get(row, 'address'),
                "project_name": safe_get(row, 'project_name'),
                "pep": safe_get(row, 'pep'),
                "country": safe_get(row, 'country') or 'Colombia',
                "type": safe_get(row, 'type') or 'Other',
                "device_model": safe_get(row, 'device_model'),
                "contract_id": safe_get(row, 'contract_id'),
                "snow_contract": safe_get(row, 'snow_contract')
            })
            
        if records:
            chunk_size = 2000
            for i in range(0, len(records), chunk_size):
                chunk = records[i:i + chunk_size]
                ids = [r['id'] for r in chunk]
                db.query(DBConfigurationItem).filter(DBConfigurationItem.id.in_(ids)).delete(synchronize_session=False)
                db.bulk_insert_mappings(DBConfigurationItem, chunk)
                db.commit()
            return {"message": f"Se importaron {len(records)} CIs.", "count": len(records)}
            
        return {"message": "No se encontraron registros.", "count": 0}

    except Exception as e:
        db.rollback()
        print(f"CMDB IMPORT ERROR: {e}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
@router.post("/imports/catalog")
async def import_catalog(file: UploadFile = File(...), db: Session = Depends(get_db)):
    try:
        print(f"DEBUG: Starting Catalog Import: {file.filename}")
        content = await file.read()
        filename = file.filename.lower()
        
        df = None
        try:
            if filename.endswith('.csv'):
                # Try to detect separator
                preview = content[:4096].decode('utf-8', errors='ignore')
                sep = ';' if preview.count(';') > preview.count(',') else ','
                print(f"DEBUG: CSV detection - sep='{sep}'")
                df = pd.read_csv(io.BytesIO(content), sep=sep)
            else:
                try: 
                    df = pd.read_excel(io.BytesIO(content))
                except Exception as e1: 
                    print(f"DEBUG: Default Excel read failed: {e1}. Trying openpyxl.")
                    df = pd.read_excel(io.BytesIO(content), engine='openpyxl')
        except Exception as read_err:
             print(f"DEBUG: File Read Error: {read_err}")
             raise HTTPException(status_code=400, detail=f"No se pudo leer el archivo. Error: {str(read_err)}")

        if df is None or df.empty:
            raise HTTPException(status_code=400, detail="El archivo está vacío.")

        df = df.loc[:, ~df.columns.str.contains('^Unnamed')]
        headers_map = {clean_col_name(h): h for h in df.columns}
        print(f"DEBUG: Normalized Headers Found: {list(headers_map.keys())}")

        from app.models.models import CatalogService, CatalogScenario
        
        services_map = {} 
        scenarios_map = {} 
        errors = []
        
        ALIASES = {
            'service_id': ['codigo_servicio_sistema', 'id_servicio', 'cod_serv_sistema'],
            'service_name': ['servicio', 'nombre_servicio', 'nombre_del_servicio'],
            'service_desc': ['descripcion_servicio', 'desc_servicio'],
            'category': ['categoria', 'nombre_categoria'],
            'cat_code': ['codigo_categoria_sistema', 'cod_cat_sistema'],
            'cat_desc': ['descripcion_categoria'],
            'service_sief': ['codigo_sief', 'sief_servicio'],
            'scenario_id': ['codigo_tipo_sistema', 'id_tipo', 'cod_tipo_sistema'],
            'scenario_name': ['descripcion_tipo', 'nombre_tipo', 'nombre_escenario'],
            'scenario_type': ['tipo', 'tipo_escenario'],
            'scenario_sief': ['codigo_sief_tipo', 'sief_tipo']
        }

        def get_col(key):
            for alias in ALIASES.get(key, []):
                if alias in headers_map: return headers_map[alias]
            return None

        cols = {k: get_col(k) for k in ALIASES.keys()}
        print(f"DEBUG: Resolved Columns: {cols}")
        
        if not cols['service_id']:
             raise HTTPException(status_code=400, detail=f"No se encontró la columna de ID del Servicio. Detectadas: {list(headers_map.keys())}")
        
        df.dropna(how='all', inplace=True)
        
        for idx, row in df.iterrows():
            try:
                def gv(c_key):
                    c_name = cols.get(c_key)
                    if not c_name: return None
                    val = row[c_name]
                    return str(val).strip() if pd.notna(val) else None

                s_id_raw = gv('service_id')
                if not s_id_raw or s_id_raw.lower() == 'nan': continue
                
                # STRICT NORMALIZATION: Upper, Strip, and remove ANY non-alphanumeric/dash/underscore
                s_id = re.sub(r'[^a-zA-Z0-9\-_]', '', s_id_raw.strip().upper())
                if not s_id: continue
                
                if s_id not in services_map:
                    services_map[s_id] = {
                        "id": s_id,
                        "category": gv('category') or 'General',
                        "name": gv('service_name') or s_id,
                        "category_code": gv('cat_code'),
                        "category_description": gv('cat_desc'),
                        "sief_code": gv('service_sief'),
                        "service_description": gv('service_desc'),
                        "icon": "Box"
                    }
                
                sc_id_raw = gv('scenario_id')
                if sc_id_raw and sc_id_raw.lower() != 'nan':
                    # STRICT NORMALIZATION FOR SCENARIOS
                    sc_id = re.sub(r'[^a-zA-Z0-9\-_]', '', sc_id_raw.strip().upper())
                    if not sc_id: continue
                    
                    sc_type_raw = gv('scenario_type') or 'Incidente'
                    scenarios_map[sc_id] = {
                        "id": sc_id, 
                        "service_id": s_id, 
                        "sief_code": gv('scenario_sief'),
                        "name": gv('scenario_name') or sc_type_raw,
                        "type": 'request' if any(x in str(sc_type_raw).lower() for x in ['req', 'solicitud']) else 'incident',
                        "priority": "P3", "complexity": "Low", "time": "0h"
                    }
            except Exception as row_e:
                errors.append(f"Row {idx}: {str(row_e)}")

        print(f"DEBUG: Parsed {len(services_map)} Services and {len(scenarios_map)} Scenarios (Deduplicated).")

        # DB Upsert - Services & Scenarios (THE DEFINITIVE ROOT FIX: PG UPSERT)
        try:
            print(f"DEBUG: Starting Professional UPSERT for {len(services_map)} services and {len(scenarios_map)} scenarios.")

            # 1. UPSERT Services
            for s_id, s_data in services_map.items():
                db.execute(text("""
                    INSERT INTO catalog_services (id, category, name, category_code, category_description, sief_code, service_description, icon)
                    VALUES (:id, :category, :name, :category_code, :category_description, :sief_code, :service_description, :icon)
                    ON CONFLICT (id) DO UPDATE SET
                        category = EXCLUDED.category,
                        name = EXCLUDED.name,
                        category_code = EXCLUDED.category_code,
                        category_description = EXCLUDED.category_description,
                        sief_code = EXCLUDED.sief_code,
                        service_description = EXCLUDED.service_description,
                        icon = EXCLUDED.icon
                """), s_data)
            
            db.flush()

            # 2. UPSERT Scenarios
            for sc_id, sc_data in scenarios_map.items():
                db.execute(text("""
                    INSERT INTO catalog_scenarios (id, name, service_id, type, sief_code, priority, complexity, time)
                    VALUES (:id, :name, :service_id, :type, :sief_code, :priority, :complexity, :time)
                    ON CONFLICT (id) DO UPDATE SET
                        name = EXCLUDED.name,
                        service_id = EXCLUDED.service_id,
                        type = EXCLUDED.type,
                        sief_code = EXCLUDED.sief_code,
                        priority = EXCLUDED.priority,
                        complexity = EXCLUDED.complexity,
                        time = EXCLUDED.time
                """), sc_data)

            db.commit()
            print("DEBUG: Catalog Professional UPSERT successful.")
            
        except Exception as e:
            db.rollback()
            print(f"DEBUG: Professional UPSERT Failed: {e}")
            traceback.print_exc()
            raise HTTPException(status_code=400, detail=f"Error en base de datos: {str(e)}")
        
        return {
            "status": "success",
            "message": "Catálogo actualizado correctamente mediante UPSERT.",
            "services_processed": len(services_map),
            "scenarios_processed": len(scenarios_map)
        }

    except HTTPException as he:
        raise he
    except Exception as e:
        db.rollback()
        print(f"CRITICAL IMPORT ERROR: {e}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Error Crítico en Servidor: {str(e)}")
