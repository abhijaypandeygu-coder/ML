import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import random

# Generate realistic random dates
def generate_dates(start_date: str, days: int):
    base = datetime.strptime(start_date, "%Y-%m-%d")
    return [base + timedelta(days=x) for x in range(days)]

def generate_synthetic_freight_data(start_date="2021-01-01", days=1000, num_routes=5):
    dates = generate_dates(start_date, days)
    routes = [
        ("Australia", "Paradip"),
        ("Indonesia", "Paradip"),
        ("US", "Paradip"),
        ("Mozambique", "Paradip"),
        ("Russia", "Paradip")
    ]
    vessel_types = ["Panamax", "Capesize", "Supramax"]
    
    data = []
    for date in dates:
        for _ in range(num_routes):
            route = random.choice(routes)
            vessel = random.choice(vessel_types)
            # Add some seasonality and trend
            day_of_year = date.timetuple().tm_yday
            seasonality = 10 * np.sin(2 * np.pi * day_of_year / 365)
            trend = (date.year - 2021) * 5
            base_rate = 30 if vessel == "Capesize" else (40 if vessel == "Panamax" else 50)
            noise = np.random.normal(0, 3)
            
            freight_rate = max(10, base_rate + seasonality + trend + noise)
            
            data.append({
                "date": date.strftime("%Y-%m-%d"),
                "origin": route[0],
                "destination": route[1],
                "vessel_type": vessel,
                "freight_rate": round(freight_rate, 2),
                "currency": "USD",
                "unit": "MT",
                "route_distance": random.uniform(3000, 10000),
                "bunker_price": round(random.uniform(400, 800), 2),
                "tonnage": round(random.uniform(50000, 150000), 2)
            })
    
    return pd.DataFrame(data)

def generate_synthetic_port_data():
    ports = [
        {"port_id": "P01", "port_name": "Paradip", "max_loa": 300.0, "max_beam": 50.0, "max_draft": 18.0, "cargo_handling_rate": 50000, "berth_capacity": 5, "turnaround_time": 2.5, "congestion_index": 0.4},
        {"port_id": "P02", "port_name": "Visakhapatnam", "max_loa": 280.0, "max_beam": 45.0, "max_draft": 16.0, "cargo_handling_rate": 45000, "berth_capacity": 4, "turnaround_time": 3.0, "congestion_index": 0.5},
        # Add a few more as needed
    ]
    return pd.DataFrame(ports)

if __name__ == "__main__":
    print("Generating synthetic freight data...")
    freight_df = generate_synthetic_freight_data()
    freight_df.to_csv("freight_data_synthetic.csv", index=False)
    print(f"Generated {len(freight_df)} freight records.")
    
    print("Generating synthetic port data...")
    port_df = generate_synthetic_port_data()
    port_df.to_csv("port_data_synthetic.csv", index=False)
    print(f"Generated {len(port_df)} port records.")
    
    print("Data generation complete.")
