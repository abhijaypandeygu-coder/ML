from fastapi.testclient import TestClient
from app.main import app
import json

client = TestClient(app)

resp = client.post("/api/v1/forecast/", json={
    "origin": "AU_PORT",
    "destination": "IN_PARA",
    "vessel_type": "Capesize",
    "forecast_horizon": 5
})

print("status:", resp.status_code)
try:
    data = resp.json()
    print("forecast length:", len(data.get("forecast", [])))
    print(json.dumps(data, indent=2, ensure_ascii=False))
except Exception as e:
    print("failed to decode json:", e)
