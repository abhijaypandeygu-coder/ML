import numpy as np
from typing import List, Dict, Any
from ..schemas.vessel import Vessel

class MultiVoyageSolver:
    def __init__(self):
        try:
            from scipy.optimize import linear_sum_assignment
            self._lsa = linear_sum_assignment
        except ImportError:
            self._lsa = None

    def optimize_fleet_assignment(
        self,
        vessels: List[Vessel],
        voyages: List[Dict[str, Any]],
        cost_matrix: List[List[float]]
    ) -> Dict[str, Any]:
        """
        Section 17: Multi-Voyage Optimization
        Assigns vessels to voyages to minimize total cost using the Hungarian algorithm.
        """
        if not self._lsa:
            return {"status": "ERROR", "reason": "scipy not installed"}
            
        cost_array = np.array(cost_matrix)
        row_ind, col_ind = self._lsa(cost_array)
        
        assignments = []
        total_cost = 0.0
        
        for i, j in zip(row_ind, col_ind):
            # i = vessel index, j = voyage index
            cost = cost_array[i, j]
            assignments.append({
                "vessel_id": vessels[i].vessel_id,
                "voyage_id": voyages[j].get("voyage_id", f"V_{j}"),
                "assigned_cost": cost
            })
            total_cost += cost
            
        return {
            "status": "SUCCESS",
            "assignments": assignments,
            "total_optimized_cost": total_cost
        }
