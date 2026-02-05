from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.models.models import ConfigurationItem
import sys

def clear_cmdb():
    db = SessionLocal()
    try:
        count = db.query(ConfigurationItem).delete()
        db.commit()
        print(f"Deleted {count} CMDB items.")
    except Exception as e:
        db.rollback()
        print(f"Error clearing CMDB: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    clear_cmdb()
