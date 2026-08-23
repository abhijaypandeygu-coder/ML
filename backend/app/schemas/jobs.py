from pydantic import BaseModel
from typing import Dict, Any, Optional
from datetime import datetime

class JobRequest(BaseModel):
    job_type: str # e.g. "MONTE_CARLO", "DATA_INGESTION", "RE-TRAIN"
    payload: Dict[str, Any]

class JobResponse(BaseModel):
    job_id: str
    job_type: str
    status: str # QUEUED, RUNNING, SUCCESS, FAILED
    result: Optional[Dict[str, Any]] = None
    created_at: datetime
    updated_at: datetime
