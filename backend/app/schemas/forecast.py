from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class ForecastRequest(BaseModel):
    origin: str
    destination: str
    vessel_type: str
    forecast_horizon: int # days

class ForecastDataPoint(BaseModel):
    date: str
    timestamp: int
    actual_rate_usd: Optional[float] = None
    predicted_rate_usd: Optional[float] = None
    lower_bound_usd: Optional[float] = None
    upper_bound_usd: Optional[float] = None
    is_forecast: bool
    event_signal: Optional[str] = None

class ForecastResponse(BaseModel):
    forecast_id: str
    current_rate: float
    forecast: List[ForecastDataPoint]
    model_name: str
    model_version: str
    generated_at: datetime
