def test_health_check(client):
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}

def test_forecast_endpoint(client):
    response = client.post("/api/v1/forecast/", json={
        "origin": "AU_PORT",
        "destination": "IN_PARA",
        "vessel_type": "Capesize",
        "forecast_horizon": 5
    })
    assert response.status_code == 200
    data = response.json()
    assert "forecast_id" in data
    assert len(data["forecast"]) == 5

def test_charter_analyze(client):
    response = client.post("/api/v1/charter/analyze", json={
        "shipment": {
            "commodity": "Coal",
            "cargo_quantity_mt": 150000,
            "origin_port": "AU_PORT",
            "destination_port": "IN_PARA",
            "loading_date": "2026-10-01T00:00:00Z",
            "delivery_deadline": "2026-10-31T00:00:00Z",
            "number_of_voyages": 1,
            "contract_horizon": 1,
            "risk_tolerance": "BALANCED"
        }
    })
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "SUCCESS"
    assert "recommendation" in data
    assert data["recommendation"]["expected_total_cost"] > 0
