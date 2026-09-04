import numpy as np
import pandas as pd
import json

class VaREngine:
    """
    Computes Value at Risk (VaR) and Conditional Value at Risk (CVaR)
    based on the probabilistic forecasts (percentiles).
    """
    def __init__(self, confidence_level: float = 0.95, num_simulations: int = 10000):
        self.alpha = confidence_level
        self.num_simulations = num_simulations

    def compute_risk_metrics(self, forecast_lower: float, forecast_mean: float, forecast_upper: float, 
                             cargo_quantity: float) -> dict:
        """
        Simulates the freight rate distribution assuming a normal or skewed distribution 
        fitted to the 10th, 50th, and 90th percentiles, and computes the Risk (Loss) metrics.
        
        Loss is defined as the extra cost incurred above the expected mean cost.
        L = Q * (F_actual - F_mean)
        """
        # We approximate the standard deviation using the upper and lower bounds.
        # For a normal distribution, the 10th to 90th percentile covers approx 2.56 standard deviations
        # std_dev = (upper - lower) / 2.56
        # To handle asymmetric bounds safely, we use two half-normals or just average them.
        std_dev = (forecast_upper - forecast_lower) / 2.56
        
        # Simulate rates
        simulated_rates = np.random.normal(loc=forecast_mean, scale=std_dev, size=self.num_simulations)
        
        # Calculate Loss distribution (only positive losses matter for VaR)
        losses = cargo_quantity * (simulated_rates - forecast_mean)
        losses = np.maximum(losses, 0) # We only care about cost overruns
        
        # VaR: The value at the `alpha` percentile of the loss distribution
        var_value = np.percentile(losses, self.alpha * 100)
        
        # CVaR: The expected loss given that the loss exceeds VaR
        tail_losses = losses[losses >= var_value]
        cvar_value = np.mean(tail_losses) if len(tail_losses) > 0 else var_value
        
        return {
            "confidence_level": self.alpha,
            "VaR": float(var_value),
            "CVaR": float(cvar_value),
            "max_simulated_loss": float(np.max(losses))
        }

if __name__ == "__main__":
    print("Testing VaR and CVaR Engine (Phase 9)...")
    
    # Example input from the Probabilistic Forecaster
    # Suppose we forecasted tomorrow's rate:
    # Mean: 19.8, Lower (10%): 17.8, Upper (90%): 21.0
    
    cargo = 180000 # MT for Capesize
    engine = VaREngine(confidence_level=0.95)
    
    metrics = engine.compute_risk_metrics(
        forecast_lower=17.8,
        forecast_mean=19.8,
        forecast_upper=21.0,
        cargo_quantity=cargo
    )
    
    print("\nCalculated Risk Exposure:")
    print(json.dumps(metrics, indent=2))
