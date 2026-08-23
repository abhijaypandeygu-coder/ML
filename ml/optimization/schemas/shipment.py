from pydantic import BaseModel, Field
from datetime import date
from typing import Optional

class ShipmentRequest(BaseModel):
    commodity: str = Field(..., description="Type of bulk cargo (e.g., Premium Coking Coal)")
    cargo_quantity_mt: float = Field(..., gt=0, description="Cargo quantity in metric tons")
    loading_date: date = Field(..., description="Earliest date the cargo is available to load")
    delivery_deadline: date = Field(..., description="Latest acceptable delivery date")
    number_of_voyages: int = Field(default=1, ge=1, description="Number of voyages required")
    contract_horizon_months: Optional[int] = Field(default=None, description="Months horizon for medium-term contracts")
    
class UserPreferences(BaseModel):
    risk_tolerance: str = Field(default="MEDIUM", pattern="^(LOW|MEDIUM|HIGH)$")
    max_freight_rate: Optional[float] = None
    preferred_vessel_type: Optional[str] = None
    max_budget: Optional[float] = None

class ForecastInputs(BaseModel):
    forecast_freight_rate: float
    forecast_distribution: str = Field(default="NORMAL")
    market_regime: str = Field(default="STABLE")
    forecast_volatility: float
    confidence: float

class OperationalInputs(BaseModel):
    fuel_price: float = Field(..., description="Bunker fuel price USD/MT")
    port_congestion: str = Field(default="LOW", pattern="^(LOW|MEDIUM|HIGH)$")
    expected_delay_days: float = Field(default=0.0)
    weather_risk: str = Field(default="LOW", pattern="^(LOW|MEDIUM|HIGH)$")
