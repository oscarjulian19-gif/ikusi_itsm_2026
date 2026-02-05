# from app.models.models import Contract as DBContract
import pandas as pd
import io
from datetime import datetime
import traceback

# Mocking the session and DB logic for the specific snippet diagnosis
class MockDB:
    def query(self, *args): return self
    def filter(self, *args): return self
    def order_by(self, *args): return self
    def first(self): return None
    def delete(self, *args): pass
    def bulk_insert_mappings(self, *args): pass
    def commit(self): pass
    def rollback(self): pass

def run_import_logic():
    print("Starting reproduction script...")
    
    file_path = "backend/test_contract_data.csv"
    with open(file_path, "rb") as f:
        content = f.read()
    
    # Simulate the logic in imports.py exactly
    try:
        df = pd.read_csv(io.BytesIO(content))
        print("Read CSV successfully.")
        print("Columns found:", df.columns.tolist())
        
        col_map = {
            'numero de contrato': 'id', 'contrato': 'id',
            'cliente': 'client',
            'descripcion contrato': 'description', 'descripcion': 'description',
            'folio': 'folio',
            'ans asociado': 'sla_type', 'ans': 'sla_type', 'sla': 'sla_type',
            'nombre de proyecto': 'project_name', 'proyecto': 'project_name',
            'pep': 'pep',
            'estado': 'status',
            'inicio contrato': 'start_date', 'inicio': 'start_date',
            'fin contrato': 'end_date', 'fin': 'end_date',
            'project manager': 'pm',
            'paquete de servicio': 'service_package',
            'descripcion del paquete': 'package_description', 
            'descripcion del paquete de servicio': 'package_description',
            'horario': 'schedule',
            'horario paquete de servicio': 'schedule',
            'sdm': 'sdm',
            'vendor': 'sales_rep'
        }

        target_to_source = {}
        for raw_col in df.columns:
            clean_col = str(raw_col).lower().strip()
            for key, val in col_map.items():
                if key == clean_col:
                    if val not in target_to_source:
                         target_to_source[val] = raw_col
                    break
        
        print("Mapping created:", target_to_source)
        
        new_data = {}
        for target_col, source_col in target_to_source.items():
            series = df[source_col]
            if isinstance(series, pd.DataFrame):
                print(f"Duplicate found for {target_col} ({source_col})")
                series = series.iloc[:, 0]
            new_data[target_col] = series
            
        clean_df = pd.DataFrame(new_data)
        print("Clean DF created. Columns:", clean_df.columns.tolist())
        
        clean_df.dropna(how='all', inplace=True)
        clean_df = clean_df.astype(object)
        clean_df = clean_df.where(pd.notnull(clean_df), None)

        prefix = "CNTR26"
        consecutive = 1
        records = []
        
        def get_stat_val(row, col):
            val = row.get(col)
            if val is None: return ''
            if isinstance(val, (pd.Series, pd.DataFrame)):
                print(f"AMBIGUITY DETECTED for {col}!")
                print(f"Value type: {type(val)}")
                print(f"Value: {val}")
                if val.empty: return ''
                val = val.iloc[0]
            return str(val).strip()

        for idx, row in clean_df.iterrows():
            client = get_stat_val(row, 'client')
            if not client: continue 
            print(f"Processing row {idx}, Client: {client}")

            c_id = get_stat_val(row, 'id')
            # ... skipped full logic, just checking basic access ...
            
            recs = {
                "id": c_id,
                "client": client,
                "pep": get_stat_val(row, 'pep'),
            }
            records.append(recs)

        print(f"Successfully processed {len(records)} records.")
        return True

    except Exception as e:
        print(f"CRITICAL ERROR: {e}")
        traceback.print_exc()
        return False

if __name__ == "__main__":
    run_import_logic()
