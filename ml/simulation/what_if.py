import copy
from typing import Dict, Any

from ml.risk.risk_engine import RiskEngine
from ml.optimization.vessel import VesselOptimizer
from ml.optimization.charter_window import CharterTimingOptimizer
from ml.optimization.contract import ContractOptimizer

class WhatIfSimulator:
    def __init__(self):
        self.risk_engine = RiskEngine()
        self.vessel_opt = VesselOptimizer()
        self.timing_opt = CharterTimingOptimizer()
        self.contract_opt = ContractOptimizer()

    def simulate_scenario(self, base_data: Dict[str, Any], adjustments: Dict[str, float]) -> Dict[str, Any]:
        """
        base_data: The current state of the market, vessel data, port data, etc.
        adjustments: Percent changes or absolute changes, e.g. {"freight_rate_pct": 0.10, "delay_days_add": 3}
        """
        # Deep copy to avoid mutating the original data
        sim_data = copy.deepcopy(base_data)
        
        # Apply Adjustments
        if 'freight_rate_pct' in adjustments:
            for day in sim_data['forecasts']:
                day['forecast'] *= (1 + adjustments['freight_rate_pct'])
                day['lower_bound'] *= (1 + adjustments['freight_rate_pct'])
                day['upper_bound'] *= (1 + adjustments['freight_rate_pct'])
                
        if 'fuel_cost_pct' in adjustments:
            # Increase expected cost of all vessels
            for v in sim_data['vessels_context']:
                v['expected_cost'] *= (1 + adjustments['fuel_cost_pct'])
                
        if 'cargo_quantity_pct' in adjustments:
            sim_data['required_cargo'] *= (1 + adjustments['cargo_quantity_pct'])
            
        if 'delay_days_add' in adjustments:
            sim_data['risk_data']['expected_delay_days'] += adjustments['delay_days_add']
            for v in sim_data['vessels_context']:
                v['expected_delay'] += adjustments['delay_days_add']
                
        if 'port_congestion_pct' in adjustments:
            new_congestion = sim_data['risk_data']['port_congestion_index'] * (1 + adjustments['port_congestion_pct'])
            sim_data['risk_data']['port_congestion_index'] = min(1.0, new_congestion)

        # 1. Recalculate Risk
        overall_risk, risk_drivers = self.risk_engine.evaluate_risk(sim_data['risk_data'])
        
        # 2. Recalculate Vessel Ranking
        import pandas as pd
        vessels_df = pd.DataFrame(sim_data['vessels'])
        feasible = self.vessel_opt.filter_hard_constraints(vessels_df, sim_data['port'], sim_data['required_cargo'])
        
        ranked_vessels = pd.DataFrame()
        if not feasible.empty:
            ranked_vessels = self.vessel_opt.rank_vessels(feasible, sim_data['vessels_context'], sim_data['required_cargo'])
            
        # 3. Recalculate Entry Timing
        evaluated_timing = self.timing_opt.evaluate_candidates(
            current_date=sim_data['current_date'],
            horizon_days=7,
            daily_forecasts=sim_data['forecasts']
        )
        optimal_timing = self.timing_opt.get_optimal_window(evaluated_timing)
        
        # 4. Recalculate Contract Strategy
        # Use the forecast from the optimal start date
        start_date = optimal_timing['optimal_window_start']
        target_forecast = next((f['forecast'] for f in sim_data['forecasts'] if f['date'] == start_date), sim_data['forecasts'][0]['forecast'])
        
        evaluated_contracts = self.contract_opt.evaluate_strategies(
            spot_rate_forecast=target_forecast,
            spot_volatility=sim_data['risk_data']['realized_volatility']
        )
        optimal_contract = self.contract_opt.get_optimal_strategy(evaluated_contracts)
        
        return {
            "overall_risk_score": overall_risk,
            "risk_drivers": risk_drivers,
            "recommended_vessel": ranked_vessels.iloc[0]['vessel_type'] if not ranked_vessels.empty else "None",
            "optimal_entry_window": optimal_timing,
            "recommended_contract": optimal_contract
        }

if __name__ == "__main__":
    print("Testing What-If Simulator...")
    
    base_scenario = {
        "current_date": "2023-08-23",
        "required_cargo": 70000,
        "forecasts": [
            {"date": "2023-08-23", "forecast": 50.0, "lower_bound": 45.0, "upper_bound": 55.0},
            {"date": "2023-08-24", "forecast": 49.5, "lower_bound": 44.0, "upper_bound": 56.0},
            {"date": "2023-08-25", "forecast": 48.0, "lower_bound": 44.0, "upper_bound": 52.0}
        ],
        "risk_data": {
            "realized_volatility": 0.15,
            "port_congestion_index": 0.4,
            "vessel_age": 10,
            "expected_delay_days": 1,
            "contract_duration_months": 0,
            "expected_idle_days": 2
        },
        "port": {"max_draft": 18.0, "max_loa": 300.0, "max_beam": 50.0},
        "vessels": [
            {"vessel_id": "V1", "vessel_type": "Capesize", "capacity_mt": 150000, "draft_m": 19.5, "loa_m": 290, "beam_m": 45},
            {"vessel_id": "V2", "vessel_type": "Panamax", "capacity_mt": 75000, "draft_m": 14.0, "loa_m": 225, "beam_m": 32}
        ],
        "vessels_context": [
            {"expected_cost": 50, "risk_score": 10, "expected_idle": 2, "expected_delay": 1},
            {"expected_cost": 45, "risk_score": 5, "expected_idle": 1, "expected_delay": 0}
        ]
    }
    
    simulator = WhatIfSimulator()
    
    print("\n--- BASE SCENARIO ---")
    base_res = simulator.simulate_scenario(base_scenario, {})
    import json
    print(json.dumps(base_res, indent=2))
    
    print("\n--- SHOCK SCENARIO (+30% freight rate, +5 delay days) ---")
    shock_res = simulator.simulate_scenario(base_scenario, {
        "freight_rate_pct": 0.30,
        "delay_days_add": 5
    })
    print(json.dumps(shock_res, indent=2))
