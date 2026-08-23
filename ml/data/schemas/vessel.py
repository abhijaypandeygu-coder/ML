from datetime import datetime, date
from typing import Optional
from pydantic import BaseModel, Field
from ml.data.schemas.core import BaseDataRecord

class VesselData(BaseDataRecord):
    vessel_id: str
    vessel_name: str
    vessel_type: str # HANDYSIZE, SUPRAMAX, PANAMAX, CAPESIZE
    capacity_mt: float = Field(gt=0)
    loa_m: float = Field(gt=0)
    beam_m: float = Field(gt=0)
    draft_m: float = Field(gt=0)
    speed_knots: float = Field(gt=0)
    fuel_consumption_mt_day: float = Field(gt=0)
    fuel_type: str
    deadweight_mt: float = Field(gt=0)
    availability_date: date
    current_position_lat: float
    current_position_lon: float
    status: str

class PortData(BaseDataRecord):
    port_id: str
    port_name: str
    country: str
    region: str
    latitude: float
    longitude: float
    max_loa_m: float = Field(gt=0)
    max_beam_m: float = Field(gt=0)
    max_draft_m: float = Field(gt=0)
    cargo_handling_rate_mt_day: float = Field(gt=0)
    berth_count: int = Field(ge=0)
    terminal_capacity: float
    average_turnaround_days: float
    congestion_index: float
    port_status: str
    effective_from: Optional[datetime] = None
    effective_to: Optional[datetime] = None
    source_url: Optional[str] = None

class PortCongestionData(BaseDataRecord):
    port_id: str
    congestion_index: float = Field(ge=0, le=100) # 0-20 Low, 21-50 Moderate, etc.
    vessel_waiting_count: int = Field(ge=0)
    average_wait_hours: float = Field(ge=0)
    berth_utilization: float = Field(ge=0, le=100)
    turnaround_delay_days: float = Field(ge=0)
