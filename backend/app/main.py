from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.routes import data, shipments, forecast, risk, optimization, charter, simulation, jobs, auth

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Set all CORS enabled origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(data.router, prefix=settings.API_V1_STR)
app.include_router(shipments.router)
app.include_router(forecast.router)
app.include_router(risk.router)
app.include_router(optimization.router)
app.include_router(charter.router)
app.include_router(simulation.router)
app.include_router(jobs.router)
app.include_router(auth.router)

@app.get("/health")
def health_check():
    return {"status": "ok"}
