from fastapi import APIRouter
from app.schemas.risk import RiskAnalysisRequest, RiskAnalysisResponse
from app.services.risk import RiskService

router = APIRouter(
    prefix="/api/v1/risk",
    tags=["risk"],
)

@router.post("/analyze", response_model=RiskAnalysisResponse)
def analyze_risk(request: RiskAnalysisRequest):
    """Analyze the risk of a specific charter."""
    service = RiskService()
    return service.analyze_risk(request)
