from sqlalchemy import text
from app.db.session import engine

def migrate():
    print("Running migration for missing columns...")
    with engine.connect() as conn:
        try:
            # Check if ci_number exists in configuration_items
            res = conn.execute(text("SELECT column_name FROM information_schema.columns WHERE table_name='configuration_items' AND column_name='ci_number'"))
            if not res.fetchone():
                print("Adding column 'ci_number' to 'configuration_items' table...")
                conn.execute(text("ALTER TABLE configuration_items ADD COLUMN ci_number VARCHAR(100)"))
                print("Column added successfully!")
            else:
                print("Column 'ci_number' already exists.")
            
            conn.commit()
        except Exception as e:
            print(f"Migration error: {e}")

if __name__ == "__main__":
    migrate()
