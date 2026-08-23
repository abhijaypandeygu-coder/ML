from pydantic import BaseModel
from typing import List, Dict, Any, Optional

class ContractStrategy(BaseModel):
    strategy_type: str # SPOT, SHORT_TERM, MEDIUM_TERM_MULTIPLE_VOYAGE
    expected_total_cost: float
    risk_score: float
    flexibility: str
    availability_risk: str
    market_exposure: str
    idle_risk: str
    is_recommended: bool = False

class RecommendedStrategyResponse(BaseModel):
    status: str = "SUCCESS"
    recommended_vessel: str
    recommended_vessel_type: str
    recommended_route: str
    recommended_entry_window: Dict[str, str]
    recommended_contract: str
    expected_total_cost: float
    risk_adjusted_cost: float
    risk_score: float
    expected_savings_vs_spot: float
    confidence: float
    
    alternatives: List[Dict[str, Any]] = []
    feasible_vessels: List[Dict[str, Any]] = []
    rejected_vessels: List[Dict[str, Any]] = []
    entry_window_analysis: List[Dict[str, Any]] = []
    contract_comparison: List[ContractStrategy] = []
    cost_breakdown: Dict[str, float] = {}
    risk_breakdown: Dict[str, Any] = {}
    scenario_robustness: Dict[str, Any] = {}
    explanation: List[str] = []
