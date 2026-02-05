import os
import sys

# Force correct DB Password for this script execution
os.environ["POSTGRES_PASSWORD"] = "Jero2009$"

from app.db.session import SessionLocal
from app.models.models import Contract, ContractCI

# Ensure headers/text can print safely on Windows terminal if needed
try:
    sys.stdout.reconfigure(encoding='utf-8')
except:
    pass

def clear_data():
    db = SessionLocal()
    try:
        print("Starting deletion...")
        
        # Count before
        c_count = db.query(Contract).count()
        print(f"Contracts found: {c_count}")
        
        # Delete independent/child first
        deleted_cis = db.query(ContractCI).delete()
        print(f"Deleted {deleted_cis} CIs.")
        
        deleted_contracts = db.query(Contract).delete()
        print(f"Deleted {deleted_contracts} Contracts.")
        
        db.commit()
        print("Database cleared successfully.")
        
        # Verify
        c_count_after = db.query(Contract).count()
        print(f"Remaining contracts: {c_count_after}")
        
    except Exception as e:
        print(f"Error occurred: {repr(e)}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    clear_data()
