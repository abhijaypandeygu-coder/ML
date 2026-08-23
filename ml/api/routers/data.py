from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from ml.data.db.session import get_db
from ml.data.db.models import FreightRate, Port, Vessel

router = APIRouter(
    prefix="/api/v1/data",
    tags=["data"],
    responses={404: {"description": "Not found"}},
)

@router.get("/freight")
def get_freight_rates(limit: int = 100, db: Session = Depends(get_db)):
    """Retrieve historical freight rate timeseries data."""
    rates = db.query(FreightRate).order_by(FreightRate.timestamp.desc()).limit(limit).all()
    return rates

@router.get("/ports")
def get_ports(db: Session = Depends(get_db)):
    """Retrieve all canonical port geometries and constraints."""
    ports = db.query(Port).all()
    return ports

@router.get("/vessels")
def get_vessels(db: Session = Depends(get_db)):
    """Retrieve all canonical vessel specifications."""
    vessels = db.query(Vessel).all()
    return vessels
