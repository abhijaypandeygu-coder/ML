import pulp
import pandas as pd
import json

class MILPScheduler:
    """
    Mixed-Integer Linear Programming (MILP) solver for Charter Timing.
    Objective: Minimize Total Expected Voyage Cost (EQ_EXP_COST).
    """
    def __init__(self, num_vessels_needed: int, cargo_quantity: float, port_cost: float, bunker_cost: float):
        self.num_vessels_needed = num_vessels_needed
        self.Q = cargo_quantity
        self.C_port = port_cost
        self.C_bunker = bunker_cost

    def optimize(self, daily_forecasts: list) -> dict:
        """
        Formulates and solves the MILP.
        `daily_forecasts` is a list of dicts: {'date': str, 'forecast': float}
        """
        # Create problem
        prob = pulp.LpProblem("Charter_Optimization", pulp.LpMinimize)
        
        # Decision variables: binary x_t (1 if we charter on day t, 0 otherwise)
        days = range(len(daily_forecasts))
        x = pulp.LpVariable.dicts("charter", days, cat='Binary')
        
        # Objective Function: Minimize Sum(x_t * [Q * E[F_t] + C_port + C_bunker])
        costs = []
        for t in days:
            e_f = daily_forecasts[t]['forecast']
            # EQ_EXP_COST: E[C] = Q * E[F] + C_port + C_bunker
            daily_total_cost = (self.Q * e_f) + self.C_port + self.C_bunker
            costs.append(daily_total_cost)
            
        prob += pulp.lpSum([x[t] * costs[t] for t in days]), "Total_Expected_Voyage_Cost"
        
        # Constraint 1: We must charter exactly `num_vessels_needed`
        prob += pulp.lpSum([x[t] for t in days]) == self.num_vessels_needed, "Exact_Vessels"
        
        # Solve
        prob.solve(pulp.PULP_CBC_CMD(msg=0))
        
        # Extract Results
        status = pulp.LpStatus[prob.status]
        optimal_cost = pulp.value(prob.objective)
        
        schedule = []
        for t in days:
            if pulp.value(x[t]) == 1.0:
                schedule.append({
                    "date": daily_forecasts[t]['date'],
                    "expected_freight_rate": daily_forecasts[t]['forecast'],
                    "voyage_cost": costs[t]
                })
                
        return {
            "status": status,
            "optimal_total_cost": optimal_cost,
            "scheduled_charters": schedule
        }

if __name__ == "__main__":
    print("Testing MILP Scheduler (Phase 8)...")
    
    # Mock probabilistic forecast outputs
    mock_forecasts = [
        {"date": "2023-08-23", "forecast": 50.0},
        {"date": "2023-08-24", "forecast": 49.5},
        {"date": "2023-08-25", "forecast": 48.0},
        {"date": "2023-08-26", "forecast": 47.5},
        {"date": "2023-08-27", "forecast": 48.0},
        {"date": "2023-08-28", "forecast": 51.0},
        {"date": "2023-08-29", "forecast": 52.0},
    ]
    
    scheduler = MILPScheduler(
        num_vessels_needed=2,
        cargo_quantity=180000, # CAPESIZE MT
        port_cost=50000,
        bunker_cost=150000
    )
    
    result = scheduler.optimize(mock_forecasts)
    print("\nMILP Optimization Result:")
    print(json.dumps(result, indent=2))
