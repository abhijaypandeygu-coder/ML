from fastapi import APIRouter
from app.schemas.simulation import WhatIfRequest, SimulationResponse
from app.services.simulation import SimulationService

router = APIRouter(
    prefix="/api/v1/simulation",
    tags=["simulation"],
)

@router.post("/what-if", response_model=SimulationResponse)
def run_what_if(request: WhatIfRequest):
    """Run a scenario simulation on an existing charter analysis."""
    service = SimulationService()
    return service.run_what_if(request)
