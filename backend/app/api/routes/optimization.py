from fastapi import APIRouter
from app.schemas.optimization import (
    VesselOptimizationRequest, VesselOptimizationResponse,
    ContractOptimizationRequest, ContractOptimizationResponse
)
from app.services.optimization import OptimizationService

router = APIRouter(
    prefix="/api/v1/optimization",
    tags=["optimization"],
)

@router.post("/vessels", response_model=VesselOptimizationResponse)
def optimize_vessels(request: VesselOptimizationRequest):
    """Find the optimal vessel types and voyage counts for a given cargo and port constraints."""
    service = OptimizationService()
    return service.optimize_vessels(request)

@router.post("/contracts", response_model=ContractOptimizationResponse)
def optimize_contracts(request: ContractOptimizationRequest):
    """Evaluate and recommend the optimal chartering contract strategy."""
    service = OptimizationService()
    return service.optimize_contracts(request)
