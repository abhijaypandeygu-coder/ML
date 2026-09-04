from pydantic import BaseModel
from typing import List

class VesselOptimizationRequest(BaseModel):
    cargo_quantity_mt: float
    origin_port: str
    destination_port: str
    max_draft_m: float
    
class OptimizedVessel(BaseModel):
    vessel_type: str
    capacity_mt: float
    fit_score: float
    estimated_voyages: int

class VesselOptimizationResponse(BaseModel):
    recommended_vessels: List[OptimizedVessel]

class ContractOptimizationRequest(BaseModel):
    total_voyages: int
    contract_horizon_days: int
    risk_tolerance: str
    freight_rate: float = 20.0
    cargo_quantity_mt: float = 100000.0

class ContractStrategy(BaseModel):
    strategy_type: str # SPOT, SHORT_TERM, MEDIUM_TERM
    expected_cost: float
    risk_score: int
    flexibility: str
    expected_savings: float

class ContractOptimizationResponse(BaseModel):
    strategies: List[ContractStrategy]
    recommended_strategy: str
