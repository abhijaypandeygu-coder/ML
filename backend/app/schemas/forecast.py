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
    predicted_rate: float
    lower_bound: float
    upper_bound: float

class ForecastResponse(BaseModel):
    forecast_id: str
    current_rate: float
    forecast: List[ForecastDataPoint]
    model_name: str
    model_version: str
    generated_at: datetime
