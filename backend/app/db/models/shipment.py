from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, ForeignKey
from datetime import datetime
import uuid
from app.db.base import Base

def generate_uuid():
    return str(uuid.uuid4())

class Shipment(Base):
    __tablename__ = "shipments"
    
    shipment_id = Column(String, primary_key=True, default=generate_uuid, index=True)
    commodity = Column(String, nullable=False)
    cargo_quantity_mt = Column(Float, nullable=False)
    origin_port = Column(String, ForeignKey("ports.port_id"))
    destination_port = Column(String, ForeignKey("ports.port_id"))
    loading_date = Column(DateTime, nullable=False)
    delivery_deadline = Column(DateTime, nullable=False)
    number_of_voyages = Column(Integer, default=1)
    contract_horizon = Column(Integer, default=1) # months
    risk_tolerance = Column(String, default="BALANCED") # CONSERVATIVE, BALANCED, AGGRESSIVE
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
