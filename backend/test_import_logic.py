import os
import io
import pandas as pd
from datetime import datetime
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Set env before importing session if possible, but here we define our own for test
os.environ["POSTGRES_PASSWORD"] = "Jero2009$"

# Manually define models or import carefully
from app.models.models import Base, Contract as DBContract
from app.db.session import SessionLocal

def test_import():
    # Mock file content - you'll need to provide an actual path to a file that failed
    # For now, let's just test the DB connection and a single insert
    db = SessionLocal()
    try:
        print("Testing DB Connection...")
        count = db.query(DBContract).count()
        print(f"Current contracts: {count}")
        
        # Test ID auto-gen logic
        now = datetime.now()
        yy = now.strftime("%y")
        prefix = f"CNTR{yy}"
        
        last_c = db.query(DBContract).filter(DBContract.id.like(f"{prefix}%")).order_by(DBContract.id.desc()).first()
        print(f"Last contract found: {last_c.id if last_c else 'None'}")
        
    except Exception as e:
        print(f"TEST FAILED: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    test_import()
