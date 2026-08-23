from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class ShipmentBase(BaseModel):
    commodity: str
    cargo_quantity_mt: float
    origin_port: str
    destination_port: str
    loading_date: datetime
    delivery_deadline: datetime
    number_of_voyages: int = 1
    contract_horizon: int = 1
    risk_tolerance: str = "BALANCED"

class ShipmentCreate(ShipmentBase):
    pass

class ShipmentUpdate(BaseModel):
    commodity: Optional[str] = None
    cargo_quantity_mt: Optional[float] = None
    origin_port: Optional[str] = None
    destination_port: Optional[str] = None
    loading_date: Optional[datetime] = None
    delivery_deadline: Optional[datetime] = None
    number_of_voyages: Optional[int] = None
    contract_horizon: Optional[int] = None
    risk_tolerance: Optional[str] = None

class ShipmentResponse(ShipmentBase):
    shipment_id: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True
