import sys
import os

# Add backend directory to python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from sqlalchemy import create_engine
from app.core.config import get_settings
from app.db.session import Base
from app.models.models import Ticket, TicketPause, Contract, ContractCI, ConfigurationItem, User

settings = get_settings()

# Create engine
engine = create_engine(settings.SQLALCHEMY_DATABASE_URI)

def reset_db():
    print("WARNING: This will DROP ALL TABLES and recreate them.")
    print(f"Target DB: {settings.POSTGRES_DB} on {settings.POSTGRES_SERVER}")
    
    # Drop all
    print("Dropping all tables...")
    Base.metadata.drop_all(bind=engine)
    
    # Create all
    print("Creating all tables...")
    Base.metadata.create_all(bind=engine)
    
    print("Database reset complete. All data has been cleared.")

if __name__ == "__main__":
    reset_db()
