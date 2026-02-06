from sqlalchemy import text
from app.db.session import engine

def migrate():
    print("Running migration for Ticket table...")
    with engine.connect() as conn:
        try:
            # Columns to check
            columns = [
                ("service_category", "VARCHAR(255)"),
                ("ticket_type", "VARCHAR(255)"),
                ("requester_name", "VARCHAR(255)"),
                ("serial_number", "VARCHAR(255)"),
                ("vendor_case_id", "VARCHAR(255)"),
                ("service_name", "VARCHAR(255)")
            ]
            
            for col_name, col_type in columns:
                res = conn.execute(text(f"SELECT column_name FROM information_schema.columns WHERE table_name='tickets' AND column_name='{col_name}'"))
                if not res.fetchone():
                    print(f"Adding column '{col_name}' to 'tickets' table...")
                    conn.execute(text(f"ALTER TABLE tickets ADD COLUMN {col_name} {col_type}"))
                    print(f"Column '{col_name}' added successfully!")
                else:
                    print(f"Column '{col_name}' already exists.")
            
            conn.commit()
            print("Migration completed!")
        except Exception as e:
            print(f"Migration error: {e}")

if __name__ == "__main__":
    migrate()
