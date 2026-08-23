from pydantic import BaseModel
from typing import List, Dict
from datetime import datetime

class RiskAnalysisRequest(BaseModel):
    origin: str
    destination: str
    vessel_type: str
    loading_date: str

class RiskDriver(BaseModel):
    category: str
    description: str
    impact: str # HIGH, MEDIUM, LOW

class RiskAnalysisResponse(BaseModel):
    analysis_id: str
    overall_score: int # 0-100, 100 being highest risk
    risk_level: str # LOW, MODERATE, HIGH, CRITICAL
    drivers: List[RiskDriver]
    mitigation_actions: List[str]
    generated_at: datetime
