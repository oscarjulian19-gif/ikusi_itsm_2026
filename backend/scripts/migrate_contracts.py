import sys
import os
from sqlalchemy import create_engine, text

sys.path.append(os.path.join(os.path.dirname(__file__), '..'))
from app.core.config import get_settings

def migrate():
    s = get_settings()
    engine = create_engine(s.SQLALCHEMY_DATABASE_URI)
    
    commands = [
        "ALTER TABLE contracts ADD COLUMN IF NOT EXISTS service_package VARCHAR",
        "ALTER TABLE contracts ADD COLUMN IF NOT EXISTS sla_type VARCHAR",
        "ALTER TABLE contracts ADD COLUMN IF NOT EXISTS custom_attention_min INTEGER",
        "ALTER TABLE contracts ADD COLUMN IF NOT EXISTS custom_solution_hours INTEGER"
    ]
    
    try:
        with engine.connect() as conn:
            with conn.begin(): # Transaction
                for cmd in commands:
                    conn.execute(text(cmd))
                    print(f"Executed: {cmd}")
        print("Migration completed.")
    except Exception as e:
        print(f"Migration failed: {e}")

if __name__ == "__main__":
    migrate()
