import os
import sys

# Ensure ml module is in path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../..')))

from ml.data.synthetic.generator import SyntheticDataGenerator
from duckdb_manager import DuckDBManager

def ingest_synthetic_alternative():
    print("Generating alternative synthetic dataset (BTS FAF substitute)...")
    
    # Initialize generator
    gen = SyntheticDataGenerator(seed=123)
    
    # Generate datasets
    freight_df = gen.generate_freight_data(start_date="2020-01-01", days=1460) # 4 years of daily data
    port_df = gen.generate_port_data()
    vessel_df = gen.generate_vessel_data()
    
    # Save temporarily to CSV
    os.makedirs('data_cache', exist_ok=True)
    freight_csv = 'data_cache/synthetic_freight.csv'
    port_csv = 'data_cache/synthetic_ports.csv'
    vessel_csv = 'data_cache/synthetic_vessels.csv'
    
    freight_df.to_csv(freight_csv, index=False)
    port_df.to_csv(port_csv, index=False)
    vessel_df.to_csv(vessel_csv, index=False)
    
    print("Datasets generated and saved to CSV. Ingesting to DuckDB and Parquet...")
    
    # Ingest using DuckDB Manager
    db = DuckDBManager()
    db.initialize_tables()
    
    db.ingest_csv_to_parquet_and_db('freight_historical', freight_csv)
    db.ingest_csv_to_parquet_and_db('ports_master', port_csv)
    db.ingest_csv_to_parquet_and_db('vessels_master', vessel_csv)
    
    print("Ingestion complete. The system is now populated with synthetic data marked strictly as source_type='SYNTHETIC'.")
    db.close()

if __name__ == "__main__":
    ingest_synthetic_alternative()
