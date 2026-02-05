import os
os.environ["POSTGRES_PASSWORD"] = "Jero2009$"

from sqlalchemy import text
from app.db.session import SessionLocal
from app.models.models import Contract, ConfigurationItem

def check_counts():
    db = SessionLocal()
    try:
        contracts_count = db.query(Contract).count()
        ci_count = db.query(ConfigurationItem).count()
        
        print(f"Contracts in DB: {contracts_count}")
        print(f"CIs in DB: {ci_count}")
        
    finally:
        db.close()

if __name__ == "__main__":
    check_counts()
