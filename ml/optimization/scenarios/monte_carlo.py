import numpy as np
from typing import Dict, Any, Callable

class MonteCarloSimulator:
    def __init__(self, n_iterations: int = 1000):
        self.n_iterations = n_iterations

    def run_simulation(
        self,
        base_inputs: Dict[str, Any],
        optimization_callback: Callable
    ) -> Dict[str, Any]:
        """
        Section 27: Monte Carlo Engine
        Samples inputs from distributions and runs optimization N times.
        """
        results = []
        base_freight = base_inputs.get("freight_rate", 20.0)
        base_fuel = base_inputs.get("fuel_price", 600.0)
        
        # Sample distributions
        freight_samples = np.random.normal(base_freight, base_freight * 0.15, self.n_iterations)
        fuel_samples = np.random.normal(base_fuel, base_fuel * 0.10, self.n_iterations)
        delay_samples = np.random.poisson(2, self.n_iterations) # Avg 2 days delay
        
        for i in range(self.n_iterations):
            iter_inputs = base_inputs.copy()
            iter_inputs["freight_rate"] = max(1.0, freight_samples[i])
            iter_inputs["fuel_price"] = max(100.0, fuel_samples[i])
            iter_inputs["expected_delay"] = delay_samples[i]
            
            res = optimization_callback(iter_inputs)
            results.append(res.get("total_cost", 0.0))
            
        results = np.array(results)
        
        return {
            "iterations": self.n_iterations,
            "expected_cost_mean": round(float(np.mean(results)), 2),
            "p10_cost": round(float(np.percentile(results, 10)), 2),
            "p50_cost": round(float(np.percentile(results, 50)), 2),
            "p90_cost": round(float(np.percentile(results, 90)), 2),
            "value_at_risk_95": round(float(np.percentile(results, 95)), 2)
        }
