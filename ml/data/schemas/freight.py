from datetime import datetime, date
from typing import Optional
from pydantic import BaseModel, Field
from ml.data.schemas.core import BaseDataRecord

class RouteData(BaseDataRecord):
    route_id: str
    origin_port_id: str
    destination_port_id: str
    distance_nm: float = Field(gt=0)
    estimated_transit_days: float = Field(gt=0)
    route_status: str
    trade_lane: str
    seasonality: str

class FreightMarketData(BaseDataRecord):
    route_id: str
    origin_port_id: str
    destination_port_id: str
    vessel_type: str
    freight_rate: float = Field(gt=0)
    currency: str = "USD"
    unit: str = "MT"
    rate_type: Optional[str] = None
    fixture_count: Optional[int] = None
    market_index: Optional[float] = None
    route_distance_nm: Optional[float] = None
    trade_lane: Optional[str] = None
    contract_type: Optional[str] = None

class CommodityData(BaseDataRecord):
    commodity_id: str
    commodity_name: str
    commodity_type: str
    quality: Optional[str] = None
    price: float = Field(gt=0)
    currency: str = "USD"
    unit: str = "MT"
    inventory_signal: Optional[float] = None
    production_signal: Optional[float] = None
    export_volume: Optional[float] = None
    import_volume: Optional[float] = None

class EconomicIndicatorData(BaseDataRecord):
    indicator_id: str
    indicator_name: str
    value: float
    unit: str
    country: str
    frequency: str

class FuelData(BaseDataRecord):
    fuel_type: str
    price: float = Field(gt=0)
    currency: str = "USD"
    unit: str = "MT"
    port_region: str
