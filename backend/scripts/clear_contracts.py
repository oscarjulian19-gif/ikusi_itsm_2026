import sys
import os

# Add backend directory to python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from sqlalchemy import create_engine, text
from app.core.config import get_settings

def clear_contracts():
    settings = get_settings()
    engine = create_engine(settings.SQLALCHEMY_DATABASE_URI)
    with engine.connect() as connection:
        print("Clearing 'contracts' and 'contract_cis' tables...")
        connection.execute(text("TRUNCATE TABLE contract_cis, contracts RESTART IDENTITY CASCADE;"))
        connection.commit()
        print("Contracts data cleared successfully.")

if __name__ == "__main__":
    clear_contracts()
