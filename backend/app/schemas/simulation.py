from pydantic import BaseModel
from typing import List, Dict, Any

class ScenarioInputs(BaseModel):
    freight_rate_change_percent: float = 0.0
    fuel_price_change_percent: float = 0.0
    delay_days: int = 0
    port_congestion_multiplier: float = 1.0

class WhatIfRequest(BaseModel):
    base_analysis_id: str
    scenario: ScenarioInputs

class SimulationResponse(BaseModel):
    base_cost: float
    scenario_cost: float
    delta_cost: float
    recommendation_change: str
    risk_level_change: str
