import pandas as pd
from typing import List, Dict, Any

class VesselOptimizer:
    def __init__(self, weights: Dict[str, float] = None):
        # Default weights for scoring feasible vessels
        self.weights = weights or {
            "cost": 0.40,
            "risk": 0.20,
            "idle": 0.15,
            "delay": 0.15,
            "utilization": -0.10 # negative because higher utilization is better (lowers the penalty score)
        }
        
    def filter_hard_constraints(self, vessels: pd.DataFrame, port: Dict[str, float], required_cargo: float) -> pd.DataFrame:
        """
        Eliminates incompatible vessels based on physical constraints.
        port should contain: max_draft, max_loa, max_beam
        """
        initial_count = len(vessels)
        
        # Draft constraint
        feasible = vessels[vessels['draft_m'] <= port['max_draft']]
        # LOA constraint
        feasible = feasible[feasible['loa_m'] <= port['max_loa']]
        # Beam constraint
        feasible = feasible[feasible['beam_m'] <= port['max_beam']]
        # Capacity constraint (must be able to carry required cargo)
        feasible = feasible[feasible['capacity_mt'] >= required_cargo]
        
        eliminated = initial_count - len(feasible)
        print(f"Filtered out {eliminated} incompatible vessels out of {initial_count}.")
        
        return feasible.copy()

    def score_vessel(self, vessel: pd.Series, expected_cost: float, risk_score: float, 
                     expected_idle: float, expected_delay: float, required_cargo: float) -> float:
        """
        Calculates a unified suitability score (lower is better, represents cost/penalty).
        """
        # Utilization = Required Cargo / Vessel Capacity
        utilization = min(1.0, required_cargo / vessel['capacity_mt'])
        
        score = (
            self.weights['cost'] * expected_cost +
            self.weights['risk'] * risk_score +
            self.weights['idle'] * expected_idle +
            self.weights['delay'] * expected_delay +
            self.weights['utilization'] * utilization # Reduces the penalty score
        )
        return round(score, 2)

    def rank_vessels(self, feasible_vessels: pd.DataFrame, context_data: List[Dict[str, Any]], required_cargo: float) -> pd.DataFrame:
        """
        Scores and ranks all feasible vessels based on contextual data.
        context_data is a list of dicts mapped to each vessel containing expected cost, risk, etc.
        """
        scores = []
        for i, (_, vessel) in enumerate(feasible_vessels.iterrows()):
            ctx = context_data[i]
            score = self.score_vessel(
                vessel=vessel,
                expected_cost=ctx.get('expected_cost', 0),
                risk_score=ctx.get('risk_score', 0),
                expected_idle=ctx.get('expected_idle', 0),
                expected_delay=ctx.get('expected_delay', 0),
                required_cargo=required_cargo
            )
            scores.append(score)
            
        feasible_vessels['suitability_score'] = scores
        # Lower score is better
        ranked = feasible_vessels.sort_values(by='suitability_score', ascending=True)
        return ranked

if __name__ == "__main__":
    print("Testing Vessel/Port Constraints and Ranking...")
    
    # Mock Port
    paradip_port = {
        "max_draft": 18.0,
        "max_loa": 300.0,
        "max_beam": 50.0
    }
    
    # Mock Cargo Requirement
    cargo = 70000 # 70k MT
    
    # Mock Vessels
    vessels_data = pd.DataFrame([
        {"vessel_id": "V1", "vessel_type": "Capesize", "capacity_mt": 150000, "draft_m": 19.5, "loa_m": 290, "beam_m": 45}, # Fails draft
        {"vessel_id": "V2", "vessel_type": "Panamax", "capacity_mt": 75000, "draft_m": 14.0, "loa_m": 225, "beam_m": 32}, # Feasible
        {"vessel_id": "V3", "vessel_type": "Supramax", "capacity_mt": 55000, "draft_m": 12.0, "loa_m": 190, "beam_m": 32}, # Fails capacity
        {"vessel_id": "V4", "vessel_type": "Kamsarmax", "capacity_mt": 82000, "draft_m": 14.5, "loa_m": 229, "beam_m": 32}, # Feasible
    ])
    
    optimizer = VesselOptimizer()
    
    # 1. Hard Constraints
    feasible = optimizer.filter_hard_constraints(vessels_data, paradip_port, cargo)
    print("\nFeasible Vessels:")
    print(feasible[['vessel_id', 'vessel_type', 'capacity_mt', 'draft_m']])
    
    # 2. Scoring (Mock Context Data)
    context = [
        {"expected_cost": 45, "risk_score": 20, "expected_idle": 2, "expected_delay": 0}, # For V2
        {"expected_cost": 42, "risk_score": 50, "expected_idle": 5, "expected_delay": 2}  # For V4
    ]
    
    ranked = optimizer.rank_vessels(feasible, context, cargo)
    print("\nRanked Vessels (Lower Score is Better):")
    print(ranked[['vessel_id', 'vessel_type', 'suitability_score']])
