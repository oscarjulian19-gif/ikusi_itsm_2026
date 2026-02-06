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
        print(f"DEBUG: Starting CMDB Professional UPSERT: {file.filename}")
        content = await file.read()
        filename = file.filename.lower()
        
        df = None
        try:
            if filename.endswith('.csv'):
                preview = content[:4096].decode('utf-8', errors='ignore')
                sep = ';' if preview.count(';') > preview.count(',') else ','
                df = pd.read_csv(io.BytesIO(content), sep=sep)
            else:
                try: df = pd.read_excel(io.BytesIO(content))
                except: df = pd.read_excel(io.BytesIO(content), engine='openpyxl')
        except Exception as read_err:
             raise HTTPException(status_code=400, detail=f"No se pudo leer el archivo: {str(read_err)}")

        if df is None or df.empty:
            raise HTTPException(status_code=400, detail="El archivo está vacío.")

        df = df.loc[:, ~df.columns.str.contains('^Unnamed')]
        headers_map = {clean_col_name(h): h for h in df.columns}

        CMDB_ALIASES = {
            'id_sistema': ['id', 'id_sistema', 'system_id', 'numero_de_activo_sistema', 'número_de_activo_sistema'],
            'ci_number': ['numero_ci', 'número_ci', 'ci', 'codigo_ci', 'código_ci', 'ci_number', 'numero_de_activo', 'número_de_activo', 'activo', 'numero_de_ci', 'número_de_ci'],
            'serial_number': ['serial', 'numero_serial', 'número_serial', 'sn', 's_n', 'serial_number', 'serie'],
            'reference_number': ['referencia', 'numero_referencia', 'número_referencia', 'reference'],
            'client': ['cliente', 'customer', 'empresa'],
            'description': ['descripcion', 'descripción', 'description', 'nombre_equipo'],
            'status': ['estado', 'status', 'state'],
            'start_date': ['inicio', 'fecha_inicio', 'start_date'],
            'end_date': ['fin', 'fecha_fin', 'end_date', 'expiry'],
            'po_number': ['numero_de_po', 'número_de_po', 'po', 'purchase_order', 'orden_compra'],
            'so_number': ['numero_de_so', 'número_de_so', 'so', 'sales_order', 'orden_venta'],
            'cisco_support_end': ['fecha_fin_soporte_cisco', 'cisco_support_end', 'fin_soporte'],
            'cisco_support_start': ['fecha_inicio_soporte_cisco', 'cisco_support_start', 'inicio_soporte'],
            'cisco_contract': ['contrato_cisco', 'cisco_contract'],
            'snow_contract': ['contrato_snow', 'snow_contract', 'snow'],
            'contract_id': ['numero_de_contrato', 'número_de_contrato', 'id_contrato', 'contract_id'],
            'city': ['ciudad', 'city', 'municipio'],
            'address': ['direccion', 'dirección', 'address', 'ubicacion', 'ubicación'],
            'project_name': ['nombre_proyecto', 'proyecto', 'project'],
            'pep': ['pep', 'codigo_pep', 'código_pep'],
            'country': ['pais', 'país', 'country'],
            'type': ['tipo', 'type', 'categoria_equipo', 'categoría_equipo'],
            'device_model': ['modelo_equipo', 'modelo', 'model', 'part_number']
        }

        def get_col_from_aliases(target_key):
            for alias in CMDB_ALIASES.get(target_key, []):
                if alias in headers_map: return headers_map[alias]
            return None

        resolved_cols = {k: get_col_from_aliases(k) for k in CMDB_ALIASES.keys()}
        print(f"DEBUG: Resolved CMDB Columns: {resolved_cols}")
        records = []
        
        # Get starting consecutive for the year
        now = datetime.now()
        yy = now.strftime("%y")
        prefix = yy
        
        last_ci = db.query(DBConfigurationItem).filter(DBConfigurationItem.id.like(f"{prefix}%")).order_by(DBConfigurationItem.id.desc()).first()
        consecutive = 1
        if last_ci:
            try:
                num_part = last_ci.id[2:]
                if num_part.isdigit():
                    consecutive = int(num_part) + 1
            except: pass

        seen_ids = set()
        df.fillna('', inplace=True)
        
        def to_dt(v):
            if pd.isna(v) or not str(v).strip() or str(v).lower() in ['nan', 'nat']: return None
            try:
                dt = pd.to_datetime(v)
                if pd.isna(dt): return None
                return dt.to_pydatetime()
            except: return None

        for idx, row in df.iterrows():
            def gv(k):
                c_name = resolved_cols.get(k)
                if not c_name: return ''
                val = row[c_name]
                return str(val).strip() if pd.notna(val) else ''

            # System assignment as requested
            c_id = f"{prefix}{consecutive:010d}"
            consecutive += 1
            
            if c_id in seen_ids: continue
            seen_ids.add(c_id)

            records.append({
                "id": str(c_id),
                "ci_number": gv('ci_number'),
                "serial_number": gv('serial_number'),
                "reference_number": gv('reference_number'),
                "client": gv('client') or 'Genérico',
                "description": gv('description'),
                "status": gv('status') or 'Activo',
                "start_date": to_dt(row.get(resolved_cols.get('start_date'))) if resolved_cols.get('start_date') else None,
                "end_date": to_dt(row.get(resolved_cols.get('end_date'))) if resolved_cols.get('end_date') else None,
                "po_number": gv('po_number'),
                "so_number": gv('so_number'),
                "cisco_support_end_date": to_dt(row.get(resolved_cols.get('cisco_support_end'))) if resolved_cols.get('cisco_support_end') else None,
                "cisco_support_start_date": to_dt(row.get(resolved_cols.get('cisco_support_start'))) if resolved_cols.get('cisco_support_start') else None,
                "cisco_contract_number": gv('cisco_contract'),
                "city": gv('city'),
                "address": gv('address'),
                "project_name": gv('project_name'),
                "pep": gv('pep'),
                "country": gv('country') or 'Colombia',
                "type": gv('type') or 'Other',
                "device_model": gv('device_model'),
                "contract_id": gv('contract_id'),
                "snow_contract": gv('snow_contract')
            })

        if records:
            chunk_size = 500 # Pequeño para asegurar estabilidad en UPSERT
            total_upserted = 0
            for i in range(0, len(records), chunk_size):
                chunk = records[i:i + chunk_size]
                for record in chunk:
                    db.execute(text("""
                        INSERT INTO configuration_items (
                            id, ci_number, serial_number, reference_number, client, description, status, 
                            start_date, end_date, po_number, so_number, cisco_support_end_date, 
                            cisco_support_start_date, cisco_contract_number, city, address, 
                            project_name, pep, country, type, device_model, contract_id, snow_contract
                        ) VALUES (
                            :id, :ci_number, :serial_number, :reference_number, :client, :description, :status, 
                            :start_date, :end_date, :po_number, :so_number, :cisco_support_end_date, 
                            :cisco_support_start_date, :cisco_contract_number, :city, :address, 
                            :project_name, :pep, :country, :type, :device_model, :contract_id, :snow_contract
                        ) ON CONFLICT (id) DO UPDATE SET
                            ci_number = EXCLUDED.ci_number,
                            serial_number = EXCLUDED.serial_number,
                            reference_number = EXCLUDED.reference_number,
                            client = EXCLUDED.client,
                            description = EXCLUDED.description,
                            status = EXCLUDED.status,
                            start_date = EXCLUDED.start_date,
                            end_date = EXCLUDED.end_date,
                            po_number = EXCLUDED.po_number,
                            so_number = EXCLUDED.so_number,
                            cisco_support_end_date = EXCLUDED.cisco_support_end_date,
                            cisco_support_start_date = EXCLUDED.cisco_support_start_date,
                            cisco_contract_number = EXCLUDED.cisco_contract_number,
                            city = EXCLUDED.city,
                            address = EXCLUDED.address,
                            project_name = EXCLUDED.project_name,
                            pep = EXCLUDED.pep,
                            country = EXCLUDED.country,
                            type = EXCLUDED.type,
                            device_model = EXCLUDED.device_model,
                            contract_id = EXCLUDED.contract_id,
                            snow_contract = EXCLUDED.snow_contract
                    """), record)
                db.commit()
                total_upserted += len(chunk)
                print(f"DEBUG: Upserted {total_upserted} records.")

            return {"message": f"Se procesaron {total_upserted} CIs (Nuevos o Actualizados).", "count": total_upserted}
            
        return {"message": "No se encontraron registros.", "count": 0}

    except Exception as e:
        db.rollback()
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
