from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, ForeignKey, Index
from datetime import datetime
from app.db.base import Base

class FreightRate(Base):
    __tablename__ = "freight_rates"
    
    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, nullable=False, index=True)
    route_id = Column(String, index=True)
    origin_port_id = Column(String, index=True)
    destination_port_id = Column(String, index=True)
    vessel_type = Column(String, index=True)
    freight_rate = Column(Float, nullable=False)
    currency = Column(String, default="USD")
    unit = Column(String, default="MT")
    source = Column(String)
    source_type = Column(String) # REAL, SYNTHETIC
    data_quality = Column(String)
    last_updated = Column(DateTime, default=datetime.utcnow)
    market_regime = Column(String, nullable=True)

class Port(Base):
    __tablename__ = "ports"
    
    port_id = Column(String, primary_key=True, index=True)
    port_name = Column(String)
    country = Column(String)
    region = Column(String)
    latitude = Column(Float)
    longitude = Column(Float)
    max_loa_m = Column(Float)
    max_beam_m = Column(Float)
    max_draft_m = Column(Float)
    cargo_handling_rate_mt_day = Column(Float)
    source = Column(String)
    source_type = Column(String)
    data_quality = Column(String)
    last_updated = Column(DateTime, default=datetime.utcnow)

class Vessel(Base):
    __tablename__ = "vessels"
    
    vessel_id = Column(String, primary_key=True, index=True)
    vessel_name = Column(String)
    vessel_type = Column(String, index=True)
    capacity_mt = Column(Float)
    loa_m = Column(Float)
    beam_m = Column(Float)
    draft_m = Column(Float)
    speed_knots = Column(Float)
    fuel_consumption_mt_day = Column(Float)
    source = Column(String)
    source_type = Column(String)
    data_quality = Column(String)
    last_updated = Column(DateTime, default=datetime.utcnow)

# Ensure proper indexing for time-series and joins
Index('idx_freight_time_route', FreightRate.timestamp, FreightRate.route_id)
Index('idx_freight_time_vessel', FreightRate.timestamp, FreightRate.vessel_type)
