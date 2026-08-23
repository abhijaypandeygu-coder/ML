from typing import Dict, Any
from ..schemas.vessel import Vessel
from ..schemas.port import Port
from ..schemas.shipment import ShipmentRequest

class PortConstraintEngine:
    def __init__(self):
        pass

    def evaluate_port_fit(self, vessel: Vessel, port: Port, shipment: ShipmentRequest) -> Dict[str, Any]:
        """
        Calculates port compatibility and operational metrics.
        """
        is_feasible = True
        if vessel.draft_m > port.max_draft_m or vessel.loa_m > port.max_loa_m or vessel.beam_m > port.max_beam_m:
            is_feasible = False
            
        # If feasible, calculate turnaround and penalties
        cargo_handled_per_voyage = shipment.cargo_quantity_mt / shipment.number_of_voyages
        handling_days = cargo_handled_per_voyage / port.cargo_handling_rate_tpd
        expected_turnaround = handling_days + port.avg_wait_days
        
        congestion_penalty = 1.0
        if port.congestion_level == "HIGH":
            congestion_penalty = 1.5
        elif port.congestion_level == "MEDIUM":
            congestion_penalty = 1.2

        return {
            "feasible": is_feasible,
            "expected_turnaround_days": round(expected_turnaround, 2),
            "congestion_penalty_multiplier": congestion_penalty,
            "avg_wait_days": port.avg_wait_days
        }
