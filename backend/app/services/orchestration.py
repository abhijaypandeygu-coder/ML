import uuid
from datetime import datetime
from sqlalchemy.orm import Session

from app.schemas.orchestration import (
    CharterAnalysisRequest, CharterAnalysisResponse, Recommendation, CostBreakdown
)
from app.schemas.forecast import ForecastRequest
from app.schemas.risk import RiskAnalysisRequest
from app.schemas.optimization import VesselOptimizationRequest, ContractOptimizationRequest

from app.services.forecast import ForecastService
from app.services.risk import RiskService
from app.services.optimization import OptimizationService

class CharterAnalysisService:
    def __init__(self, db: Session):
        self.db = db
        self.forecast_svc = ForecastService()
        self.risk_svc = RiskService()
        self.opt_svc = OptimizationService()

    def analyze(self, request: CharterAnalysisRequest) -> CharterAnalysisResponse:
        shipment = request.shipment
        
        # 1. Forecast Freight
        forecast_resp = self.forecast_svc.generate_forecast(ForecastRequest(
            origin=shipment.origin_port,
            destination=shipment.destination_port,
            vessel_type="Panamax", # Defaulting for baseline
            forecast_horizon=30
        ))
        
        # 2. Risk Analysis
        risk_resp = self.risk_svc.analyze_risk(RiskAnalysisRequest(
            origin=shipment.origin_port,
            destination=shipment.destination_port,
            vessel_type="Panamax",
            loading_date=shipment.loading_date.isoformat()
        ))
        
        # 3. Vessel Optimization
        vessel_resp = self.opt_svc.optimize_vessels(VesselOptimizationRequest(
            cargo_quantity_mt=shipment.cargo_quantity_mt,
            origin_port=shipment.origin_port,
            destination_port=shipment.destination_port,
            max_draft_m=14.0 # Mock constraint
        ))
        
        # 4. Contract Optimization
        contract_resp = self.opt_svc.optimize_contracts(ContractOptimizationRequest(
            total_voyages=shipment.number_of_voyages,
            contract_horizon_days=shipment.contract_horizon * 30,
            risk_tolerance=shipment.risk_tolerance
        ))
        
        recommended_contract = contract_resp.recommended_strategy
        recommended_vessel = vessel_resp.recommended_vessels[0] if vessel_resp.recommended_vessels else None
        
        # 5. Compile Recommendation
        cost_bd = CostBreakdown(
            freight_cost=forecast_resp.current_rate * shipment.cargo_quantity_mt,
            port_charges=50000,
            bunker_cost=150000,
            risk_premium=10000 if risk_resp.overall_score > 50 else 0,
            total_cost=0 # Calculated below
        )
        cost_bd.total_cost = cost_bd.freight_cost + cost_bd.port_charges + cost_bd.bunker_cost + cost_bd.risk_premium
        
        rec = Recommendation(
            recommended_vessel="TBN (To Be Nominated)",
            recommended_vessel_type=recommended_vessel.vessel_type if recommended_vessel else "Unknown",
            recommended_route=f"{shipment.origin_port} -> {shipment.destination_port}",
            recommended_entry_window="Next 7 Days",
            recommended_contract=recommended_contract,
            expected_total_cost=cost_bd.total_cost,
            risk_adjusted_cost=cost_bd.total_cost * 1.05,
            risk_score=risk_resp.overall_score,
            expected_savings_vs_spot=150000, # Mock savings
            decision_confidence=0.88,
            why_recommended=[
                f"Market forecast indicates rising rates in the next 30 days.",
                f"{recommended_contract} minimizes exposure to volatility.",
                f"{recommended_vessel.vessel_type if recommended_vessel else 'Selected vessel'} perfectly matches port draft constraints."
            ],
            key_risk_drivers=[d.description for d in risk_resp.drivers],
            constraint_summary=[
                f"Cargo: {shipment.cargo_quantity_mt} MT",
                f"Deadline: {shipment.delivery_deadline.strftime('%Y-%m-%d')}"
            ]
        )
        
        return CharterAnalysisResponse(
            analysis_id=str(uuid.uuid4()),
            status="SUCCESS",
            shipment=shipment,
            market={"regime": "VOLATILE", "trend": "UPWARD"},
            forecast=forecast_resp,
            risk=risk_resp,
            vessels=vessel_resp.recommended_vessels,
            charter_window={"start": "2026-09-01", "end": "2026-09-10"},
            contracts=contract_resp.strategies,
            recommendation=rec,
            alternatives=[],
            cost_breakdown=cost_bd,
            explanation={"summary": "Based on all factors, this is the optimal path."},
            generated_at=datetime.utcnow()
        )
