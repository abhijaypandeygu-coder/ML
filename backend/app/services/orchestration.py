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
        
        # Estimate max draft based on port name or country for mock
        max_draft = 14.0
        if "gangavaram" in shipment.destination_port.lower():
            max_draft = 18.0
        elif "paradip" in shipment.destination_port.lower():
            max_draft = 14.5
        
        # 3. Vessel Optimization
        vessel_resp = self.opt_svc.optimize_vessels(VesselOptimizationRequest(
            cargo_quantity_mt=shipment.cargo_quantity_mt * (1.0 + (request.sim_params.get("cargoQuantityShiftPct", 0)/100.0) if request.sim_params else 1.0),
            origin_port=shipment.origin_port,
            destination_port=shipment.destination_port,
            max_draft_m=max_draft
        ))
        
        recommended_vessel = vessel_resp.recommended_vessels[0] if vessel_resp.recommended_vessels else None
        recommended_vessel_type = recommended_vessel.vessel_type if recommended_vessel else "Panamax"
        
        # Handle What-If Simulation Params
        sim_freight_multiplier = 1.0
        sim_bunker_multiplier = 1.0
        sim_cargo_multiplier = 1.0
        if request.sim_params:
            sim_freight_multiplier = 1.0 + (request.sim_params.get("freightRateShiftPct", 0) / 100.0)
            sim_bunker_multiplier = 1.0 + (request.sim_params.get("bunkerFuelShiftPct", 0) / 100.0)
            sim_cargo_multiplier = 1.0 + (request.request_params.get("cargoQuantityShiftPct", 0) / 100.0) if hasattr(request, 'request_params') else 1.0
            if request.sim_params.get("cargoQuantityShiftPct"):
                sim_cargo_multiplier = 1.0 + (request.sim_params.get("cargoQuantityShiftPct", 0) / 100.0)
            
        simulated_cargo_qty = shipment.cargo_quantity_mt * sim_cargo_multiplier
        simulated_freight_rate = forecast_resp.current_rate * sim_freight_multiplier

        # 4. Contract Optimization
        contract_resp = self.opt_svc.optimize_contracts(ContractOptimizationRequest(
            total_voyages=shipment.number_of_voyages,
            contract_horizon_days=shipment.contract_horizon * 30,
            risk_tolerance=shipment.risk_tolerance,
            freight_rate=simulated_freight_rate,
            cargo_quantity_mt=simulated_cargo_qty
        ))
        
        recommended_contract = contract_resp.recommended_strategy
        recommended_vessel = vessel_resp.recommended_vessels[0] if vessel_resp.recommended_vessels else None

        # 5. Compile Recommendation
        freight_cost = simulated_freight_rate * simulated_cargo_qty * shipment.number_of_voyages
        port_charges = 50000 * shipment.number_of_voyages
        bunker_cost = 150000 * shipment.number_of_voyages * sim_bunker_multiplier
        risk_premium = 10000 * shipment.number_of_voyages if risk_resp.overall_score > 50 else 0
        
        cost_bd = CostBreakdown(
            freight_cost=freight_cost,
            port_charges=port_charges,
            bunker_cost=bunker_cost,
            risk_premium=risk_premium,
            total_cost=freight_cost + port_charges + bunker_cost + risk_premium
        )
        
        rec = Recommendation(
            recommended_vessel="TBN (To Be Nominated)",
            recommended_vessel_type=recommended_vessel_type,
            recommended_route=f"{shipment.origin_port} -> {shipment.destination_port}",
            recommended_entry_window="Next 7 Days",
            recommended_contract=recommended_contract,
            expected_total_cost=cost_bd.total_cost,
            risk_adjusted_cost=cost_bd.total_cost * (1.0 + (risk_resp.overall_score / 1000.0)),
            risk_score=risk_resp.overall_score,
            expected_savings_vs_spot=cost_bd.total_cost * 0.15 if recommended_contract != "SPOT" else 0.0,
            decision_confidence=0.88,
            why_recommended=[
                f"Market forecast indicates rates averaging ${forecast_resp.current_rate}/MT.",
                f"{recommended_contract} minimizes exposure to volatility based on {shipment.risk_tolerance} risk tolerance.",
                f"{recommended_vessel_type} perfectly matches port draft constraints ({max_draft}m) for {shipment.cargo_quantity_mt} MT cargo."
            ],
            key_risk_drivers=[d.description for d in risk_resp.drivers],
            constraint_summary=[
                f"Commodity: {shipment.commodity}",
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
