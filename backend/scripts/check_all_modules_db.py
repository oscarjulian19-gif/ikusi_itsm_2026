import sys
import os

# Add backend directory to python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from sqlalchemy import create_engine, text
from app.core.config import get_settings

def check_modules():
    settings = get_settings()
    print(f"Checking Database Connectivity...")
    print(f"Target: {settings.POSTGRES_SERVER}/{settings.POSTGRES_DB}")
    
    try:
        engine = create_engine(settings.SQLALCHEMY_DATABASE_URI)
        connection = engine.connect()
        print("[OK] Connection Established.")
        
        modules = {
            "Contracts": "contracts",
            "Incidents (Tickets)": "tickets",
            "CMDB (Assets)": "configuration_items",
            "Users (Auth)": "users"
        }
        
        all_good = True
        
        for name, table in modules.items():
            try:
                # Check table existence and count
                # Using to_regclass to be safe against SQL injection (though checking internal string)
                # Simple select count is enough to prove table exists and is readable
                res = connection.execute(text(f"SELECT count(*) FROM {table}"))
                count = res.scalar()
                print(f"[OK] Module '{name}' is CONNECTED. Records: {count}")
            except Exception as e:
                print(f"[FAILED] Module '{name}' check failed. Error: {e}")
                all_good = False
        
        connection.close()
        
        if all_good:
            print("\nSUCCESS: All application modules are correctly connected to PostgreSQL.")
        else:
            print("\nWARNING: Some modules failed to connect or query their tables.")
            
    except Exception as e:
        print(f"\nCRITICAL: Could not connect to database server. {e}")

if __name__ == "__main__":
    check_modules()
