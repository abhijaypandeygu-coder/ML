import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import random

class SyntheticDataGenerator:
    """
    Generates robust, seedable synthetic data for FreightQuant domains.
    Records are strictly tagged with source_type='SYNTHETIC'.
    """
    def __init__(self, seed: int = 42):
        self.seed = seed
        np.random.seed(self.seed)
        random.seed(self.seed)

    def _generate_dates(self, start_date: str, days: int):
        base = datetime.strptime(start_date, "%Y-%m-%d")
        return [base + timedelta(days=x) for x in range(days)]

    def generate_market_regimes(self, days: int):
        """Creates realistic regime shifts (RISING, FALLING, STABLE, HIGH_VOLATILITY)"""
        regimes = []
        current_regime = "STABLE"
        transitions = {
            "STABLE": ["RISING", "FALLING", "HIGH_VOLATILITY", "STABLE"],
            "RISING": ["STABLE", "HIGH_VOLATILITY", "RISING"],
            "FALLING": ["STABLE", "HIGH_VOLATILITY", "FALLING"],
            "HIGH_VOLATILITY": ["STABLE", "RISING", "FALLING", "HIGH_VOLATILITY"]
        }
        
        days_in_regime = 0
        for _ in range(days):
            if days_in_regime > np.random.randint(20, 60):
                current_regime = np.random.choice(transitions[current_regime])
                days_in_regime = 0
            regimes.append(current_regime)
            days_in_regime += 1
            
        return regimes

    def generate_freight_data(self, start_date="2022-01-01", days=730):
        dates = self._generate_dates(start_date, days)
        regimes = self.generate_market_regimes(days)
        
        routes = [
            ("AUS_01", "IN_PARA", 4500),
            ("US_01", "IN_PARA", 11000),
            ("IDN_01", "IN_PARA", 2800),
        ]
        vessel_types = ["HANDYSIZE", "SUPRAMAX", "PANAMAX", "CAPESIZE"]
        
        data = []
        for i, date in enumerate(dates):
            regime = regimes[i]
            
            # Regime effects
            drift = 0
            vol = 1
            if regime == "RISING":
                drift = 0.5
                vol = 1.5
            elif regime == "FALLING":
                drift = -0.5
                vol = 1.5
            elif regime == "HIGH_VOLATILITY":
                drift = 0
                vol = 4.0
            
            for origin, dest, distance in routes:
                for vessel in vessel_types:
                    base_rate = 15 if vessel == "CAPESIZE" else (20 if vessel == "PANAMAX" else 30)
                    seasonality = 5 * np.sin(2 * np.pi * date.timetuple().tm_yday / 365)
                    noise = np.random.normal(drift, vol)
                    
                    rate = max(5.0, base_rate + seasonality + noise)
                    
                    data.append({
                        "timestamp": date.isoformat(),
                        "route_id": f"{origin}_{dest}",
                        "origin_port_id": origin,
                        "destination_port_id": dest,
                        "vessel_type": vessel,
                        "freight_rate": round(rate, 2),
                        "currency": "USD",
                        "unit": "MT",
                        "source": "synthetic_generator_v1",
                        "source_type": "SYNTHETIC",
                        "data_quality": "VALID",
                        "market_regime": regime
                    })
                    
        return pd.DataFrame(data)

    def generate_port_data(self):
        """Generates static canonical port constraints."""
        ports = [
            {"port_id": "IN_PARA", "port_name": "Paradip", "country": "India", "region": "East Coast", "latitude": 20.26, "longitude": 86.67, "max_loa_m": 300.0, "max_beam_m": 50.0, "max_draft_m": 16.5, "cargo_handling_rate_mt_day": 50000, "source_type": "SYNTHETIC", "data_quality": "VALID"},
            {"port_id": "AUS_01", "port_name": "Hay Point", "country": "Australia", "region": "Queensland", "latitude": -21.27, "longitude": 149.30, "max_loa_m": 350.0, "max_beam_m": 60.0, "max_draft_m": 19.5, "cargo_handling_rate_mt_day": 80000, "source_type": "SYNTHETIC", "data_quality": "VALID"},
            {"port_id": "US_01", "port_name": "Norfolk", "country": "United States", "region": "East Coast", "latitude": 36.85, "longitude": -76.28, "max_loa_m": 320.0, "max_beam_m": 55.0, "max_draft_m": 15.0, "cargo_handling_rate_mt_day": 65000, "source_type": "SYNTHETIC", "data_quality": "VALID"},
            {"port_id": "IDN_01", "port_name": "Samarinda", "country": "Indonesia", "region": "Kalimantan", "latitude": -0.50, "longitude": 117.15, "max_loa_m": 250.0, "max_beam_m": 45.0, "max_draft_m": 13.0, "cargo_handling_rate_mt_day": 35000, "source_type": "SYNTHETIC", "data_quality": "VALID"}
        ]
        return pd.DataFrame(ports)
        
    def generate_vessel_data(self):
        """Generates standard vessel class configurations."""
        vessels = [
            {"vessel_id": "HANDYSIZE", "vessel_name": "Generic Handysize", "vessel_type": "HANDYSIZE", "capacity_mt": 35000, "loa_m": 180.0, "beam_m": 30.0, "draft_m": 10.5, "speed_knots": 14.0, "fuel_consumption_mt_day": 22.0, "source_type": "SYNTHETIC", "data_quality": "VALID"},
            {"vessel_id": "SUPRAMAX", "vessel_name": "Generic Supramax", "vessel_type": "SUPRAMAX", "capacity_mt": 55000, "loa_m": 195.0, "beam_m": 32.0, "draft_m": 12.0, "speed_knots": 14.5, "fuel_consumption_mt_day": 28.0, "source_type": "SYNTHETIC", "data_quality": "VALID"},
            {"vessel_id": "PANAMAX", "vessel_name": "Generic Panamax", "vessel_type": "PANAMAX", "capacity_mt": 82000, "loa_m": 229.0, "beam_m": 32.2, "draft_m": 14.4, "speed_knots": 14.5, "fuel_consumption_mt_day": 32.0, "source_type": "SYNTHETIC", "data_quality": "VALID"},
            {"vessel_id": "CAPESIZE", "vessel_name": "Generic Capesize", "vessel_type": "CAPESIZE", "capacity_mt": 180000, "loa_m": 290.0, "beam_m": 45.0, "draft_m": 18.2, "speed_knots": 15.0, "fuel_consumption_mt_day": 52.0, "source_type": "SYNTHETIC", "data_quality": "VALID"}
        ]
        return pd.DataFrame(vessels)

if __name__ == "__main__":
    gen = SyntheticDataGenerator(seed=123)
    df = gen.generate_freight_data()
    print(f"Generated {len(df)} synthetic freight records.")
    print(df.head())
