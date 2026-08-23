from typing import Dict, Any, List
from datetime import date
from ..schemas.vessel import Vessel
from ..schemas.port import Port
from ..schemas.shipment import ShipmentRequest

class VesselCompatibilityEngine:
    def __init__(self):
        pass

    def evaluate_compatibility(
        self, 
        vessel: Vessel, 
        origin_port: Port, 
        destination_port: Port, 
        shipment: ShipmentRequest
    ) -> Dict[str, Any]:
        """
        Deterministically evaluates if a vessel passes all hard constraints.
        If it fails, it is marked INFEASIBLE.
        """
        failed_constraints: List[str] = []
        checks: Dict[str, bool] = {
            "capacity": True,
            "draft": True,
            "loa": True,
            "beam": True,
            "availability": True
        }

        # 1. Capacity Check
        if vessel.capacity_mt < (shipment.cargo_quantity_mt / shipment.number_of_voyages):
            # Allow up to 5% tolerance for multi-voyage or short loading
            if vessel.capacity_mt < (shipment.cargo_quantity_mt / shipment.number_of_voyages) * 0.95:
                checks["capacity"] = False
                failed_constraints.append("capacity")

        # 2. Draft Check (must clear both ports)
        if vessel.draft_m > origin_port.max_draft_m or vessel.draft_m > destination_port.max_draft_m:
            checks["draft"] = False
            failed_constraints.append("draft")

        # 3. LOA Check
        if vessel.loa_m > origin_port.max_loa_m or vessel.loa_m > destination_port.max_loa_m:
            checks["loa"] = False
            failed_constraints.append("loa")

        # 4. Beam Check
        if vessel.beam_m > origin_port.max_beam_m or vessel.beam_m > destination_port.max_beam_m:
            checks["beam"] = False
            failed_constraints.append("beam")

        # 5. Availability Check
        if vessel.available_from > shipment.loading_date:
            checks["availability"] = False
            failed_constraints.append("availability")

        if failed_constraints:
            return {
                "vessel_id": vessel.vessel_id,
                "status": "INFEASIBLE",
                "failed_constraints": failed_constraints,
                "checks": checks
            }

        cargo_utilization = min(100.0, (shipment.cargo_quantity_mt / shipment.number_of_voyages) / vessel.capacity_mt * 100)

        return {
            "vessel_id": vessel.vessel_id,
            "status": "FEASIBLE",
            "checks": checks,
            "cargo_utilization_pct": round(cargo_utilization, 2)
        }
