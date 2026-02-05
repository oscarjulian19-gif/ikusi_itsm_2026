from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.models import Ticket, TicketPause
from app.services.ai_service import GeminiService
from pydantic import BaseModel
from typing import List, Optional, Dict
from datetime import datetime, timezone
import json

router = APIRouter()
ai_service = GeminiService()

# --- Schemas ---
class TicketCreate(BaseModel):
    title: str
    description: str
    priority: str
    client: str
    vendor_case_id: Optional[str] = None
    service_category: Optional[str] = None
    service_name: Optional[str] = None
    type: str = "incident" # 'incident' or 'request'
    assigned_team: Optional[str] = None

class TicketResponse(BaseModel):
    id: str
    title: str
    description: str
    status: str
    priority: str
    client: str
    vendor_case_id: Optional[str]
    service_category: Optional[str]
    service_name: Optional[str]
    created_at: datetime
    attention_start_at: Optional[datetime]
    resolution_start_at: Optional[datetime]
    closed_at: Optional[datetime]
    current_step: int
    step_data: str # JSON string
    ai_scores: str
    ticket_type: str
    
    class Config:
        from_attributes = True

class StepSubmission(BaseModel):
    step_number: int
    content: str # The text evidence/input for this step

class PauseRequest(BaseModel):
    reason: str
    comments: str

# --- Endpoints ---

@router.get("/tickets", response_model=List[TicketResponse])
def get_tickets(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(Ticket).offset(skip).limit(limit).all()

class ChatRequest(BaseModel):
    message: str

class TicketAnalysisRequest(BaseModel):
    id: str
    title: str
    description: str
    priority: str
    status: str

@router.post("/tickets/analyze")
async def analyze_ticket_endpoint(request: TicketAnalysisRequest):
    # Use RAG or simple prompt
    analysis = await ai_service.analyze_ticket(
        title=request.title, 
        description=request.description,
        context_docs=[f"Ticket ID: {request.id}", f"Status: {request.status}", f"Priority: {request.priority}"]
    )
    return {"analysis": analysis}

@router.post("/chat")
async def chat_endpoint(request: ChatRequest):
    reply = await ai_service.generate_response(request.message)
    return {"reply": reply}

@router.post("/tickets", response_model=TicketResponse)
def create_ticket(ticket: TicketCreate, db: Session = Depends(get_db)):
    # Generate ID (INC-XXXX or REQ-XXXX)
    prefix = "INC" if ticket.type == "incident" else "REQ"
    # Simple ID generation logic (in prod use sequence)
    count = db.query(Ticket).filter(Ticket.ticket_type == ticket.type).count()
    new_id = f"{prefix}-{10000 + count + 1}"
    
    db_ticket = Ticket(
        id=new_id,
        title=ticket.title,
        description=ticket.description,
        priority=ticket.priority,
        client=ticket.client,
        vendor_case_id=ticket.vendor_case_id,
        service_category=ticket.service_category,
        service_name=ticket.service_name,
        ticket_type=ticket.type,
        status="Abierto"
    )
    db.add(db_ticket)
    db.commit()
    db.refresh(db_ticket)
    return db_ticket

@router.put("/tickets/{ticket_id}/start_resolution", response_model=TicketResponse)
def start_resolution(ticket_id: str, db: Session = Depends(get_db)):
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    
    if ticket.status == "Abierto":
        ticket.status = "En Resolución"
        ticket.resolution_start_at = datetime.now(timezone.utc)
        ticket.current_step = 1 # Start P7M6
        db.commit()
        db.refresh(ticket)
    
    return ticket

@router.post("/tickets/{ticket_id}/validate_step")
async def validate_step(ticket_id: str, submission: StepSubmission):
    # Prompts based on P7M6 steps
    step_criteria = {
        1: "Reporte del Problema. Debe responder: ¿Existe afectación de servicio? ¿Síntomas exactos? ¿Parte de la red afectada? ¿Dispositivos? ¿Failover activo? ¿Accesibilidad? ¿Origen (falla/cambio)?",
        2: "Recopilación de Información. Debe contener evidencia técnica real: Logs (show tech, logs), diagramas, configuraciones, gráficas de monitoreo o topología.",
        3: "Análisis de Información. Debe identificar indicios de causa raíz comparando estado actual vs esperado. No solo listar logs, sino interpretarlos.",
        4: "Descarte de Causas. Debe explicar qué se ha descartado y por qué, basándose en la evidencia previa.",
        5: "Hipótesis de Causa Raíz. Debe ser una hipótesis técnica viable y probable según el análisis.",
        6: "Verificación y Solución. Debe detallar la acción tomada y cómo se verificó (rollback plan incluido).",
        7: "Cierre y Lecciones. Debe resumir la solución final, impacto real y pasos para evitar recurrencia."
    }
    
    criterion = step_criteria.get(submission.step_number, "Análisis técnico general.")
    
    prompt = f"""
    Act as a Senior Network Engineer Supervisor strictly enforcing the P7M6 methodology.
    Validate the following submission for Step {submission.step_number}: "{criterion}".
    
    Submission Content:
    "{submission.content}"
    
    Task:
    1. Score the submission from 1 to 10 based on completeness and technical depth relative to the criteria.
    2. Provide constructive feedback. If the score is low, explain exactly what is missing.
    3. Determine if it's "approved" (Score >= 7).
    
    Output strictly in JSON format:
    {{
        "score": <int>,
        "feedback": "<string>",
        "approved": <boolean>
    }}
    Do not add markdown formatting. Just the JSON.
    """
    
    raw_response = await ai_service.generate_response(prompt)
    
    # Simple cleanup to ensure JSON
    clean_response = raw_response.replace("```json", "").replace("```", "").strip()
    
    try:
        result = json.loads(clean_response)
    except Exception:
        # Fallback if AI fails specific JSON format
        result = {"score": 5, "feedback": raw_response, "approved": False}
        
    return result

@router.put("/tickets/{ticket_id}/submit_step", response_model=TicketResponse)
def submit_step(ticket_id: str, submission: StepSubmission, db: Session = Depends(get_db)):
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")

    # Update Step Data
    current_data = json.loads(ticket.step_data) if ticket.step_data else {}
    current_data[str(submission.step_number)] = submission.content
    ticket.step_data = json.dumps(current_data)
    
    # Advance Step if it's the current one
    if ticket.current_step == submission.step_number and ticket.current_step < 7:
        ticket.current_step += 1
    
    db.commit()
    db.refresh(ticket)
    return ticket

@router.post("/tickets/{ticket_id}/pause", response_model=TicketResponse)
def pause_ticket(ticket_id: str, pause: PauseRequest, db: Session = Depends(get_db)):
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
        
    ticket.status = "Pausado"
    new_pause = TicketPause(
        ticket_id=ticket.id,
        reason=pause.reason,
        comments=pause.comments,
        start_at=datetime.now(timezone.utc)
    )
    db.add(new_pause)
    db.commit()
    db.refresh(ticket)
    return ticket

@router.post("/tickets/{ticket_id}/resume", response_model=TicketResponse)
def resume_ticket(ticket_id: str, db: Session = Depends(get_db)):
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()
    if not ticket or ticket.status != "Pausado":
        return ticket # Or error
        
    # Find open pause
    last_pause = db.query(TicketPause).filter(TicketPause.ticket_id == ticket.id, TicketPause.end_at == None).first()
    if last_pause:
        last_pause.end_at = datetime.now(timezone.utc)
    
    ticket.status = "En Resolución"
    db.commit()
    db.refresh(ticket)
    return ticket

@router.put("/tickets/{ticket_id}/close", response_model=TicketResponse)
def close_ticket(ticket_id: str, db: Session = Depends(get_db)):
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
        
    ticket.status = "Cerrado"
    ticket.closed_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(ticket)
    return ticket
