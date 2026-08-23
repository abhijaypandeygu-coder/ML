from sqlalchemy.orm import Session
from typing import List, Optional
from app.db.models.core import Port, Vessel, FreightRate

class DataRepository:
    def __init__(self, db: Session):
        self.db = db
        
    def get_ports(self) -> List[Port]:
        return self.db.query(Port).all()
        
    def get_port_by_id(self, port_id: str) -> Optional[Port]:
        return self.db.query(Port).filter(Port.port_id == port_id).first()
        
    def get_vessels(self) -> List[Vessel]:
        return self.db.query(Vessel).all()
        
    def get_vessel_by_id(self, vessel_id: str) -> Optional[Vessel]:
        return self.db.query(Vessel).filter(Vessel.vessel_id == vessel_id).first()
        
    def get_freight_rates(self, limit: int = 100) -> List[FreightRate]:
        return self.db.query(FreightRate).order_by(FreightRate.timestamp.desc()).limit(limit).all()
