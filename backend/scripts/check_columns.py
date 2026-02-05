import sys
import os
from sqlalchemy import create_engine, text

# Add backend to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))
from app.core.config import get_settings

def check():
    s = get_settings()
    uri = s.SQLALCHEMY_DATABASE_URI
    try:
        e = create_engine(uri)
        with e.connect() as c:
            # Check columns in contracts
            r = c.execute(text("SELECT column_name FROM information_schema.columns WHERE table_name = 'contracts'"))
            cols = [row[0] for row in r.fetchall()]
            
            with open("cols_info.txt", "w") as f:
                f.write(str(cols))
            
    except Exception as e:
        with open("simple_error.txt", "w") as f:
            f.write(str(e))

if __name__ == "__main__":
    check()
