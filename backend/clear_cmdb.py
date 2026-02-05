import os
import sys
from sqlalchemy import text

# Force correct DB Password
os.environ["POSTGRES_PASSWORD"] = "Jero2009$"

from app.db.session import SessionLocal
from app.models.models import ConfigurationItem

def clear_cmdb():
    db = SessionLocal()
    try:
        print("Starting CMDB cleanup...")
        
        # Count before
        count = db.query(ConfigurationItem).count()
        print(f"CIs found: {count}")
        
        deleted = db.query(ConfigurationItem).delete()
        print(f"Deleted {deleted} CIs.")
        
        db.commit()
        print("CMDB cleared successfully.")
        
    except Exception as e:
        print(f"Error occurred: {repr(e)}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    clear_cmdb()
