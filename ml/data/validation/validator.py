import pandas as pd
from typing import List, Dict, Any
from pydantic import ValidationError
from ml.data.schemas import FreightMarketData, PortData

def validate_freight_data(data: List[Dict[str, Any]]) -> pd.DataFrame:
    validated_records = []
    errors = []
    
    for i, record in enumerate(data):
        try:
            # Parse and validate using Pydantic
            valid_record = FreightMarketData(**record)
            validated_records.append(valid_record.model_dump())
        except ValidationError as e:
            errors.append({"row": i, "errors": e.errors()})
            
    if errors:
        print(f"Validation found {len(errors)} errors out of {len(data)} records.")
        # In a real system, you might log these or drop them. For now we just print.
        
    return pd.DataFrame(validated_records)

def validate_port_data(data: List[Dict[str, Any]]) -> pd.DataFrame:
    validated_records = []
    errors = []
    
    for i, record in enumerate(data):
        try:
            valid_record = PortData(**record)
            validated_records.append(valid_record.model_dump())
        except ValidationError as e:
            errors.append({"row": i, "errors": e.errors()})
            
    if errors:
        print(f"Validation found {len(errors)} errors in Port Data.")
        
    return pd.DataFrame(validated_records)

if __name__ == "__main__":
    print("Running data validation...")
    try:
        freight_df = pd.read_csv("freight_data_synthetic.csv")
        # Convert date to string for pydantic parsing
        freight_records = freight_df.to_dict(orient="records")
        validated_freight = validate_freight_data(freight_records)
        print(f"Validated {len(validated_freight)} freight records successfully.")
        
        port_df = pd.read_csv("port_data_synthetic.csv")
        port_records = port_df.to_dict(orient="records")
        validated_ports = validate_port_data(port_records)
        print(f"Validated {len(validated_ports)} port records successfully.")
    except FileNotFoundError:
        print("Data files not found. Run generator.py first.")
