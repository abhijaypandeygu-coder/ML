from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.db.session import get_db
from app.schemas.shipment import ShipmentCreate, ShipmentUpdate, ShipmentResponse
from app.repositories.shipment import ShipmentRepository

router = APIRouter(
    prefix="/api/v1/shipments",
    tags=["shipments"],
)

@router.post("/", response_model=ShipmentResponse, status_code=status.HTTP_201_CREATED)
def create_shipment(shipment: ShipmentCreate, db: Session = Depends(get_db)):
    repo = ShipmentRepository(db)
    return repo.create_shipment(shipment)

@router.get("/", response_model=List[ShipmentResponse])
def get_shipments(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    repo = ShipmentRepository(db)
    return repo.get_all_shipments(skip=skip, limit=limit)

@router.get("/{shipment_id}", response_model=ShipmentResponse)
def get_shipment(shipment_id: str, db: Session = Depends(get_db)):
    repo = ShipmentRepository(db)
    shipment = repo.get_shipment(shipment_id)
    if not shipment:
        raise HTTPException(status_code=404, detail="Shipment not found")
    return shipment

@router.patch("/{shipment_id}", response_model=ShipmentResponse)
def update_shipment(shipment_id: str, shipment_update: ShipmentUpdate, db: Session = Depends(get_db)):
    repo = ShipmentRepository(db)
    shipment = repo.update_shipment(shipment_id, shipment_update)
    if not shipment:
        raise HTTPException(status_code=404, detail="Shipment not found")
    return shipment

@router.delete("/{shipment_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_shipment(shipment_id: str, db: Session = Depends(get_db)):
    repo = ShipmentRepository(db)
    success = repo.delete_shipment(shipment_id)
    if not success:
        raise HTTPException(status_code=404, detail="Shipment not found")
