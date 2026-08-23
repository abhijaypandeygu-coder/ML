import math
from app.schemas.optimization import (
    VesselOptimizationRequest, VesselOptimizationResponse, OptimizedVessel,
    ContractOptimizationRequest, ContractOptimizationResponse, ContractStrategy
)

class OptimizationService:
    def __init__(self):
        pass

    def optimize_vessels(self, request: VesselOptimizationRequest) -> VesselOptimizationResponse:
        # Mock logic to simulate vessel optimization based on constraints
        vessels = []
        
        # Capesize rules
        if request.max_draft_m >= 18.0 and request.cargo_quantity_mt >= 100000:
            voyages = math.ceil(request.cargo_quantity_mt / 170000)
            vessels.append(OptimizedVessel(
                vessel_type="Capesize", capacity_mt=170000, fit_score=95.0, estimated_voyages=voyages
            ))
            
        # Panamax rules
        if request.max_draft_m >= 13.0:
            voyages = math.ceil(request.cargo_quantity_mt / 75000)
            vessels.append(OptimizedVessel(
                vessel_type="Panamax", capacity_mt=75000, fit_score=85.0, estimated_voyages=voyages
            ))
            
        # Supramax fallback
        voyages = math.ceil(request.cargo_quantity_mt / 55000)
        vessels.append(OptimizedVessel(
            vessel_type="Supramax", capacity_mt=55000, fit_score=70.0, estimated_voyages=voyages
        ))
            
        vessels.sort(key=lambda x: x.fit_score, reverse=True)
        return VesselOptimizationResponse(recommended_vessels=vessels)

    def optimize_contracts(self, request: ContractOptimizationRequest) -> ContractOptimizationResponse:
        # Mock logic to simulate contract optimization
        strategies = []
        
        base_cost = request.total_voyages * 500000 # Mock baseline cost
        
        # Spot
        strategies.append(ContractStrategy(
            strategy_type="SPOT",
            expected_cost=base_cost * 1.1,
            risk_score=80,
            flexibility="HIGH",
            expected_savings=0.0
        ))
        
        # Short Term
        strategies.append(ContractStrategy(
            strategy_type="SHORT_TERM",
            expected_cost=base_cost * 0.95,
            risk_score=50,
            flexibility="MEDIUM",
            expected_savings=base_cost * 0.15
        ))
        
        # Medium Term
        if request.contract_horizon_days >= 90:
            strategies.append(ContractStrategy(
                strategy_type="MEDIUM_TERM_MULTIPLE_VOYAGE",
                expected_cost=base_cost * 0.85,
                risk_score=30,
                flexibility="LOW",
                expected_savings=base_cost * 0.25
            ))
            
        recommended = "MEDIUM_TERM_MULTIPLE_VOYAGE" if request.contract_horizon_days >= 90 else "SHORT_TERM"
        if request.risk_tolerance == "CONSERVATIVE":
            recommended = "MEDIUM_TERM_MULTIPLE_VOYAGE" if request.contract_horizon_days >= 90 else "SHORT_TERM"
        elif request.risk_tolerance == "AGGRESSIVE":
            recommended = "SPOT"
            
        return ContractOptimizationResponse(
            strategies=strategies,
            recommended_strategy=recommended
        )
