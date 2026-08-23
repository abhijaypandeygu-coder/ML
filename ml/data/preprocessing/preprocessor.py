import pandas as pd
import numpy as np

def remove_duplicates(df: pd.DataFrame) -> pd.DataFrame:
    before = len(df)
    df = df.drop_duplicates()
    after = len(df)
    print(f"Removed {before - after} duplicate rows.")
    return df

def treat_missing_values(df: pd.DataFrame) -> pd.DataFrame:
    # Forward fill missing dates or numerical values for time-series appropriateness
    df = df.ffill().bfill()
    return df

def detect_outliers(df: pd.DataFrame, column: str, threshold: float = 3.0) -> pd.DataFrame:
    """Identify and cap outliers using Z-score method."""
    if column not in df.columns:
        return df
        
    mean = df[column].mean()
    std = df[column].std()
    
    # Cap outliers
    lower_bound = mean - threshold * std
    upper_bound = mean + threshold * std
    
    outliers_count = ((df[column] < lower_bound) | (df[column] > upper_bound)).sum()
    if outliers_count > 0:
        print(f"Capped {outliers_count} outliers in {column}.")
        df[column] = np.clip(df[column], lower_bound, upper_bound)
        
    return df

def preprocess_freight_data(df: pd.DataFrame) -> pd.DataFrame:
    print("Preprocessing freight data...")
    df = remove_duplicates(df)
    
    # Ensure date is datetime
    df['date'] = pd.to_datetime(df['date'])
    
    # Sort chronologically - NEVER randomly shuffle time-series
    df = df.sort_values(by=['date', 'origin', 'destination', 'vessel_type'])
    
    # Missing values
    df = treat_missing_values(df)
    
    # Outlier detection on freight_rate
    df = detect_outliers(df, 'freight_rate')
    
    print(f"Preprocessing complete. Shape: {df.shape}")
    return df

if __name__ == "__main__":
    try:
        freight_df = pd.read_csv("freight_data_synthetic.csv")
        clean_freight = preprocess_freight_data(freight_df)
        clean_freight.to_csv("freight_data_clean.csv", index=False)
        print("Saved cleaned data to freight_data_clean.csv")
    except FileNotFoundError:
        print("Data files not found.")
