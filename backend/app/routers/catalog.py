from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.models import CatalogService, CatalogScenario
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter()

# Schemas
class ScenarioBase(BaseModel):
    id: str
    name: str # Descripcion_Tipo
    service_id: str # Link to Service
    type: str # 'incident' or 'request'
    
    # New Fields
    sief_code: Optional[str] = None # Codigo_SIEF_Tipo
    
    priority: Optional[str] = None
    complexity: Optional[str] = None
    time: Optional[str] = None
    keywords: Optional[str] = None

class ScenarioCreate(ScenarioBase):
    pass

class ScenarioResponse(ScenarioBase):
    class Config:
        from_attributes = True

class ServiceBase(BaseModel):
    id: str # Codigo_Servicio_Sistema
    category: str # Categoria
    
    # New Fields
    category_code: Optional[str] = None # Codigo_Categoria_Sistema
    category_description: Optional[str] = None # Descripcion_Categoria
    sief_code: Optional[str] = None # Codigo_SIEF (Service)
    service_description: Optional[str] = None # Descripcion_Servicio

    name: str # Servicio
    icon: Optional[str] = None

class ServiceResponse(ServiceBase):
    class Config:
        from_attributes = True

# Routes

@router.get("/services", response_model=List[ServiceResponse])
def get_services(db: Session = Depends(get_db)):
    return db.query(CatalogService).all()

@router.post("/services", response_model=ServiceResponse)
def create_service(service: ServiceBase, db: Session = Depends(get_db)):
    db_item = db.query(CatalogService).filter(CatalogService.id == service.id).first()
    if db_item:
        raise HTTPException(status_code=400, detail="Service ID already exists")
    
    new_item = CatalogService(**service.dict())
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return new_item

@router.put("/services/{id}", response_model=ServiceResponse)
def update_service(id: str, service: ServiceBase, db: Session = Depends(get_db)):
    db_item = db.query(CatalogService).filter(CatalogService.id == id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Service not found")
        
    for key, value in service.dict().items():
        setattr(db_item, key, value)
        
    db.commit()
    db.refresh(db_item)
    return db_item

@router.get("/scenarios", response_model=List[ScenarioResponse])
def get_scenarios(db: Session = Depends(get_db)):
    return db.query(CatalogScenario).all()

@router.post("/scenarios", response_model=ScenarioResponse)
def create_scenario(scenario: ScenarioCreate, db: Session = Depends(get_db)):
    db_item = db.query(CatalogScenario).filter(CatalogScenario.id == scenario.id).first()
    if db_item:
        raise HTTPException(status_code=400, detail="Scenario ID already exists")
    
    new_item = CatalogScenario(**scenario.dict())
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return new_item

@router.put("/scenarios/{id}", response_model=ScenarioResponse)
def update_scenario(id: str, scenario: ScenarioCreate, db: Session = Depends(get_db)):
    db_item = db.query(CatalogScenario).filter(CatalogScenario.id == id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Scenario not found")
    
    for key, value in scenario.dict().items():
        setattr(db_item, key, value)
    
    db.commit()
    db.refresh(db_item)
    return db_item

@router.delete("/scenarios/{id}")
def delete_scenario(id: str, db: Session = Depends(get_db)):
    db_item = db.query(CatalogScenario).filter(CatalogScenario.id == id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Scenario not found")
    
    db.delete(db_item)
    db.commit()
    return {"message": "Scenario deleted"}
