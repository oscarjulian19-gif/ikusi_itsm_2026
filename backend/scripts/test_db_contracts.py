import sys
import os

# Add backend directory to python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from sqlalchemy import create_engine, text
from app.core.config import get_settings
settings = get_settings()

def test_contracts_db():
    print(f"Connecting to DB: {settings.POSTGRES_SERVER}/{settings.POSTGRES_DB}...")
    try:
        engine = create_engine(settings.SQLALCHEMY_DATABASE_URI)
        connection = engine.connect()
        print("Successfully connected to PostgreSQL.")
        
        # 1. Check Table Existence
        print("Checking 'contracts' table...")
        result = connection.execute(text("SELECT to_regclass('public.contracts');"))
        if result.scalar() is None:
            print("ERROR: Table 'contracts' does not exist!")
            return
        print("Table 'contracts' exists.")
        
        # 2. Count Records
        result = connection.execute(text("SELECT count(*) FROM contracts;"))
        count = result.scalar()
        print(f"Current Contract Count: {count}")
        
        # 3. Read Verification
        if count > 0:
            result = connection.execute(text("SELECT id, client, status FROM contracts LIMIT 3;"))
            print("First 3 records:")
            for row in result:
                print(f" - {row}")
        
        # 4. Write Verification (Insert & Delete)
        print("Testing Write permissions...")
        test_id = "TEST_DB_CHECK_001"
        try:
            # Cleanup JUST IN CASE
            connection.execute(text(f"DELETE FROM contracts WHERE id = '{test_id}'"))
            connection.commit()
            
            # Insert
            connection.execute(text(f"""
                INSERT INTO contracts (id, client, status, description, start_date)
                VALUES ('{test_id}', 'TEST_CLIENT', 'Preliminar', 'Database Check', '2026-01-01')
            """))
            connection.commit()
            print(f"Inserted test contract {test_id}.")
            
            # Verify Insert
            res = connection.execute(text(f"SELECT id FROM contracts WHERE id = '{test_id}'"))
            if res.scalar():
                print("Write verification SUCCESS.")
            else:
                print("Write verification FAILED (Insert appeared to succeed but record not found).")
            
            # Cleanup
            connection.execute(text(f"DELETE FROM contracts WHERE id = '{test_id}'"))
            connection.commit()
            print("Cleaned up test record.")
            
        except Exception as e:
            print(f"Write Test FAILED: {e}")
            
        connection.close()
        print("\nOVERALL STATUS: Contracts Database Connection OK.")
        
    except Exception as e:
        print(f"\nCRITICAL ERROR: Cannot connect or query database.\n{e}")

if __name__ == "__main__":
    test_contracts_db()
