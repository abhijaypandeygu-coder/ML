from sqlalchemy.orm import Session
from typing import List, Optional
from app.db.models.shipment import Shipment
from app.schemas.shipment import ShipmentCreate, ShipmentUpdate

class ShipmentRepository:
    def __init__(self, db: Session):
        self.db = db
        
    def get_shipment(self, shipment_id: str) -> Optional[Shipment]:
        return self.db.query(Shipment).filter(Shipment.shipment_id == shipment_id).first()
        
    def get_all_shipments(self, skip: int = 0, limit: int = 100) -> List[Shipment]:
        return self.db.query(Shipment).offset(skip).limit(limit).all()
        
    def create_shipment(self, shipment_data: ShipmentCreate) -> Shipment:
        db_shipment = Shipment(**shipment_data.model_dump())
        self.db.add(db_shipment)
        self.db.commit()
        self.db.refresh(db_shipment)
        return db_shipment
        
    def update_shipment(self, shipment_id: str, shipment_data: ShipmentUpdate) -> Optional[Shipment]:
        db_shipment = self.get_shipment(shipment_id)
        if not db_shipment:
            return None
            
        update_data = shipment_data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_shipment, key, value)
            
        self.db.commit()
        self.db.refresh(db_shipment)
        return db_shipment
        
    def delete_shipment(self, shipment_id: str) -> bool:
        db_shipment = self.get_shipment(shipment_id)
        if not db_shipment:
            return False
        self.db.delete(db_shipment)
        self.db.commit()
        return True
