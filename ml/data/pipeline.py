import pandas as pd
import os
import sys

# Ensure ml module is in path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))

from ml.data.validation.validator import ValidationEngine
from ml.data.synthetic.generator import SyntheticDataGenerator
from ml.data.db.session import SessionLocal
from ml.data.db.models import FreightRate, Port, Vessel
from datetime import datetime

class DataPipeline:
    def __init__(self):
        self.validator = ValidationEngine()
        self.generator = SyntheticDataGenerator(seed=42)
        
        self.base_dir = os.path.dirname(__file__)
        self.storage_dir = os.path.join(self.base_dir, 'storage')
        for layer in ['raw', 'clean', 'curated']:
            os.makedirs(os.path.join(self.storage_dir, layer), exist_ok=True)
            
    def run_all(self):
        print("1. Generating Synthetic Data...")
        freight_df = self.generator.generate_freight_data(days=365)
        port_df = self.generator.generate_port_data()
        vessel_df = self.generator.generate_vessel_data()
        
        print("2. Validating & Cleaning...")
        clean_freight = self.validator.validate_freight_data(freight_df)
        clean_port = self.validator.validate_port_data(port_df)
        
        # Impute missing
        if 'freight_rate' in clean_freight.columns:
            clean_freight['freight_rate'] = clean_freight['freight_rate'].interpolate(method='linear')
            
        print("3. Curating...")
        curated_freight = clean_freight[clean_freight['data_quality'] == 'VALID'].copy()
        curated_port = clean_port[clean_port['data_quality'] == 'VALID'].copy()
        curated_vessel = vessel_df[vessel_df['data_quality'] == 'VALID'].copy()
        
        print("4. Persisting to Database...")
        self._persist_to_db(curated_freight, curated_port, curated_vessel)
        print("Pipeline Complete.")
        
    def _persist_to_db(self, freight_df, port_df, vessel_df):
        db = SessionLocal()
        try:
            # Insert Ports
            for _, row in port_df.iterrows():
                port = db.query(Port).filter(Port.port_id == row['port_id']).first()
                if not port:
                    port = Port(**row.to_dict())
                    db.add(port)
                    
            # Insert Vessels
            for _, row in vessel_df.iterrows():
                vsl = db.query(Vessel).filter(Vessel.vessel_id == row['vessel_id']).first()
                if not vsl:
                    vsl = Vessel(**row.to_dict())
                    db.add(vsl)
                    
            # Bulk Insert Freight Rates
            if not freight_df.empty:
                # To prevent duplicates in a simple way for demo, just delete old synthetic data
                db.query(FreightRate).filter(FreightRate.source_type == 'SYNTHETIC').delete()
                
                # Convert timestamp string to datetime
                records = freight_df.to_dict(orient='records')
                for r in records:
                    r['timestamp'] = datetime.fromisoformat(r['timestamp'])
                
                db.bulk_insert_mappings(FreightRate, records)
                
            db.commit()
            print(f"Persisted {len(port_df)} Ports, {len(vessel_df)} Vessels, and {len(freight_df)} Freight records.")
        except Exception as e:
            db.rollback()
            print(f"Database insertion failed: {e}")
        finally:
            db.close()

if __name__ == "__main__":
    pipeline = DataPipeline()
    pipeline.run_all()
