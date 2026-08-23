from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any, Optional

# Import our custom modules
from ml.risk.risk_engine import RiskEngine
from ml.optimization.vessel import VesselOptimizer
from ml.optimization.charter_window import CharterTimingOptimizer
from ml.optimization.contract import ContractOptimizer
from ml.simulation.what_if import WhatIfSimulator

app = FastAPI(
    title="FreightQuant AI/ML API",
    description="Intelligent Freight Forecasting and Optimization API",
    version="1.0.0"
)

# --- Pydantic Models for Input Validation ---

class ForecastRequest(BaseModel):
    # Depending on how the frontend sends data, this could just be a trigger to run the model
    # Or they might pass in live data
    market_data: List[Dict[str, Any]]
    
class VesselOptimizationRequest(BaseModel):
    port_constraints: Dict[str, float]
    required_cargo: float
    vessels: List[Dict[str, Any]]
    vessels_context: List[Dict[str, Any]]
    
class TimingOptimizationRequest(BaseModel):
    current_date: str
    horizon_days: int
    daily_forecasts: List[Dict[str, float]]
    risk_aversion: float = 0.5
    
class ContractOptimizationRequest(BaseModel):
    spot_rate_forecast: float
    spot_volatility: float
    risk_aversion: float = 0.5
    
class WhatIfRequest(BaseModel):
    base_scenario: Dict[str, Any]
    adjustments: Dict[str, float]


# --- API Endpoints ---

@app.get("/")
def read_root():
    return {"message": "Welcome to FreightQuant API"}

@app.post("/api/v1/optimize/vessels")
def optimize_vessels(req: VesselOptimizationRequest):
    try:
        optimizer = VesselOptimizer()
        import pandas as pd
        vessels_df = pd.DataFrame(req.vessels)
        
        feasible = optimizer.filter_hard_constraints(
            vessels_df, 
            req.port_constraints, 
            req.required_cargo
        )
        
        if feasible.empty:
            return {"status": "success", "feasible_vessels": []}
            
        ranked = optimizer.rank_vessels(feasible, req.vessels_context, req.required_cargo)
        
        return {
            "status": "success",
            "ranked_vessels": ranked.to_dict(orient="records")
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/optimize/timing")
def optimize_timing(req: TimingOptimizationRequest):
    try:
        optimizer = CharterTimingOptimizer(risk_aversion_lambda=req.risk_aversion)
        evaluated = optimizer.evaluate_candidates(
            current_date=req.current_date,
            horizon_days=req.horizon_days,
            daily_forecasts=req.daily_forecasts
        )
        optimal = optimizer.get_optimal_window(evaluated)
        return {
            "status": "success",
            "evaluated_candidates": evaluated.to_dict(orient="records"),
            "optimal_window": optimal
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/optimize/contract")
def optimize_contract(req: ContractOptimizationRequest):
    try:
        optimizer = ContractOptimizer(risk_aversion=req.risk_aversion)
        evaluated = optimizer.evaluate_strategies(
            spot_rate_forecast=req.spot_rate_forecast,
            spot_volatility=req.spot_volatility
        )
        optimal = optimizer.get_optimal_strategy(evaluated)
        return {
            "status": "success",
            "evaluated_strategies": evaluated.to_dict(orient="records"),
            "optimal_strategy": optimal
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/simulate")
def simulate_scenario(req: WhatIfRequest):
    try:
        simulator = WhatIfSimulator()
        result = simulator.simulate_scenario(req.base_scenario, req.adjustments)
        return {
            "status": "success",
            "simulation_result": result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    # Run the API locally for testing
    uvicorn.run(app, host="0.0.0.0", port=8000)
