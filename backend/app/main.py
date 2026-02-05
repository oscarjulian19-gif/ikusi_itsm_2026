from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import engine, get_db, Base
from app.models.models import Ticket
from app.services.ai_service import GeminiService
from pydantic import BaseModel

# Initialize Tables (For dev simplicity; in prod use Alembic)
print("Starting table creation...")
try:
    Base.metadata.create_all(bind=engine) 
    print("Tables created!")
except Exception as e:
    print(f"Failed to create tables: {e}")

from app.routers import contracts, users, incidents, cmdb, imports

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="IKUSI Service API", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace with ["http://localhost:5173"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(contracts.router, prefix="/api/v1")
app.include_router(users.router, prefix="/api/v1")
app.include_router(incidents.router, prefix="/api/v1")
app.include_router(cmdb.router, prefix="/api/v1")
app.include_router(imports.router, prefix="/api/v1")

# Dependency
ai_service = GeminiService()

@app.get("/")
def read_root():
    return {"message": "IKUSI Service API is running. Flash 2.0 Ready."}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
