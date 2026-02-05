import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))
from app.db.session import engine
from app.models.models import Base

# Import all models to ensure they are registered in Base
from app.models.models import Ticket, TicketPause, Contract, ContractCI, ConfigurationItem, User

def init_tables():
    print("Creating tables via SQLAlchemy...")
    try:
        Base.metadata.create_all(bind=engine)
        print("Tables check/creation completed.")
    except Exception as e:
        print(f"Error creating tables: {e}")

if __name__ == "__main__":
    init_tables()
