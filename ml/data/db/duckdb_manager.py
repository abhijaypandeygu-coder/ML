import duckdb
import os
import pandas as pd
from typing import Optional, List

class DuckDBManager:
    """
    Manages the local analytical data stack using DuckDB and Parquet.
    This replaces SQLite/Postgres for the heavy analytical workloads.
    """
    def __init__(self, db_path: str = 'freight_analytical.duckdb', parquet_dir: str = 'data_cache'):
        self.db_path = db_path
        self.parquet_dir = parquet_dir
        
        # Ensure parquet directory exists
        os.makedirs(self.parquet_dir, exist_ok=True)
        
        # Connect to DuckDB
        self.conn = duckdb.connect(database=self.db_path)
        
    def initialize_tables(self):
        """Creates the necessary schema."""
        self.conn.execute("""
            CREATE TABLE IF NOT EXISTS sources (
                source_id VARCHAR PRIMARY KEY,
                source_name VARCHAR,
                source_url_or_reference VARCHAR,
                retrieval_timestamp TIMESTAMP,
                license_status VARCHAR
            );
            
            CREATE TABLE IF NOT EXISTS freight_observations (
                observation_id VARCHAR PRIMARY KEY,
                route VARCHAR,
                vessel_class VARCHAR,
                observation_time TIMESTAMP,
                freight_rate_usd_mt DOUBLE,
                source_id VARCHAR,
                proxy_flag BOOLEAN,
                data_quality_score DOUBLE
            );
            
            CREATE TABLE IF NOT EXISTS faf_data (
                -- Bureau of Transportation Statistics FAF Schema Placeholder
                faf_id VARCHAR PRIMARY KEY,
                dms_orig VARCHAR,
                dms_dest VARCHAR,
                commodity_type VARCHAR,
                tons DOUBLE,
                value_usd DOUBLE,
                year INT
            );
        """)
        
    def ingest_csv_to_parquet_and_db(self, table_name: str, csv_path: str):
        """
        Ingests a raw CSV file, saves it as an optimized Parquet file,
        and creates a DuckDB view/table mapping to it.
        """
        if not os.path.exists(csv_path):
            raise FileNotFoundError(f"CSV file not found: {csv_path}")
            
        parquet_path = os.path.join(self.parquet_dir, f"{table_name}.parquet")
        
        # Load via Pandas or DuckDB directly
        # Using DuckDB's fast CSV reader and Parquet writer
        self.conn.execute(f"""
            COPY (SELECT * FROM read_csv_auto('{csv_path}')) 
            TO '{parquet_path}' (FORMAT PARQUET);
        """)
        
        # Create a table mapping to the parquet file
        self.conn.execute(f"DROP TABLE IF EXISTS {table_name}")
        self.conn.execute(f"""
            CREATE TABLE {table_name} AS 
            SELECT * FROM read_parquet('{parquet_path}')
        """)
        print(f"Successfully ingested {csv_path} into {table_name} (Parquet + DuckDB)")

    def query_to_df(self, query: str) -> pd.DataFrame:
        """Executes a query and returns a Pandas DataFrame."""
        return self.conn.execute(query).df()

    def get_route_history(self, route: str, vessel_class: str) -> pd.DataFrame:
        """Fetches historical freight data for a specific route and vessel class."""
        query = f"""
            SELECT observation_time, freight_rate_usd_mt
            FROM freight_observations
            WHERE route = '{route}' AND vessel_class = '{vessel_class}'
            ORDER BY observation_time ASC
        """
        return self.query_to_df(query)

    def close(self):
        self.conn.close()

if __name__ == "__main__":
    db = DuckDBManager()
    db.initialize_tables()
    print("DuckDB schema initialized.")
    # Example ingestion if files exist:
    # if os.path.exists('freight_data_clean.csv'):
    #     db.ingest_csv_to_parquet_and_db('freight_historical', 'freight_data_clean.csv')
