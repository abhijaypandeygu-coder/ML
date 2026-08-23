from typing import List, Dict, Any
from datetime import date, timedelta
from ..schemas.shipment import ForecastInputs

class CharterTimingSolver:
    def __init__(self, risk_aversion_factor: float = 1.0):
        self.risk_aversion_factor = risk_aversion_factor

    def optimize_entry_window(
        self, 
        base_date: date,
        horizon_days: int,
        daily_forecasts: List[ForecastInputs]
    ) -> Dict[str, Any]:
        """
        Section 15: Charter Timing Optimization
        Evaluates candidate entry dates and finds the optimal window.
        """
        evaluated_dates = []
        
        for i in range(horizon_days):
            current_date = base_date + timedelta(days=i)
            if i < len(daily_forecasts):
                f = daily_forecasts[i]
                expected_cost = f.forecast_freight_rate
                # High volatility increases risk penalty
                risk_penalty = f.forecast_volatility * self.risk_aversion_factor * 100
                risk_adjusted_cost = expected_cost + risk_penalty
                
                evaluated_dates.append({
                    "date": current_date.isoformat(),
                    "expected_freight_rate": expected_cost,
                    "risk_penalty": risk_penalty,
                    "risk_adjusted_cost": risk_adjusted_cost
                })
                
        if not evaluated_dates:
            return {}

        # Find minimum risk-adjusted cost
        best_date = min(evaluated_dates, key=lambda x: x["risk_adjusted_cost"])
        
        # Find adjacent dates within 1% cost difference to form a window
        threshold = best_date["risk_adjusted_cost"] * 1.01
        optimal_window = [d for d in evaluated_dates if d["risk_adjusted_cost"] <= threshold]
        
        return {
            "optimal_entry_date": best_date["date"],
            "optimal_entry_window": {
                "start": optimal_window[0]["date"],
                "end": optimal_window[-1]["date"]
            },
            "window_size_days": len(optimal_window),
            "cost_by_date": evaluated_dates
        }
