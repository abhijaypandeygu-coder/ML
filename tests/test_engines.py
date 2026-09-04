import pytest
import sys
import os

# Add root to sys path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from ml.optimization.solvers.milp_scheduler import MILPScheduler
from ml.risk.var_engine import VaREngine

def test_milp_scheduler():
    mock_forecasts = [
        {"date": "2023-08-23", "forecast": 50.0},
        {"date": "2023-08-24", "forecast": 49.0},
        {"date": "2023-08-25", "forecast": 48.0},
    ]
    scheduler = MILPScheduler(num_vessels_needed=1, cargo_quantity=100000, port_cost=10000, bunker_cost=20000)
    result = scheduler.optimize(mock_forecasts)
    
    assert result['status'] == 'Optimal', "MILP failed to find optimal solution"
    assert len(result['scheduled_charters']) == 1, "Should schedule exactly 1 vessel"
    assert result['scheduled_charters'][0]['date'] == "2023-08-25", "Failed to pick the lowest cost date"

def test_var_engine():
    engine = VaREngine(confidence_level=0.95, num_simulations=1000)
    metrics = engine.compute_risk_metrics(forecast_lower=10, forecast_mean=20, forecast_upper=30, cargo_quantity=1000)
    
    assert 'VaR' in metrics, "Missing VaR"
    assert 'CVaR' in metrics, "Missing CVaR"
    assert metrics['CVaR'] >= metrics['VaR'], "CVaR should be strictly >= VaR"
    assert metrics['confidence_level'] == 0.95
