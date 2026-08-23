import pandas as pd
from typing import Dict, Any

class ContractOptimizer:
    def __init__(self, risk_aversion: float = 0.5):
        self.risk_aversion = risk_aversion

    def evaluate_strategies(self, spot_rate_forecast: float, spot_volatility: float, 
                           short_term_premium: float = 0.05, medium_term_premium: float = 0.10) -> pd.DataFrame:
        """
        Evaluates Spot, Short-Term (3-6m), and Medium-Term (6-12m) strategies.
        Higher premiums mean you pay more for certainty.
        """
        strategies = []
        
        # 1. SPOT: Single voyage. Highest flexibility, highest price risk.
        spot_cost = spot_rate_forecast
        spot_risk = spot_volatility * spot_cost # Value at risk
        spot_total = spot_cost + (self.risk_aversion * spot_risk)
        
        strategies.append({
            "strategy": "SPOT",
            "expected_cost": round(spot_cost, 2),
            "market_exposure_risk": round(spot_risk, 2),
            "flexibility_score": 100,
            "availability_risk": 50,
            "risk_adjusted_cost": round(spot_total, 2)
        })
        
        # 2. SHORT-TERM: Multiple voyages over short horizon. Locks in rate with a premium.
        st_cost = spot_rate_forecast * (1 + short_term_premium)
        st_risk = (spot_volatility * 0.5) * st_cost # Half the market exposure
        st_total = st_cost + (self.risk_aversion * st_risk)
        
        strategies.append({
            "strategy": "SHORT_TERM",
            "expected_cost": round(st_cost, 2),
            "market_exposure_risk": round(st_risk, 2),
            "flexibility_score": 50,
            "availability_risk": 20,
            "risk_adjusted_cost": round(st_total, 2)
        })
        
        # 3. MEDIUM-TERM: Multiple voyages over long horizon. High premium, low risk.
        mt_cost = spot_rate_forecast * (1 + medium_term_premium)
        mt_risk = (spot_volatility * 0.1) * mt_cost # Very low market exposure
        mt_total = mt_cost + (self.risk_aversion * mt_risk)
        
        strategies.append({
            "strategy": "MEDIUM_TERM",
            "expected_cost": round(mt_cost, 2),
            "market_exposure_risk": round(mt_risk, 2),
            "flexibility_score": 20,
            "availability_risk": 5,
            "risk_adjusted_cost": round(mt_total, 2)
        })
        
        df = pd.DataFrame(strategies)
        return df.sort_values('risk_adjusted_cost')

    def get_optimal_strategy(self, evaluated: pd.DataFrame) -> Dict[str, Any]:
        optimal = evaluated.iloc[0]
        return optimal.to_dict()

if __name__ == "__main__":
    print("Testing Contract Strategy Optimizer...")
    
    # Scenario: High Volatility Market
    optimizer = ContractOptimizer(risk_aversion=1.2) # High risk aversion
    
    evaluated = optimizer.evaluate_strategies(
        spot_rate_forecast=50.0, 
        spot_volatility=0.40, # 40% volatility
        short_term_premium=0.08, # 8% premium for short term
        medium_term_premium=0.15 # 15% premium for medium term
    )
    
    print("\nEvaluated Strategies (High Volatility, High Aversion):")
    print(evaluated.to_string(index=False))
    
    optimal = optimizer.get_optimal_strategy(evaluated)
    print(f"\nOptimal Strategy: {optimal['strategy']} with RAC: {optimal['risk_adjusted_cost']}")
    
    # Scenario: Low Volatility Market
    optimizer_low = ContractOptimizer(risk_aversion=0.3) # Low risk aversion
    evaluated_low = optimizer_low.evaluate_strategies(
        spot_rate_forecast=50.0, 
        spot_volatility=0.10, # 10% volatility
        short_term_premium=0.08,
        medium_term_premium=0.15
    )
    
    print("\nEvaluated Strategies (Low Volatility, Low Aversion):")
    print(evaluated_low.to_string(index=False))
    
    optimal_low = optimizer_low.get_optimal_strategy(evaluated_low)
    print(f"\nOptimal Strategy: {optimal_low['strategy']} with RAC: {optimal_low['risk_adjusted_cost']}")
