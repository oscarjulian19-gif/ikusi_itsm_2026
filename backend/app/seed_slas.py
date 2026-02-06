from sqlalchemy import text
from app.db.session import engine
from app.models.models import SLASetting, ServicePackageSetting
from sqlalchemy.orm import Session

def seed():
    print("Seeding SLA and Package settings...")
    with Session(engine) as db:
        # Check if they already have data
        if db.query(SLASetting).count() == 0:
            slas = [
                SLASetting(id='Bajo', name='SLA Bajo (P3/P4)', attention_min=60, solution_hours=24, attention_display='1 Hora', solution_display='24 Horas'),
                SLASetting(id='Medio', name='SLA Medio (P2)', attention_min=45, solution_hours=12, attention_display='45 Minutos', solution_display='12 Horas'),
                SLASetting(id='Alto', name='SLA Alto (P1)', attention_min=30, solution_hours=8, attention_display='30 Minutos', solution_display='8 Horas'),
                SLASetting(id='Critico', name='SLA Crítico (24x7 P1)', attention_min=15, solution_hours=4, attention_display='15 Minutos', solution_display='4 Horas'),
                SLASetting(id='Customizado', name='SLA Customizado', attention_min=0, solution_hours=0, attention_display='X Minutos', solution_display='X Horas'),
            ]
            db.add_all(slas)
            print("SLA settings seeded.")

        if db.query(ServicePackageSetting).count() == 0:
            pkgs = [
                ServicePackageSetting(name='IKUSI Básico', description='Cobertura estándar para servicios Básico'),
                ServicePackageSetting(name='IKUSI Go', description='Cobertura estándar para servicios Go'),
                ServicePackageSetting(name='IKUSI Plus', description='Cobertura estándar para servicios Plus'),
                ServicePackageSetting(name='IKUSI Pro', description='Cobertura estándar para servicios Pro'),
                ServicePackageSetting(name='IKUSI Sum', description='Cobertura estándar para servicios Sum'),
                ServicePackageSetting(name='IKUSI Servicio Customizado', description='Cobertura estándar para servicios Servicio Customizado'),
            ]
            db.add_all(pkgs)
            print("Service packages seeded.")
        
        db.commit()

if __name__ == "__main__":
    seed()
