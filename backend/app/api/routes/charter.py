from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db

from app.schemas.orchestration import CharterAnalysisRequest, CharterAnalysisResponse
from app.services.orchestration import CharterAnalysisService

router = APIRouter(
    prefix="/api/v1/charter",
    tags=["orchestration"],
)

@router.post("/analyze", response_model=CharterAnalysisResponse)
def analyze_charter(request: CharterAnalysisRequest, db: Session = Depends(get_db)):
    """Orchestrates the entire system to provide a full chartering recommendation."""
    service = CharterAnalysisService(db)
    return service.analyze(request)
