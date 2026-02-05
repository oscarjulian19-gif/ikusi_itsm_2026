import os
import sqlalchemy
from sqlalchemy import text, create_engine

# Set password BEFORE anything else
os.environ["POSTGRES_PASSWORD"] = "Jero2009$"

DB_URL = "postgresql+pg8000://postgres:Jero2009$@localhost:5432/ikusi_service_db"

def update_pep_column():
    engine = create_engine(DB_URL)
    with engine.connect() as conn:
        print("Altering 'pep' column length in 'contracts' table...")
        try:
            conn.execute(text("ALTER TABLE contracts ALTER COLUMN pep TYPE VARCHAR;"))
            # For sqlalchemy 2.0+ we need to commit on the connection if using engine.connect()
            conn.commit()
            print("Successfully updated 'pep' column.")
        except Exception as e:
            print(f"Error updating column: {e}")

if __name__ == "__main__":
    update_pep_column()
