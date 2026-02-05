import os
import sys
from sqlalchemy import text

# Force correct DB Password
os.environ["POSTGRES_PASSWORD"] = "Jero2009$"

from app.db.session import SessionLocal
from app.models.models import Contract

def update_country():
    db = SessionLocal()
    try:
        print("Starting update...")
        
        # Execute update
        # We can use bulk update via query
        rows_updated = db.query(Contract).update({Contract.country: "Colombia"})
        
        db.commit()
        print(f"Updated {rows_updated} contracts to Country='Colombia'.")
        
    except Exception as e:
        print(f"Error occurred: {repr(e)}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    update_country()
