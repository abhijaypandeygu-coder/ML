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
        
        for i in range(60, 0, -1):
            d = today - timedelta(days=i)
            noise = math.sin(i * 0.25) * 1.8 + (math.sin(i * 0.08) * 2.2)
            historical_rate = round(base_rate - (i * 0.03) + noise, 2)
            
            event = None
            if i == 42: event = 'Red Sea Route Advisory'
            if i == 18: event = 'Australian Port Weather Disruption'
            
            forecast_points.append(ForecastDataPoint(
                date=d.strftime("%Y-%m-%d"),
                timestamp=int(d.timestamp() * 1000),
                actual_rate_usd=historical_rate,
                is_forecast=False,
                event_signal=event
            ))
            
        last_actual = forecast_points[-1].actual_rate_usd
        
        for i in range(request.forecast_horizon + 1):
            d = today + timedelta(days=i)
            trend_val = i * 0.05
            cycle = math.sin(i * 0.15) * 1.5
            predicted = round(last_actual + trend_val + cycle, 2)
            
            spread = (i * 0.08) + 0.5
            
            forecast_points.append(ForecastDataPoint(
                date=d.strftime("%Y-%m-%d"),
                timestamp=int(d.timestamp() * 1000),
                predicted_rate_usd=predicted,
                lower_bound_usd=round(predicted - spread, 2),
                upper_bound_usd=round(predicted + spread, 2),
                is_forecast=True
            ))
            
        # Only return the forecasted points (not the full history), limited
        # to the requested horizon. Tests and API consumers expect `forecast`
        # to contain only predicted entries.
        predicted_only = [p for p in forecast_points if p.is_forecast][: request.forecast_horizon]

        return ForecastResponse(
            forecast_id=str(uuid.uuid4()),
            current_rate=round(base_rate + random.uniform(-0.5, 0.5), 2),
            forecast=predicted_only,
            model_name="baseline_prophet_v1",
            model_version="1.0.0",
            generated_at=datetime.utcnow()
        )
