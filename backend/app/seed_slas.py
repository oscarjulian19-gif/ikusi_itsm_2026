from app.db.session import SessionLocal
from app.models.models import SLASetting, ServicePackageSetting

def seed():
    print("Iniciando restauración de ANS y Paquetes de Servicio...")
    with SessionLocal() as db:
        try:
            # 1. Limpiar datos actuales
            db.query(SLASetting).delete()
            db.query(ServicePackageSetting).delete()
            print("Tablas de configuración limpias.")

            # 2. Restaurar Paquetes de Servicio (Look and Feel Ikusi)
            pkgs = [
                ServicePackageSetting(name='IKUSI Básico', description='Cobertura operativa estándar para servicios esenciales.'),
                ServicePackageSetting(name='IKUSI Go', description='Soporte ágil enfocado en tiempos de respuesta optimizados.'),
                ServicePackageSetting(name='IKUSI Plus', description='Gestión integral con prioridad balanceada y monitoreo.'),
                ServicePackageSetting(name='IKUSI Pro', description='Soporte profesional avanzado con alta disponibilidad.'),
                ServicePackageSetting(name='IKUSI Sum', description='Máximo nivel de servicio con tiempos de respuesta críticos.'),
                ServicePackageSetting(name='Servicio Customizado', description='Acuerdos de nivel de servicio a la medida del cliente.'),
            ]
            db.add_all(pkgs)
            print("Paquetes de servicio restaurados.")

            # 3. Configurar Prioridades de Incidentes
            incident_slas = [
                SLASetting(
                    id='P1', 
                    name='Afectación total de servicio', 
                    attention_min=15, 
                    solution_hours=4, 
                    attention_display='15 Minutos', 
                    solution_display='4 Horas'
                ),
                SLASetting(
                    id='P2', 
                    name='Afectación parcial del servicio', 
                    attention_min=45, 
                    solution_hours=8, 
                    attention_display='45 Minutos', 
                    solution_display='8 Horas'
                ),
                SLASetting(
                    id='P3', 
                    name='Servicio activo con riesgo de afectación', 
                    attention_min=120, 
                    solution_hours=24, 
                    attention_display='2 Horas', 
                    solution_display='24 Horas'
                ),
                SLASetting(
                    id='P4', 
                    name='Consulta técnica', 
                    attention_min=240, 
                    solution_hours=72, 
                    attention_display='4 Horas', 
                    solution_display='72 Horas'
                ),
            ]
            db.add_all(incident_slas)

            # 4. Configurar Prioridades de Requerimientos
            req_slas = [
                SLASetting(
                    id='REQ_ALTA', 
                    name='Requerimiento Prioridad Alta', 
                    attention_min=480, 
                    solution_hours=72, 
                    attention_display='8 Horas', 
                    solution_display='3 Días'
                ),
                SLASetting(
                    id='REQ_MEDIA', 
                    name='Requerimiento Prioridad Media', 
                    attention_min=1440, 
                    solution_hours=120, 
                    attention_display='24 Horas', 
                    solution_display='5 Días'
                ),
                SLASetting(
                    id='REQ_BAJA', 
                    name='Requerimiento Prioridad Baja', 
                    attention_min=2880, 
                    solution_hours=240, 
                    attention_display='48 Horas', 
                    solution_display='10 Días'
                ),
            ]
            db.add_all(req_slas)

            db.commit()
            print("Seeding completado exitosamente.")
        except Exception as e:
            db.rollback()
            print(f"Error durante el seeding: {e}")

if __name__ == "__main__":
    seed()
