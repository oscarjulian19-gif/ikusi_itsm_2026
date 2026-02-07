from sqlalchemy import text
from app.db.session import engine

def migrate():
    print("Iniciando migración manual de tabla users...")
    with engine.connect() as connection:
        try:
            connection.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS password VARCHAR DEFAULT 'cisco'"))
            connection.commit()
            print("Columna 'password' añadida exitosamente.")
        except Exception as e:
            print(f"Error en migración: {e}")

if __name__ == "__main__":
    migrate()
