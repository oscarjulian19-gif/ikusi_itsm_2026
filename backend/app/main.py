from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import engine, get_db, Base
from app.models.models import Ticket
from app.services.ai_service import GeminiService
from pydantic import BaseModel

# Initialize Tables (For dev simplicity; in prod use Alembic)
# Base.metadata.create_all(bind=engine) 

app = FastAPI(title="IKUSI Service API", version="1.0.0")

class TicketCreate(BaseModel):
    id: str
    title: str
    description: str
    priority: str
    status: str

# Dependency
ai_service = GeminiService()

@app.get("/")
def read_root():
    return {"message": "IKUSI Service API is running. Flash 2.0 Ready."}

@app.post("/api/v1/tickets/analyze")
async def analyze_ticket_endpoint(ticket: TicketCreate):
    # Hybrid Mode: 
    # The data lives in the Frontend (Local), so we trust the payload sent to us.
    # We are not fetching RAG context from Postgres yet (saving that for full prod).
    
    # Simple Context Simulation (StateFree)
    context = [
        "System Policy: Always check VPN logs for access issues.",
        "System Policy: Critical P1 incidents require immediate escalation."
    ]
    
    # 3. Call LLM
    analysis = await ai_service.analyze_ticket(ticket.title, ticket.description, context)
    
    return {"analysis": analysis}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
