import os
from sqlalchemy import text, create_engine

os.environ["POSTGRES_PASSWORD"] = "Jero2009$"
DB_URL = "postgresql+pg8000://postgres:Jero2009$@localhost:5432/ikusi_service_db"

def remove_pep_unique_constraint():
    engine = create_engine(DB_URL)
    with engine.connect() as conn:
        print("Removing unique constraint on 'pep' in 'contracts' table...")
        try:
            # Drop the unique constraint. The name is usually table + column + _key
            conn.execute(text("ALTER TABLE contracts DROP CONSTRAINT IF EXISTS contracts_pep_key;"))
            conn.commit()
            print("Successfully removed 'contracts_pep_key'.")
        except Exception as e:
            print(f"Error removing constraint: {e}")

if __name__ == "__main__":
    remove_pep_unique_constraint()
