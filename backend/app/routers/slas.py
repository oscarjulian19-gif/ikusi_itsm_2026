from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from app.db.session import get_db
from app.models.models import SLASetting, ServicePackageSetting

router = APIRouter()

# --- Schemas ---
class SLASettingBase(BaseModel):
    id: str
    name: str
    attention_min: int
    solution_hours: int
    attention_display: str
    solution_display: str

class SLASettingUpdate(BaseModel):
    name: Optional[str] = None
    attention_min: Optional[int] = None
    solution_hours: Optional[int] = None
    attention_display: Optional[str] = None
    solution_display: Optional[str] = None

class ServicePackageBase(BaseModel):
    name: str
    description: Optional[str] = None

class ServicePackageResponse(ServicePackageBase):
    id: int
    class Config:
        from_attributes = True

# --- Endpoints ---

@router.get("/config/slas", response_model=List[SLASettingBase])
def get_slas(db: Session = Depends(get_db)):
    return db.query(SLASetting).all()

@router.put("/config/slas/{sla_id}", response_model=SLASettingBase)
def update_sla(sla_id: str, sla_data: SLASettingUpdate, db: Session = Depends(get_db)):
    db_sla = db.query(SLASetting).filter(SLASetting.id == sla_id).first()
    if not db_sla:
        raise HTTPException(status_code=404, detail="SLA not found")
    
    for key, value in sla_data.dict(exclude_unset=True).items():
        setattr(db_sla, key, value)
    
    db.commit()
    db.refresh(db_sla)
    return db_sla

@router.get("/config/packages", response_model=List[ServicePackageResponse])
def get_packages(db: Session = Depends(get_db)):
    return db.query(ServicePackageSetting).all()

@router.post("/config/packages", response_model=ServicePackageResponse)
def create_package(package: ServicePackageBase, db: Session = Depends(get_db)):
    db_pkg = ServicePackageSetting(**package.dict())
    db.add(db_pkg)
    db.commit()
    db.refresh(db_pkg)
    return db_pkg

@router.put("/config/packages/{pkg_id}", response_model=ServicePackageResponse)
def update_package(pkg_id: int, package_data: ServicePackageBase, db: Session = Depends(get_db)):
    db_pkg = db.query(ServicePackageSetting).filter(ServicePackageSetting.id == pkg_id).first()
    if not db_pkg:
        raise HTTPException(status_code=404, detail="Package not found")
    
    db_pkg.name = package_data.name
    db_pkg.description = package_data.description
    
    db.commit()
    db.refresh(db_pkg)
    return db_pkg

@router.delete("/config/packages/{pkg_id}")
def delete_package(pkg_id: int, db: Session = Depends(get_db)):
    db_pkg = db.query(ServicePackageSetting).filter(ServicePackageSetting.id == pkg_id).first()
    if not db_pkg:
        raise HTTPException(status_code=404, detail="Package not found")
    
    db.delete(db_pkg)
    db.commit()
    return {"message": "Package deleted"}
