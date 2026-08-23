from typing import List, Dict, Any
from ..schemas.vessel import Vessel
from ..schemas.port import Port
from ..schemas.shipment import ShipmentRequest
from ..constraints.vessel_constraints import VesselCompatibilityEngine
from ..constraints.port_constraints import PortConstraintEngine
from ..costs import (
    calculate_charter_cost, calculate_fuel_cost, 
    calculate_port_cost, calculate_delay_cost, 
    calculate_idle_cost, calculate_total_cost
)

class VesselAssignmentSolver:
    def __init__(self):
        self.vessel_engine = VesselCompatibilityEngine()
        self.port_engine = PortConstraintEngine()

    def generate_candidates(
        self, 
        vessels: List[Vessel], 
        origin: Port, 
        destination: Port, 
        shipment: ShipmentRequest,
        forecast_rate: float,
        fuel_price: float,
        expected_delay: float
    ) -> Dict[str, Any]:
        """
        Section 6: Candidate Generation
        Filters infeasible combinations and calculates costs for feasible ones.
        """
        feasible = []
        infeasible = []

        for v in vessels:
            v_fit = self.vessel_engine.evaluate_compatibility(v, origin, destination, shipment)
            if v_fit["status"] == "INFEASIBLE":
                infeasible.append(v_fit)
                continue
                
            origin_fit = self.port_engine.evaluate_port_fit(v, origin, shipment)
            dest_fit = self.port_engine.evaluate_port_fit(v, destination, shipment)
            
            if not origin_fit["feasible"] or not dest_fit["feasible"]:
                infeasible.append({"vessel_id": v.vessel_id, "status": "INFEASIBLE", "failed_constraints": ["port_capability"]})
                continue

            # If feasible, compute component costs
            turnaround = origin_fit["expected_turnaround_days"] + dest_fit["expected_turnaround_days"] + (10.0) # approx sea days
            
            c_charter = calculate_charter_cost(v.daily_charter_rate_usd, turnaround, shipment.number_of_voyages)
            c_fuel = calculate_fuel_cost(10.0, turnaround - 10.0, v.bunker_consumption_sea_tpd, v.bunker_consumption_port_tpd, fuel_price, shipment.number_of_voyages)
            c_port = calculate_port_cost(origin.port_dues_base_usd, destination.port_dues_base_usd, v.capacity_mt, shipment.number_of_voyages)
            c_delay = calculate_delay_cost(expected_delay, v.daily_charter_rate_usd, shipment.number_of_voyages)
            c_idle = calculate_idle_cost(2.0, 15000, 0.2, 0.8, 10000)
            
            costs = calculate_total_cost(c_charter, c_fuel, c_port, c_delay, c_idle, 0.0, "MEDIUM")
            
            feasible.append({
                "vessel": v.dict(),
                "metrics": v_fit,
                "costs": costs
            })

        # Rank feasible vessels by expected cost
        feasible.sort(key=lambda x: x["costs"]["total_expected_cost"])

        return {
            "feasible_count": len(feasible),
            "infeasible_count": len(infeasible),
            "ranked_feasible_candidates": feasible,
            "rejected_candidates": infeasible
        }
