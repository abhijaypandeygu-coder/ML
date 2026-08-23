from fastapi import APIRouter
from app.schemas.forecast import ForecastRequest, ForecastResponse
from app.services.forecast import ForecastService

router = APIRouter(
    prefix="/api/v1/forecast",
    tags=["forecast"],
)

@router.post("/", response_model=ForecastResponse)
def get_forecast(request: ForecastRequest):
    """Generate a freight rate forecast."""
    service = ForecastService()
    return service.generate_forecast(request)
