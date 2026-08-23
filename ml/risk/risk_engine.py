import numpy as np
from typing import Dict, Any, List, Tuple

class RiskEngine:
    def __init__(self, weights: Dict[str, float] = None):
        # Default risk component weights
        self.weights = weights or {
            "market_risk": 0.30,
            "port_risk": 0.15,
            "vessel_risk": 0.15,
            "delay_risk": 0.20,
            "contract_risk": 0.10,
            "idle_risk": 0.10
        }
        
    def _scale_risk(self, raw_value: float, min_val: float, max_val: float) -> float:
        """Scales a raw metric to a 0-100 risk score."""
        scaled = ((raw_value - min_val) / (max_val - min_val)) * 100
        return max(0, min(100, scaled))

    def evaluate_risk(self, data: Dict[str, Any]) -> Tuple[float, List[str]]:
        """
        Evaluates overall risk.
        data should contain raw metrics like:
        - realized_volatility
        - port_congestion_index
        - vessel_age
        - expected_delay_days
        - contract_duration_months
        - expected_idle_days
        """
        reasons = []
        scores = {}
        
        # 1. Market Risk (Based on volatility)
        vol = data.get('realized_volatility', 0)
        market_score = self._scale_risk(vol, min_val=0, max_val=0.5)
        scores['market_risk'] = market_score
        if market_score > 60:
            reasons.append(f"High market volatility ({vol:.2f}) indicates elevated price risk.")
            
        # 2. Port Risk (Based on congestion index 0-1)
        congestion = data.get('port_congestion_index', 0)
        port_score = self._scale_risk(congestion, min_val=0, max_val=1)
        scores['port_risk'] = port_score
        if port_score > 60:
            reasons.append(f"Severe port congestion ({congestion:.2f}) increases operational risk.")

        # 3. Vessel Risk (Based on age for simplicity, could add draft/beam margins)
        vessel_age = data.get('vessel_age', 10)
        vessel_score = self._scale_risk(vessel_age, min_val=5, max_val=25)
        scores['vessel_risk'] = vessel_score
        if vessel_score > 60:
            reasons.append(f"Vessel age ({vessel_age} years) increases breakdown probability.")

        # 4. Delay Risk
        delay = data.get('expected_delay_days', 0)
        delay_score = self._scale_risk(delay, min_val=0, max_val=10)
        scores['delay_risk'] = delay_score
        if delay_score > 60:
            reasons.append(f"Expected delay of {delay} days poses severe schedule risk.")
            
        # 5. Contract Risk (Spot = high risk, Long-term = lower spot exposure but high lock-in)
        # Assuming spot (0 months) has highest price risk.
        duration = data.get('contract_duration_months', 0)
        contract_score = 100 if duration == 0 else self._scale_risk(12 - duration, min_val=0, max_val=12)
        scores['contract_risk'] = contract_score
        if contract_score > 80:
            reasons.append("Spot contract leaves you fully exposed to near-term market shocks.")

        # 6. Idle Risk
        idle = data.get('expected_idle_days', 0)
        idle_score = self._scale_risk(idle, min_val=0, max_val=14)
        scores['idle_risk'] = idle_score
        if idle_score > 60:
            reasons.append(f"High expected idle time ({idle} days) severely reduces profitability.")

        # Calculate weighted average
        overall_score = sum(score * self.weights[k] for k, score in scores.items())
        
        if not reasons:
            reasons.append("All risk factors are within acceptable operational limits.")
            
        return round(overall_score, 2), reasons

if __name__ == "__main__":
    engine = RiskEngine()
    
    sample_scenarios = [
        {
            "name": "High Risk Scenario (Spot, High Volatility)",
            "data": {
                "realized_volatility": 0.45,
                "port_congestion_index": 0.8,
                "vessel_age": 20,
                "expected_delay_days": 8,
                "contract_duration_months": 0,
                "expected_idle_days": 10
            }
        },
        {
            "name": "Low Risk Scenario (Long-term, Stable)",
            "data": {
                "realized_volatility": 0.05,
                "port_congestion_index": 0.2,
                "vessel_age": 8,
                "expected_delay_days": 1,
                "contract_duration_months": 12,
                "expected_idle_days": 1
            }
        }
    ]
    
    for scenario in sample_scenarios:
        print(f"\nEvaluating: {scenario['name']}")
        score, reasons = engine.evaluate_risk(scenario['data'])
        print(f"Overall Risk Score: {score}/100")
        print("Drivers:")
        for r in reasons:
            print(f"- {r}")
