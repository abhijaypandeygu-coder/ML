from fastapi import APIRouter, BackgroundTasks, HTTPException
from app.schemas.jobs import JobRequest, JobResponse
from app.jobs.worker import submit_job, get_job_status, process_job_background

router = APIRouter(
    prefix="/api/v1/jobs",
    tags=["jobs"],
)

@router.post("/", response_model=JobResponse)
def create_job(request: JobRequest, background_tasks: BackgroundTasks):
    """Submit a long-running job for async processing."""
    job_id = submit_job(request.job_type, request.payload)
    background_tasks.add_task(process_job_background, job_id)
    return get_job_status(job_id)

@router.get("/{job_id}", response_model=JobResponse)
def get_job(job_id: str):
    """Poll the status of a background job."""
    job = get_job_status(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job
