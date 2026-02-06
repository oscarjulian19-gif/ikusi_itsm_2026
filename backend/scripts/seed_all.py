import sys
import os
from datetime import datetime

# Add parent directory to path to import app modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.db.session import SessionLocal, engine, Base
from app.models.models import Ticket, Contract, ConfigurationItem, User, CatalogService, CatalogScenario

# Data from initialData.js and mocked logic
INITIAL_CIS = [
    { "id": 'CI-1001', "serial_number": "SN-1001", "type": 'Server', "device_model": 'PowerEdge', "client": 'Banco Futuro', "status": "Active" },
    { "id": 'CI-1002', "serial_number": "SN-1002", "type": 'Firewall', "device_model": 'Gate 200F', "client": 'Retail Global S.A.', "status": "Active" },
    { "id": 'CI-1003', "serial_number": "SN-1003", "type": 'Switch', "device_model": 'Catalyst 9300', "client": 'Logística Express', "status": "Active" },
    { "id": 'CI-1004', "serial_number": "SN-1004", "type": 'Virtual Machine', "device_model": 'vSphere 7', "client": 'Banco Futuro', "status": "Active" },
    { "id": 'CI-1005', "serial_number": "SN-1005", "type": 'Router', "device_model": 'ISR 4000', "client": 'Retail Global S.A.', "status": "Active" }
]

INITIAL_TICKETS = [
    {
        "id": 'INC-10001',
        "title": 'Caída de base de datos principal',
        "client": 'Banco Futuro',
        "priority": 'P1',
        "status": 'Cerrado',
        "description": 'La base de datos de producción no responde a ping.',
        "ticket_type": "incident",
        "created_at": datetime(2025, 10, 1, 8, 0)
    },
    {
        "id": 'REQ-20001',
        "title": 'Nuevo usuario VPN',
        "client": 'Retail Global S.A.',
        "priority": 'P3',
        "status": 'Cerrado',
        "description": 'Crear acceso VPN para empleado temporal.',
        "ticket_type": "request",
        "created_at": datetime(2025, 10, 2, 9, 0)
    },
    {
        "id": 'INC-10002',
        "title": 'Lentitud en CRM',
        "client": 'Logística Express',
        "priority": 'P2',
        "status": 'En Progreso',
        "description": 'Usuarios reportan lentitud al cargar fichas de clientes.',
        "ticket_type": "incident",
        "created_at": datetime(2026, 1, 29, 14, 0)
    },
    {
        "id": 'INC-10003',
        "title": 'Fallo en backup nocturno',
        "client": 'Banco Futuro',
        "priority": 'P3',
        "status": 'Abierto',
        "description": 'El job de backup falló con código de error 55.',
        "ticket_type": "incident",
        "created_at": datetime(2026, 1, 30, 6, 0)
    }
]

INITIAL_CONTRACTS = [
    {
        "id": "CTR-001",
        "client": "Banco Futuro",
        "description": "Soporte Integral Infraestructura 2025",
        "status": "Activo",
        "service_package": "Premium",
        "start_date": datetime(2025, 1, 1),
        "end_date": datetime(2025, 12, 31)
    },
    {
        "id": "CTR-002",
        "client": "Retail Global S.A.",
        "description": "Mantenimiento Redes y Seguridad",
        "status": "Activo",
        "service_package": "Standard",
        "start_date": datetime(2025, 3, 1),
        "end_date": datetime(2026, 3, 1)
    },
    {
        "id": "CTR-003",
        "client": "Logística Express",
        "description": "Consultoría Cloud Azure",
        "status": "Borrador",
        "service_package": "Basic",
        "start_date": datetime(2026, 1, 1),
        "end_date": datetime(2026, 6, 30)
    }
]

SERVICES = [
    {
        "id": "NET-SW", # Codigo_Servicio_Sistema
        "category": "Conectividad y Red", # Categoria
        "name": "Switching & LAN", # Servicio
        "icon": "Network",
        
        # New Fields
        "category_code": "CAT-NET", # Codigo_Categoria_Sistema
        "category_description": "Servicios de red y conectividad", # Descripcion_Categoria
        "sief_code": "SIEF-NET-01", # Codigo_SIEF
        "service_description": "Servicio de Switching L2/L3" # Descripcion_Servicio
    },
    {
        "id": "SEC-FW", 
        "category": "Seguridad", 
        "name": "Firewall Services", 
        "icon": "Shield",
        "category_code": "CAT-SEC",
        "category_description": "Servicios de seguridad perimetral",
        "sief_code": "SIEF-SEC-01",
        "service_description": "Gestión de Firewalls NextGen"
    },
    {
        "id": "CLOUD-AZ", 
        "category": "Cloud & Access", 
        "name": "Azure Cloud", 
        "icon": "Cloud",
        "category_code": "CAT-CLD",
        "category_description": "Servicios de nube pública",
        "sief_code": "SIEF-CLD-01",
        "service_description": "Infraestructura Azure IaaS/PaaS"
    },
    {
        "id": "ENT-AD", 
        "category": "Servicios Empresariales", 
        "name": "Active Directory", 
        "icon": "Globe",
        "category_code": "CAT-ENT",
        "category_description": "Servicios de identidad corporativa",
        "sief_code": "SIEF-ENT-01",
        "service_description": "Gestión de Directorio Activo"
    }
]

SCENARIOS = [
    {
        "id": "INC-SRV-SEC-FW-RULES", 
        "name": "Rules", 
        "service_id": "SEC-FW", 
        "type": "incident", 
        "priority": "P2",
        "sief_code": "SIEF-INC-FW-01" # Codigo_SIEF_Tipo
    },
    {
        "id": "REQ-SRV-NET-SW-VLAN", 
        "name": "Vlan Configuration", 
        "service_id": "NET-SW", 
        "type": "request", 
        "complexity": "Medium", 
        "time": "4h",
        "sief_code": "SIEF-REQ-SW-01"
    },
    {
        "id": "INC-SRV-NET-SW-DOWN", 
        "name": "Device Down", 
        "service_id": "NET-SW", 
        "type": "incident", 
        "priority": "P1",
        "sief_code": "SIEF-INC-SW-01"
    },
    {
        "id": "REQ-SRV-ENT-AD-NEWUSER", 
        "name": "New User Provisioning", 
        "service_id": "ENT-AD", 
        "type": "request", 
        "complexity": "Low", 
        "time": "1h",
        "sief_code": "SIEF-REQ-AD-01"
    }
]

def seed_all():
    print("Initializing Database Seeding...")
    # Base.metadata.drop_all(bind=engine) # DISABLED SAFETY
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    try:
        # 1. Configuration Items
        print("Seeding CIs...")
        for ci_data in INITIAL_CIS:
            db.add(ConfigurationItem(**ci_data))
        
        # 2. Tickets
        print("Seeding Tickets...")
        for t_data in INITIAL_TICKETS:
            db.add(Ticket(**t_data))

        # 3. Contracts
        print("Seeding Contracts...")
        for c_data in INITIAL_CONTRACTS:
            db.add(Contract(**c_data))

        # 4. Catalog Service
        print("Seeding Catalog Services...")
        for s in SERVICES:
            db.add(CatalogService(**s))

        # 5. Catalog Scenarios
        print("Seeding Catalog Scenarios...")
        for sc in SCENARIOS:
            db.add(CatalogScenario(**sc))

        db.commit()
        print("All data seeded successfully!")
        
    except Exception as e:
        print(f"Error seeding data: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_all()
