from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.db.session import get_db
from app.repositories.data import DataRepository

router = APIRouter(tags=["data"])

@router.get("/data/freight")
def get_freight_rates(limit: int = 100, db: Session = Depends(get_db)):
    """Retrieve historical freight rate timeseries data."""
    repo = DataRepository(db)
    return repo.get_freight_rates(limit)

@router.get("/data/ports")
def get_ports(db: Session = Depends(get_db)):
    """Retrieve all canonical port geometries and constraints."""
    repo = DataRepository(db)
    return repo.get_ports()
    
@router.get("/data/ports/{port_id}")
def get_port(port_id: str, db: Session = Depends(get_db)):
    """Retrieve a specific port by ID."""
    repo = DataRepository(db)
    port = repo.get_port_by_id(port_id)
    if not port:
        raise HTTPException(status_code=404, detail="Port not found")
    return port

@router.get("/data/vessels")
def get_vessels(db: Session = Depends(get_db)):
    """Retrieve all canonical vessel specifications."""
    repo = DataRepository(db)
    return repo.get_vessels()

@router.get("/data/vessels/{vessel_id}")
def get_vessel(vessel_id: str, db: Session = Depends(get_db)):
    """Retrieve a specific vessel by ID."""
    repo = DataRepository(db)
    vsl = repo.get_vessel_by_id(vessel_id)
    if not vsl:
        raise HTTPException(status_code=404, detail="Vessel not found")
    return vsl
