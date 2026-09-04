from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from datetime import datetime

from app.schemas.shipment import ShipmentCreate
from app.schemas.forecast import ForecastResponse
from app.schemas.risk import RiskAnalysisResponse
from app.schemas.optimization import OptimizedVessel, ContractStrategy

class CostBreakdown(BaseModel):
    freight_cost: float
    port_charges: float
    bunker_cost: float
    risk_premium: float
    total_cost: float

class Recommendation(BaseModel):
    recommended_vessel: str
    recommended_vessel_type: str
    recommended_route: str
    recommended_entry_window: str
    recommended_contract: str
    expected_total_cost: float
    risk_adjusted_cost: float
    risk_score: int
    expected_savings_vs_spot: float
    decision_confidence: float
    why_recommended: List[str]
    key_risk_drivers: List[str]
    constraint_summary: List[str]

class CharterAnalysisRequest(BaseModel):
    shipment: ShipmentCreate
    sim_params: Optional[Dict[str, Any]] = None

class CharterAnalysisResponse(BaseModel):
    analysis_id: str
    status: str
    shipment: ShipmentCreate
    market: Dict[str, Any]
    forecast: ForecastResponse
    risk: RiskAnalysisResponse
    vessels: List[OptimizedVessel]
    charter_window: Dict[str, Any]
    contracts: List[ContractStrategy]
    recommendation: Recommendation
    alternatives: List[Dict[str, Any]]
    cost_breakdown: CostBreakdown
    explanation: Dict[str, Any]
    generated_at: datetime
