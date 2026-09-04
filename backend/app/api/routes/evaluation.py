import uuid
from datetime import datetime
from fastapi import APIRouter
from app.schemas.evaluation import EvaluationReport
from app.services.evaluation.data_quality import DataQualityEvaluator
from app.services.evaluation.forecast_eval import ForecastEvaluator
from app.services.evaluation.optimization_eval import OptimizationEvaluator
from app.services.evaluation.robustness_eval import RobustnessEvaluator

router = APIRouter(
    prefix="/evaluation",
    tags=["evaluation"],
)

@router.post("/run", response_model=EvaluationReport)
def run_full_evaluation():
    """Runs the full evaluation pipeline and returns the scorecard report."""
    dq = DataQualityEvaluator().evaluate()
    forecasts = ForecastEvaluator().evaluate_baselines()
    
    opt_eval = OptimizationEvaluator()
    opt_metrics = opt_eval.evaluate_optimization()
    biz_metrics = opt_eval.evaluate_business_impact()
    
    robust = RobustnessEvaluator().evaluate()
    
    status = "PASSED"
    if dq.leakage_detected or dq.quality_status == "CRITICAL" or opt_metrics.constraint_violation_rate > 0:
        status = "FAILED"
    
    return EvaluationReport(
        evaluation_id=str(uuid.uuid4()),
        evaluation_timestamp=datetime.utcnow(),
        data_quality=dq,
        forecast_performance=forecasts,
        optimization_performance=opt_metrics,
        business_impact=biz_metrics,
        robustness=robust,
        overall_status=status
    )
