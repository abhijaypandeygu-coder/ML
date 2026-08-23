from datetime import date
from typing import Optional
from pydantic import BaseModel, Field

class FreightMarketData(BaseModel):
    date: date
    origin: str
    destination: str
    vessel_type: str
    freight_rate: float
    currency: str = "USD"
    unit: str = "MT"
    route_distance: Optional[float] = None
    bunker_price: Optional[float] = None
    tonnage: Optional[float] = None
    availability: Optional[float] = None
    fixtures: Optional[int] = None
    market_index: Optional[float] = None

class VesselData(BaseModel):
    vessel_id: str
    vessel_type: str
    capacity_mt: float
    loa_m: float
    beam_m: float
    draft_m: float
    speed_knots: float
    fuel_consumption: float
    availability_date: date
    current_position: str

class PortData(BaseModel):
    port_id: str
    port_name: str
    max_loa: float
    max_beam: float
    max_draft: float
    cargo_handling_rate: float
    berth_capacity: int
    turnaround_time: float
    congestion_index: float

class CommodityData(BaseModel):
    date: date
    commodity: str
    commodity_price: float
    inventory: Optional[float] = None
    production: Optional[float] = None
    export_volume: Optional[float] = None
    import_volume: Optional[float] = None

class EconomicData(BaseModel):
    date: date
    oil_price: Optional[float] = None
    coal_price: Optional[float] = None
    fx_rate: Optional[float] = None
    interest_rate: Optional[float] = None
    inflation: Optional[float] = None
    industrial_production: Optional[float] = None
    shipping_index: Optional[float] = None
    global_trade_indicator: Optional[float] = None

class SeasonalData(BaseModel):
    date: date
    month: int = Field(ge=1, le=12)
    quarter: int = Field(ge=1, le=4)
    day_of_year: int = Field(ge=1, le=366)
    monsoon_indicator: bool
    holiday_indicator: bool
    seasonality_index: float
