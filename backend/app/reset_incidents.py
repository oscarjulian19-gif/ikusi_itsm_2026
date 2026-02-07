from sqlalchemy import text
from app.db.session import engine, SessionLocal
from app.models.models import Ticket, TicketPause, CatalogService, CatalogScenario, SLASetting, ServicePackageSetting

def reset_incident_module():
    print("Iniciando reseteo del módulo de incidentes...")
    with SessionLocal() as db:
        try:
            # Borrar datos transaccionales (Tickets y Pausas)
            db.query(TicketPause).delete()
            db.query(Ticket).delete()
            print("Datos de tickets y pausas eliminados.")

            # Borrar configuración del catálogo (Estructura de Incidentes/Requerimientos)
            db.query(CatalogScenario).delete()
            db.query(CatalogService).delete()
            print("Catálogo de servicios y escenarios eliminado.")

            # Borrar configuración de SLAs y Paquetes
            db.query(SLASetting).delete()
            db.query(ServicePackageSetting).delete()
            print("Configuración de SLAs y paquetes eliminada.")

            db.commit()
            print("Reseteo completado exitosamente. El módulo está en 0.")
        except Exception as e:
            db.rollback()
            print(f"Error durante el reseteo: {e}")

if __name__ == "__main__":
    reset_incident_module()
