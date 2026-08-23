import uuid
from datetime import datetime, timedelta
import math
import random
from app.schemas.forecast import ForecastRequest, ForecastResponse, ForecastDataPoint

class ForecastService:
    def __init__(self):
        # Initialize ML model bindings here in production
        pass
        
    def generate_forecast(self, request: ForecastRequest) -> ForecastResponse:
        """
        Generates a freight rate forecast.
        Currently uses a dynamic mock generator for the baseline architecture until ML models are loaded.
        """
        base_rate = 25.0
        if request.vessel_type.lower() == 'capesize':
            base_rate = 30.0
        elif request.vessel_type.lower() == 'supramax':
            base_rate = 20.0
            
        forecast_points = []
        today = datetime.utcnow()
        
        for i in range(request.forecast_horizon):
            target_date = today + timedelta(days=i)
            # Add some sine wave + random noise to simulate market dynamics
            noise = random.uniform(-1, 1)
            seasonal = math.sin(i / 5.0) * 2.0
            trend = i * 0.05
            
            predicted = base_rate + seasonal + trend + noise
            
            forecast_points.append(
                ForecastDataPoint(
                    date=target_date.strftime("%Y-%m-%d"),
                    predicted_rate=round(predicted, 2),
                    lower_bound=round(predicted * 0.9, 2),
                    upper_bound=round(predicted * 1.1, 2)
                )
            )
            
        return ForecastResponse(
            forecast_id=str(uuid.uuid4()),
            current_rate=round(base_rate + random.uniform(-0.5, 0.5), 2),
            forecast=forecast_points,
            model_name="baseline_prophet_v1",
            model_version="1.0.0",
            generated_at=datetime.utcnow()
        )
