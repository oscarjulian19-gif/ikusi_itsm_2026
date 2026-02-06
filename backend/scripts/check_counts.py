import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.db.session import SessionLocal
from app.models.models import Ticket, Contract, ConfigurationItem, CatalogService

def check_data():
    db = SessionLocal()
    try:
        tickets = db.query(Ticket).count()
        contracts = db.query(Contract).count()
        cis = db.query(ConfigurationItem).count()
        services = db.query(CatalogService).count()
        
        print(f"Tickets: {tickets}")
        print(f"Contracts: {contracts}")
        print(f"CIs: {cis}")
        print(f"Catalog Services: {services}")
        
    finally:
        db.close()

if __name__ == "__main__":
    check_data()
