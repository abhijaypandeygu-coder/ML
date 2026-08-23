from typing import List, Dict, Any
from ..schemas.strategy import ContractStrategy

class ContractStrategySolver:
    def __init__(self, risk_aversion_factor: float = 1.0):
        self.risk_aversion_factor = risk_aversion_factor

    def evaluate_strategies(
        self,
        base_spot_rate: float,
        cargo_quantity: float,
        spot_volatility: float
    ) -> List[ContractStrategy]:
        """
        Section 16: Contract Strategy Optimization
        """
        strategies = []

        # 1. Spot Strategy
        spot_cost = base_spot_rate * cargo_quantity
        spot_risk = spot_volatility * 100 * self.risk_aversion_factor
        
        strategies.append(ContractStrategy(
            strategy_type="SPOT",
            expected_total_cost=spot_cost,
            risk_score=spot_risk,
            flexibility="HIGH",
            availability_risk="HIGH",
            market_exposure="HIGH",
            idle_risk="LOW"
        ))

        # 2. Short-Term Strategy (2% discount, less volatility exposure)
        short_cost = (base_spot_rate * 0.98) * cargo_quantity
        short_risk = (spot_volatility * 0.5) * 100 * self.risk_aversion_factor
        
        strategies.append(ContractStrategy(
            strategy_type="SHORT_TERM",
            expected_total_cost=short_cost,
            risk_score=short_risk,
            flexibility="MEDIUM",
            availability_risk="MEDIUM",
            market_exposure="MEDIUM",
            idle_risk="LOW"
        ))

        # 3. Medium-Term Multi-Voyage (7% discount, lowest market exposure)
        med_cost = (base_spot_rate * 0.93) * cargo_quantity
        med_risk = (spot_volatility * 0.1) * 100 * self.risk_aversion_factor
        
        strategies.append(ContractStrategy(
            strategy_type="MEDIUM_TERM_MULTIPLE_VOYAGE",
            expected_total_cost=med_cost,
            risk_score=med_risk,
            flexibility="LOW",
            availability_risk="LOW",
            market_exposure="LOW",
            idle_risk="LOW"
        ))

        # Determine Recommendation (Minimize Risk-Adjusted Cost)
        for s in strategies:
            # Simple weighting for this example
            adjusted = s.expected_total_cost + (s.risk_score * 1000)
            s.risk_score = adjusted # storing adjusted for ranking

        best_strategy = min(strategies, key=lambda x: x.risk_score)
        best_strategy.is_recommended = True

        # Sort by best
        strategies.sort(key=lambda x: x.risk_score)
        return strategies
