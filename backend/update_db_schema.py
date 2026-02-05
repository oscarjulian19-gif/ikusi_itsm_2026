import os
import sys

# Force correct DB Password
os.environ["POSTGRES_PASSWORD"] = "Jero2009$"

from app.db.session import engine, Base
from app.models.models import ConfigurationItem

def create_tables():
    print("Creating tables...")
    Base.metadata.create_all(bind=engine)
    print("Tables created (if not existed).")

if __name__ == "__main__":
    create_tables()
