import uuid
import time
from datetime import datetime
from typing import Dict, Any
from app.schemas.jobs import JobResponse

# In a real app, this would be a Redis/Celery queue.
# For MVP, we use an in-memory mock store.
_job_store: Dict[str, JobResponse] = {}

def submit_job(job_type: str, payload: Dict[str, Any]) -> str:
    job_id = str(uuid.uuid4())
    _job_store[job_id] = JobResponse(
        job_id=job_id,
        job_type=job_type,
        status="QUEUED",
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )
    return job_id

def get_job_status(job_id: str) -> JobResponse:
    return _job_store.get(job_id)

def process_job_background(job_id: str):
    """
    This function simulates a long-running background task.
    It is called via FastAPI BackgroundTasks.
    """
    job = _job_store.get(job_id)
    if not job:
        return
        
    job.status = "RUNNING"
    job.updated_at = datetime.utcnow()
    
    # Simulate work
    time.sleep(5)
    
    # Complete job
    job.status = "SUCCESS"
    job.result = {"message": f"Successfully completed {job.job_type}"}
    job.updated_at = datetime.utcnow()
