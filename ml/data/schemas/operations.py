from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field
from ml.data.schemas.core import BaseDataRecord

class ContractData(BaseDataRecord):
    contract_id: str
    contract_type: str # SPOT, SHORT_TERM, MEDIUM_TERM_MULTIPLE_VOYAGE
    vessel_id: str
    route_id: str
    start_date: datetime
    end_date: datetime
    number_of_voyages: int = Field(ge=1)
    freight_rate: float = Field(gt=0)
    currency: str = "USD"
    cargo_quantity: float = Field(gt=0)
    status: str

class VoyageData(BaseDataRecord):
    voyage_id: str
    vessel_id: str
    contract_id: Optional[str] = None
    origin_port_id: str
    destination_port_id: str
    cargo_quantity_mt: float = Field(gt=0)
    planned_departure: datetime
    actual_departure: Optional[datetime] = None
    planned_arrival: datetime
    actual_arrival: Optional[datetime] = None
    fuel_consumed: Optional[float] = None
    idle_days: Optional[float] = None
    waiting_days: Optional[float] = None
    delay_days: Optional[float] = None
    freight_cost: Optional[float] = None
    port_cost: Optional[float] = None
    fuel_cost: Optional[float] = None
    total_cost: Optional[float] = None

class IdleTimeData(BaseDataRecord):
    vessel_id: str
    idle_start: datetime
    idle_end: Optional[datetime] = None
    idle_days: Optional[float] = None
    location: str
    reason: str
    alternative_employment_available: bool
    repositioning_distance: Optional[float] = None
    repositioning_cost: Optional[float] = None

class RepositioningData(BaseDataRecord):
    vessel_id: str
    from_location: str
    to_location: str
    distance_nm: float = Field(gt=0)
    estimated_days: float = Field(gt=0)
    fuel_cost: float = Field(ge=0)
    repositioning_cost: float = Field(ge=0)
