import pandas as pd
import numpy as np
from typing import List, Dict, Any, Tuple
from datetime import datetime, timedelta

class CharterTimingOptimizer:
    def __init__(self, risk_aversion_lambda: float = 0.5):
        """
        risk_aversion_lambda: Weight given to uncertainty/risk when calculating risk-adjusted cost.
        higher lambda = more penalty for uncertainty.
        """
        self.risk_aversion_lambda = risk_aversion_lambda
        
    def evaluate_candidates(self, current_date: str, horizon_days: int, 
                          daily_forecasts: List[Dict[str, float]]) -> pd.DataFrame:
        """
        Evaluates candidate entry dates.
        daily_forecasts: List of dicts containing 'date', 'forecast', 'lower_bound', 'upper_bound'
        """
        candidates = []
        for day in daily_forecasts:
            expected_cost = day['forecast']
            # Risk proxied by the width of the confidence interval (uncertainty)
            risk = day['upper_bound'] - day['lower_bound']
            
            risk_adjusted_cost = expected_cost + (self.risk_aversion_lambda * risk)
            
            candidates.append({
                "candidate_date": day['date'],
                "expected_cost": round(expected_cost, 2),
                "risk": round(risk, 2),
                "risk_adjusted_cost": round(risk_adjusted_cost, 2)
            })
            
        return pd.DataFrame(candidates)
        
    def get_optimal_window(self, evaluated_candidates: pd.DataFrame, window_size: int = 3) -> Dict[str, Any]:
        """
        Finds the optimal consecutive window of days with the lowest average risk-adjusted cost.
        """
        if len(evaluated_candidates) < window_size:
            window_size = len(evaluated_candidates)
            
        # Calculate rolling average of risk-adjusted cost
        rolling_costs = evaluated_candidates['risk_adjusted_cost'].rolling(window=window_size).mean()
        
        # The index of the minimum rolling average represents the END of the optimal window
        optimal_end_idx = rolling_costs.idxmin()
        optimal_start_idx = optimal_end_idx - window_size + 1
        
        start_date = evaluated_candidates.iloc[optimal_start_idx]['candidate_date']
        end_date = evaluated_candidates.iloc[optimal_end_idx]['candidate_date']
        avg_cost = round(rolling_costs[optimal_end_idx], 2)
        
        return {
            "optimal_window_start": start_date,
            "optimal_window_end": end_date,
            "average_risk_adjusted_cost": avg_cost,
            "window_size_days": window_size
        }

if __name__ == "__main__":
    print("Testing Charter Timing Optimizer...")
    
    # Mock output from our Probabilistic Forecaster
    mock_forecasts = [
        {"date": "2023-08-23", "forecast": 50.0, "lower_bound": 45.0, "upper_bound": 55.0},
        {"date": "2023-08-24", "forecast": 49.5, "lower_bound": 44.0, "upper_bound": 56.0},
        {"date": "2023-08-25", "forecast": 48.0, "lower_bound": 44.0, "upper_bound": 52.0},
        {"date": "2023-08-26", "forecast": 47.5, "lower_bound": 44.0, "upper_bound": 51.0},
        {"date": "2023-08-27", "forecast": 48.0, "lower_bound": 43.0, "upper_bound": 53.0},
        {"date": "2023-08-28", "forecast": 51.0, "lower_bound": 42.0, "upper_bound": 60.0}, # High uncertainty later on
        {"date": "2023-08-29", "forecast": 52.0, "lower_bound": 41.0, "upper_bound": 65.0},
    ]
    
    optimizer = CharterTimingOptimizer(risk_aversion_lambda=0.5)
    
    evaluated = optimizer.evaluate_candidates(
        current_date="2023-08-23", 
        horizon_days=7, 
        daily_forecasts=mock_forecasts
    )
    
    print("\nCandidate Evaluation:")
    print(evaluated)
    
    optimal_window = optimizer.get_optimal_window(evaluated, window_size=3)
    
    print("\nOptimal Entry Window:")
    import json
    print(json.dumps(optimal_window, indent=2))
