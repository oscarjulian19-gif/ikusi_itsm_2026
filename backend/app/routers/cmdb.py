from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

from app.db.session import get_db
from app.models.models import ConfigurationItem as DBConfigurationItem

router = APIRouter()

# --- Schemas ---

class CIBase(BaseModel):
    id: str # System ID
    ciNumber: Optional[str] = None
    serialNumber: Optional[str] = None
    referenceNumber: Optional[str] = None
    client: str
    description: Optional[str] = None
    status: str
    startDate: Optional[str] = None
    endDate: Optional[str] = None
    poNumber: Optional[str] = None
    soNumber: Optional[str] = None
    ciscoSupportEndDate: Optional[str] = None
    ciscoSupportStartDate: Optional[str] = None
    ciscoContractNumber: Optional[str] = None
    city: Optional[str] = None
    address: Optional[str] = None
    projectName: Optional[str] = None
    pep: Optional[str] = None
    country: str
    type: str # Server, Switch...
    deviceModel: Optional[str] = None
    contractId: Optional[str] = None
    snowContract: Optional[str] = None

class CICreate(CIBase):
    pass

class CIUpdate(CIBase):
    pass

class CIResponse(CIBase):
    class Config:
        from_attributes = True

# --- Endpoints ---

@router.get("/cmdb")
def read_cis(
    skip: int = 0, 
    limit: int = 100,
    search: Optional[str] = None,
    contractId: Optional[str] = None, # Added param
    db: Session = Depends(get_db)
):
    query = db.query(DBConfigurationItem)
    
    if contractId:
        query = query.filter(DBConfigurationItem.contract_id == contractId)

    if search:
        search_term = f"%{search}%"
        query = query.filter(
            (DBConfigurationItem.id.ilike(search_term)) |
            (DBConfigurationItem.serial_number.ilike(search_term)) |
            (DBConfigurationItem.client.ilike(search_term)) |
            (DBConfigurationItem.po_number.ilike(search_term)) |
            (DBConfigurationItem.status.ilike(search_term))
        )
        
    total = query.count()
    cis = query.offset(skip).limit(limit).all()
    
    # Map back to Frontend Camels
    result_data = []
    for c in cis:
        result_data.append({
            "id": c.id,
            "ciNumber": c.ci_number,
            "serialNumber": c.serial_number,
            "referenceNumber": c.reference_number,
            "client": c.client,
            "description": c.description,
            "status": c.status,
            "startDate": c.start_date.isoformat().split('T')[0] if c.start_date else None,
            "endDate": c.end_date.isoformat().split('T')[0] if c.end_date else None,
            "poNumber": c.po_number,
            "soNumber": c.so_number,
            "ciscoSupportEndDate": c.cisco_support_end_date.isoformat().split('T')[0] if c.cisco_support_end_date else None,
            "ciscoSupportStartDate": c.cisco_support_start_date.isoformat().split('T')[0] if c.cisco_support_start_date else None,
            "ciscoContractNumber": c.cisco_contract_number,
            "city": c.city,
            "address": c.address,
            "projectName": c.project_name,
            "pep": c.pep,
            "country": c.country,
            "type": c.type,
            "deviceModel": c.device_model,
            "contractId": c.contract_id,
            "snowContract": c.snow_contract
        })
    return {"data": result_data, "total": total}

@router.get("/cmdb/{ci_id}", response_model=CIResponse)
def read_ci(ci_id: str, db: Session = Depends(get_db)):
    c = db.query(DBConfigurationItem).filter(DBConfigurationItem.id == ci_id).first()
    if not c:
        raise HTTPException(status_code=404, detail="CI not found")
        
    return {
        "id": c.id,
        "ciNumber": c.ci_number,
        "serialNumber": c.serial_number,
        "referenceNumber": c.reference_number,
        "client": c.client,
        "description": c.description,
        "status": c.status,
        "startDate": c.start_date.isoformat().split('T')[0] if c.start_date else None,
        "endDate": c.end_date.isoformat().split('T')[0] if c.end_date else None,
        "poNumber": c.po_number,
        "soNumber": c.so_number,
        "ciscoSupportEndDate": c.cisco_support_end_date.isoformat().split('T')[0] if c.cisco_support_end_date else None,
        "ciscoSupportStartDate": c.cisco_support_start_date.isoformat().split('T')[0] if c.cisco_support_start_date else None,
        "ciscoContractNumber": c.cisco_contract_number,
        "city": c.city,
        "address": c.address,
        "projectName": c.project_name,
        "pep": c.pep,
        "country": c.country,
        "type": c.type,
        "deviceModel": c.device_model,
        "contractId": c.contract_id,
        "snowContract": c.snow_contract
    }

def generate_ci_id(db: Session) -> str:
    """
    Generates a CI ID following XXyyyyyyyyyy rule.
    XX = Last 2 digits of current year.
    yyyyyyyyyy = 10-digit consecutive.
    """
    now = datetime.now()
    yy = now.strftime("%y")
    prefix = yy
    
    # Simple search for the max ID starting with this year's prefix
    last_ci = db.query(DBConfigurationItem).filter(DBConfigurationItem.id.like(f"{prefix}%")).order_by(DBConfigurationItem.id.desc()).first()
    
    consecutive = 1
    if last_ci:
        try:
            # Extract the numeric part (everything after the YY prefix)
            num_part = last_ci.id[2:]
            if num_part.isdigit():
                consecutive = int(num_part) + 1
        except:
            pass
            
    return f"{prefix}{consecutive:010d}"

@router.post("/cmdb", response_model=CIResponse)
def create_ci(ci: CICreate, db: Session = Depends(get_db)):
    # The user says "deberá ser asignado por el sistema"
    system_id = generate_ci_id(db)
    
    # Helper for dates
    def parse_dt(d):
        if not d: return None
        try:
            return datetime.strptime(d[:10], "%Y-%m-%d")
        except:
            return None

    db_ci = DBConfigurationItem(
        id=system_id,
        ci_number=ci.ciNumber,
        serial_number=ci.serialNumber,
        reference_number=ci.referenceNumber,
        client=ci.client,
        description=ci.description,
        status=ci.status,
        start_date=parse_dt(ci.startDate),
        end_date=parse_dt(ci.endDate),
        po_number=ci.poNumber,
        so_number=ci.soNumber,
        cisco_support_end_date=parse_dt(ci.ciscoSupportEndDate),
        cisco_support_start_date=parse_dt(ci.ciscoSupportStartDate),
        cisco_contract_number=ci.ciscoContractNumber,
        city=ci.city,
        address=ci.address,
        project_name=ci.projectName,
        pep=ci.pep,
        country=ci.country,
        type=ci.type,
        device_model=ci.deviceModel,
        contract_id=ci.contractId,
        snow_contract=ci.snowContract
    )
    
    db.add(db_ci)
    db.commit()
    db.refresh(db_ci)
    
    return db_ci

@router.put("/cmdb/{ci_id}")
def update_ci(ci_id: str, ci_update: CIUpdate, db: Session = Depends(get_db)):
    db_ci = db.query(DBConfigurationItem).filter(DBConfigurationItem.id == ci_id).first()
    if not db_ci:
        raise HTTPException(status_code=404, detail="CI not found")

    def parse_dt(d):
        if not d: return None
        try: return datetime.strptime(d[:10], "%Y-%m-%d")
        except: return None

    db_ci.ci_number = ci_update.ciNumber
    db_ci.serial_number = ci_update.serialNumber
    db_ci.reference_number = ci_update.referenceNumber
    db_ci.client = ci_update.client
    db_ci.description = ci_update.description
    db_ci.status = ci_update.status
    db_ci.start_date = parse_dt(ci_update.startDate)
    db_ci.end_date = parse_dt(ci_update.endDate)
    db_ci.po_number = ci_update.poNumber
    db_ci.so_number = ci_update.soNumber
    db_ci.cisco_support_end_date = parse_dt(ci_update.ciscoSupportEndDate)
    db_ci.cisco_support_start_date = parse_dt(ci_update.ciscoSupportStartDate)
    db_ci.cisco_contract_number = ci_update.ciscoContractNumber
    db_ci.city = ci_update.city
    db_ci.address = ci_update.address
    db_ci.project_name = ci_update.projectName
    db_ci.pep = ci_update.pep
    db_ci.country = ci_update.country
    db_ci.type = ci_update.type
    db_ci.device_model = ci_update.deviceModel
    db_ci.contract_id = ci_update.contractId
    db_ci.snow_contract = ci_update.snowContract

    db.commit()
    db.refresh(db_ci)
    return {"id": ci_id, "message": "Updated successfully"}

@router.delete("/cmdb/all/dangerous")
def delete_all_cis(db: Session = Depends(get_db)):
    """
    DANGEROUS: Deletes all configuration items from the database.
    Used for full reloads.
    """
    try:
        num_deleted = db.query(DBConfigurationItem).delete()
        db.commit()
        return {"message": f"Successfully deleted {num_deleted} items.", "count": num_deleted}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
