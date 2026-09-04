from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from datetime import datetime

class DataQualityMetrics(BaseModel):
    row_count: int
    missing_rate: float
    duplicate_rate: float
    invalid_rate: float
    outlier_rate: float
    freshness_days: float
    quality_score: float
    quality_status: str # HEALTHY, WARNING, CRITICAL
    leakage_detected: bool
    leakage_count: int
    leakage_sources: List[str]

class ForecastMetrics(BaseModel):
    model_name: str
    mae: float
    rmse: float
    mape: float
    directional_accuracy: float
    picp: Optional[float] = None
    mpiw: Optional[float] = None

class OptimizationMetrics(BaseModel):
    feasibility_rate: float
    constraint_violation_rate: float
    mean_regret: float
    max_regret: float

class BusinessMetrics(BaseModel):
    total_expected_cost: float
    total_baseline_cost: float
    cost_reduction_pct: float
    idle_reduction_pct: float
    delay_reduction_pct: float

class RobustnessMetrics(BaseModel):
    recommendation_stability_pct: float
    cost_variance: float
    deadline_compliance_pct: float

class EvaluationReport(BaseModel):
    evaluation_id: str
    evaluation_timestamp: datetime
    data_quality: DataQualityMetrics
    forecast_performance: List[ForecastMetrics]
    optimization_performance: OptimizationMetrics
    business_impact: BusinessMetrics
    robustness: RobustnessMetrics
    overall_status: str
