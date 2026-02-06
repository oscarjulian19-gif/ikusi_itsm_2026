from app.db.session import SessionLocal, engine
from app.models.models import Base, CatalogService, CatalogScenario
from app.core.config import get_settings

# Manual data structure mirroring catalogData.js
# In a real scenario, we would parse the JS file or import from a JSON
# For now, I will add a few critical samples to verify functionality for the user

SERVICES = [
    {"id": "NET-SW", "category": "Conectividad y Red", "name": "Switching & LAN", "icon": "Network"},
    {"id": "SEC-FW", "category": "Seguridad", "name": "Firewall Services", "icon": "Shield"},
]

SCENARIOS = [
    {"id": "INC-SRV-SEC-FW-RULES", "name": "Rules", "service_id": "SEC-FW", "type": "incident", "priority": "P2"},
    {"id": "REQ-SRV-NET-SW-VLAN", "name": "Vlan", "service_id": "NET-SW", "type": "request", "complexity": "Medium", "time": "4h"}
]

def seed_catalog():
    print("Re-creating tables...")
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        print("Seeding Services...")
        for s in SERVICES:
            existing = db.query(CatalogService).filter_by(id=s["id"]).first()
            if not existing:
                db.add(CatalogService(
                    id=s["id"],
                    category=s["category"],
                    name=s["name"],
                    icon=s["icon"]
                ))
        
        print("Seeding Scenarios...")
        for sc in SCENARIOS:
            existing = db.query(CatalogScenario).filter_by(id=sc["id"]).first()
            if not existing:
                db.add(CatalogScenario(
                    id=sc["id"],
                    name=sc["name"],
                    service_id=sc["service_id"],
                    type=sc["type"],
                    priority=sc.get("priority"),
                    complexity=sc.get("complexity"),
                    time=sc.get("time")
                ))
        
        db.commit()
        print("Catalog Seeded Successfully!")
        
    except Exception as e:
        print(f"Error seeding: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_catalog()
