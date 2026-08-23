import pandas as pd
import numpy as np
from typing import List, Dict, Any

from ml.optimization.charter_window import CharterTimingOptimizer

class Backtester:
    def __init__(self):
        self.timing_opt = CharterTimingOptimizer(risk_aversion_lambda=0.5)

    def run_backtest(self, historical_forecasts: List[Dict[str, Any]], window_size: int = 7) -> Dict[str, Any]:
        """
        Runs a simulation over chunks of data to compare AI timing vs Baseline timing.
        historical_forecasts: List of dicts representing historical 'forecast', 'lower_bound', 'upper_bound', and 'actual_rate'
        window_size: Number of days we have to make a decision within.
        """
        results = []
        cumulative_baseline_cost = 0
        cumulative_ai_cost = 0
        
        # We step through the history in chunks (e.g. every week we have a new cargo to move)
        for i in range(0, len(historical_forecasts) - window_size, window_size):
            chunk = historical_forecasts[i:i+window_size]
            
            # --- BASELINE STRATEGY: Always charter immediately on Day 1 of the window ---
            baseline_day = chunk[0]
            baseline_actual_cost = baseline_day['actual_rate']
            
            # --- AI STRATEGY: Use our optimizer to pick the best day in the window ---
            evaluated = self.timing_opt.evaluate_candidates(
                current_date=chunk[0]['date'],
                horizon_days=window_size,
                daily_forecasts=chunk
            )
            # Find the best single day to enter (window_size=1 for this specific backtest comparison)
            optimal_window = self.timing_opt.get_optimal_window(evaluated, window_size=1)
            best_date = optimal_window['optimal_window_start']
            
            # Get the actual rate that occurred on the date the AI picked
            ai_actual_cost = next(day['actual_rate'] for day in chunk if day['date'] == best_date)
            
            cumulative_baseline_cost += baseline_actual_cost
            cumulative_ai_cost += ai_actual_cost
            
            savings = baseline_actual_cost - ai_actual_cost
            
            results.append({
                "period_start": chunk[0]['date'],
                "baseline_date_picked": chunk[0]['date'],
                "baseline_cost": round(baseline_actual_cost, 2),
                "ai_date_picked": best_date,
                "ai_cost": round(ai_actual_cost, 2),
                "savings": round(savings, 2)
            })

        total_savings = cumulative_baseline_cost - cumulative_ai_cost
        savings_pct = (total_savings / cumulative_baseline_cost) * 100 if cumulative_baseline_cost > 0 else 0

        return {
            "summary": {
                "total_cargoes_moved": len(results),
                "cumulative_baseline_cost": round(cumulative_baseline_cost, 2),
                "cumulative_ai_cost": round(cumulative_ai_cost, 2),
                "total_savings": round(total_savings, 2),
                "savings_percentage": round(savings_pct, 2)
            },
            "details": results
        }

if __name__ == "__main__":
    print("Running Backtest Simulation...\n")
    
    # Generate some mock historical data where the AI has a slight advantage 
    # (e.g. AI can foresee price drops later in the week)
    mock_history = []
    base_price = 50.0
    dates = pd.date_range(start="2023-01-01", periods=28) # 4 weeks of data
    
    for i, date in enumerate(dates):
        # Add some wave-like volatility
        actual = base_price + np.sin(i * 0.5) * 5 + np.random.randn()
        
        mock_history.append({
            "date": date.strftime("%Y-%m-%d"),
            "actual_rate": actual,
            # Perfect foresight for the sake of the mock backtest demonstration (with some noise)
            "forecast": actual + np.random.randn() * 0.5, 
            "lower_bound": actual - 3,
            "upper_bound": actual + 3
        })
        
    tester = Backtester()
    report = tester.run_backtest(mock_history, window_size=7) # 1 decision per week
    
    import json
    print(json.dumps(report['summary'], indent=2))
    
    print("\nDetailed Week-by-Week Comparison:")
    df_details = pd.DataFrame(report['details'])
    print(df_details.to_string(index=False))
