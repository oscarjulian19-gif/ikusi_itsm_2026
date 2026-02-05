from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

from app.db.session import get_db
from app.models.models import Contract as DBContract

router = APIRouter()

# --- Pydantic Schemas ---
class ContractBase(BaseModel):
    client: str
    description: Optional[str] = None
    folio: Optional[str] = None
    slaType: Optional[str] = None
    projectName: Optional[str] = None
    pep: Optional[str] = None
    status: str = "Preliminar"
    
    startDate: Optional[str] = None
    endDate: Optional[str] = None
    
    pm: Optional[str] = None
    servicePackage: Optional[str] = None
    packageDescription: Optional[str] = None
    schedule: Optional[str] = None
    sdm: Optional[str] = None
    salesRep: Optional[str] = None
    snowContract: Optional[str] = None

class ContractCreate(ContractBase):
    id: Optional[str] = None

class ContractUpdate(ContractBase):
    pass

class ContractResponse(ContractBase):
    id: str
    # Mapped fields for response consistency
    packageDescription: Optional[str] = None
    schedule: Optional[str] = None
    pm: Optional[str] = None
    snowContract: Optional[str] = None

    class Config:
        from_attributes = True

# --- Endpoints ---

@router.get("/contracts")
def read_contracts(
    skip: int = 0, 
    limit: int = 100, 
    search: Optional[str] = None, 
    db: Session = Depends(get_db)
):
    query = db.query(DBContract)
    
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            (DBContract.client.ilike(search_term)) |
            (DBContract.id.ilike(search_term)) |
            (DBContract.pep.ilike(search_term)) |
            (DBContract.project_name.ilike(search_term))
        )
        
    total = query.count()
    contracts = query.order_by(DBContract.id.desc()).offset(skip).limit(limit).all()
    
    result_data = []
    for c in contracts:
        result_data.append({
            "id": c.id,
            "client": c.client,
            "description": c.description,
            "folio": c.folio,
            "slaType": c.sla_type,
            "projectName": c.project_name,
            "pep": c.pep,
            "status": c.status,
            "startDate": c.start_date.isoformat() if c.start_date else None,
            "endDate": c.end_date.isoformat() if c.end_date else None,
            "pm": c.pm,
            "servicePackage": c.service_package,
            "packageDescription": c.package_description,
            "schedule": c.schedule,
            "sdm": c.sdm,
            "salesRep": c.sales_rep,
            "snowContract": c.snow_contract,
            # Legacy/Implicit fields for compatibility if needed, or defaults
            "country": c.country or "Colombia",
            "serviceType": c.service_type or "Servicio Ikusi"
        })
    return {"data": result_data, "total": total}

@router.get("/contracts/{contract_id}")
def read_contract(contract_id: str, db: Session = Depends(get_db)):
    c = db.query(DBContract).filter(DBContract.id == contract_id).first()
    if not c:
        raise HTTPException(status_code=404, detail="Contract not found")
    
    return {
        "id": c.id,
        "client": c.client,
        "description": c.description,
        "folio": c.folio,
        "slaType": c.sla_type,
        "projectName": c.project_name,
        "pep": c.pep,
        "status": c.status,
        "startDate": c.start_date.isoformat() if c.start_date else None,
        "endDate": c.end_date.isoformat() if c.end_date else None,
        "pm": c.pm,
        "servicePackage": c.service_package,
        "packageDescription": c.package_description,
        "schedule": c.schedule,
        "sdm": c.sdm,
        "salesRep": c.sales_rep,
        "snowContract": c.snow_contract,
        "country": c.country or "Colombia",
        "serviceType": c.service_type or "Servicio Ikusi"
    }

@router.post("/contracts")
def create_contract(contract: ContractCreate, db: Session = Depends(get_db)):
    # Auto-generate ID logic: CNTR{yy}{xxxxx}
    if contract.id:
        new_id = contract.id
        # Check existence
        if db.query(DBContract).filter(DBContract.id == new_id).first():
            raise HTTPException(status_code=400, detail="Contract ID already exists")
    else:
        now = datetime.now()
        yy = now.strftime("%y")
        prefix = f"CNTR{yy}"
        
        last_contract = db.query(DBContract).filter(DBContract.id.like(f"{prefix}%")).order_by(DBContract.id.desc()).first()
        consecutive = 1
        if last_contract:
            try:
                # Expected format CNTR2600001
                # prefix len is 6 (CNTR26)
                # slice from len(prefix)
                number_part = last_contract.id[len(prefix):]
                if number_part.isdigit():
                    consecutive = int(number_part) + 1
            except: pass
        
        new_id = f"{prefix}{consecutive:05d}"
    
    # Parse dates safely
    def parse_date(d_str):
        if not d_str: return None
        try:
            # Handle YYYY-MM-DD or ISO with T
            if 'T' in d_str: return datetime.fromisoformat(d_str.replace('Z', '+00:00'))
            return datetime.strptime(d_str, "%Y-%m-%d")
        except: return None

    db_contract = DBContract(
        id=new_id,
        client=contract.client,
        description=contract.description,
        folio=contract.folio,
        sla_type=contract.slaType,
        project_name=contract.projectName,
        pep=contract.pep,
        status=contract.status,
        start_date=parse_date(contract.startDate),
        end_date=parse_date(contract.endDate),
        pm=contract.pm,
        service_package=contract.servicePackage,
        package_description=contract.packageDescription,
        schedule=contract.schedule,
        sdm=contract.sdm,
        sales_rep=contract.salesRep,
        snow_contract=contract.snowContract,
        # Defaults for fields present in DB but not in form
        country="Colombia", 
        service_type="Servicio Ikusi"
    )
    
    db.add(db_contract)
    db.commit()
    db.refresh(db_contract)
    return {"id": new_id, "message": "Contract created successfully"}

@router.put("/contracts/{contract_id}")
def update_contract(contract_id: str, contract: ContractUpdate, db: Session = Depends(get_db)):
    print(f"DEBUG UPDATE DATA: {contract.dict()}") # Debugging incoming data
    db_contract = db.query(DBContract).filter(DBContract.id == contract_id).first()
    if not db_contract:
        raise HTTPException(status_code=404, detail="Contract not found")
    
    def parse_date(d_str):
        if not d_str: return None
        try:
            if 'T' in d_str: return datetime.fromisoformat(d_str.replace('Z', '+00:00')) 
            return datetime.strptime(d_str, "%Y-%m-%d")
        except: return None

    # Update fields
    db_contract.client = contract.client
    db_contract.description = contract.description
    db_contract.folio = contract.folio
    db_contract.sla_type = contract.slaType
    db_contract.project_name = contract.projectName
    db_contract.pep = contract.pep
    db_contract.status = contract.status
    db_contract.start_date = parse_date(contract.startDate)
    db_contract.end_date = parse_date(contract.endDate)
    db_contract.pm = contract.pm
    db_contract.service_package = contract.servicePackage
    db_contract.package_description = contract.packageDescription
    db_contract.schedule = contract.schedule
    db_contract.sdm = contract.sdm
    db_contract.sales_rep = contract.salesRep
    db_contract.snow_contract = contract.snowContract
    
    db.commit()
    db.refresh(db_contract)
    return {"id": contract_id, "message": "Contract updated successfully"}

