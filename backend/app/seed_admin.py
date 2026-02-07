from app.db.session import SessionLocal
from app.models.models import User

def seed_admin():
    print("Verificando usuario administrador...")
    with SessionLocal() as db:
        try:
            admin_email = "oscar.gomez@ikusi.com"
            admin = db.query(User).filter(User.email == admin_email).first()
            
            if not admin:
                print(f"Creando usuario admin: {admin_email}")
                new_admin = User(
                    full_name="Oscar Gomez Mora",
                    email=admin_email,
                    password="cisco",
                    role="Admin",
                    job_title="System Administrator",
                    is_active=True
                )
                db.add(new_admin)
                db.commit()
                print("Administrador creado exitosamente.")
            else:
                # Asegurar que tenga los datos requeridos
                admin.password = "cisco"
                admin.role = "Admin"
                db.commit()
                print("Usuario administrador ya existe. Credenciales actualizadas.")
        except Exception as e:
            db.rollback()
            print(f"Error: {e}")

if __name__ == "__main__":
    seed_admin()
