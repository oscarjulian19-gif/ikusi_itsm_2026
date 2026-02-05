from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.core.config import get_settings

settings = get_settings()

print(f"DEBUG DB URI: {settings.SQLALCHEMY_DATABASE_URI}")

# For a real production app, use a connection pool
try:
    engine = create_engine(
        settings.SQLALCHEMY_DATABASE_URI,
        pool_pre_ping=True
    )
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
except Exception as e:
    print(f"DB CONNECTION ERROR: {e}")
    engine = None
    SessionLocal = None

Base = declarative_base()

def get_db():
    if SessionLocal is None:
        raise Exception("Database connection failed on startup. Check logs/credentials.")
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
