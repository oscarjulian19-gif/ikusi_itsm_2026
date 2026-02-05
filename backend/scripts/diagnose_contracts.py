import sys
import os
from sqlalchemy import inspect

# Add backend to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from app.db.session import SessionLocal, engine

def diagnose():
    with open("db_error.log", "w", encoding="utf-8") as f:
        if not engine:
            f.write("No engine.\n")
            return

        try:
            inspector = inspect(engine)
            tables = inspector.get_table_names()
            f.write(f"Tablas existentes: {tables}\n")
            
            if 'contracts' not in tables:
                f.write("ERROR FATAL: La tabla 'contracts' no existe en la DB.\n")
                return

            # Check columns
            columns = [c['name'] for c in inspector.get_columns('contracts')]
            f.write(f"Columnas en 'contracts': {columns}\n")
            
            required = ['id', 'client', 'pep', 'service_package', 'sla_type']
            missing = [c for c in required if c not in columns]
            if missing:
                f.write(f"ERROR FATAL: Faltan columnas: {missing}\n")
            else:
                f.write("Todas las columnas requeridas existen.\n")

        except Exception as e:
            f.write(f"Error inspeccionando DB: {e}\n")

if __name__ == "__main__":
    diagnose()
