import pandas as pd
import numpy as np

def generate_time_features(df: pd.DataFrame, target_col: str = 'freight_rate', group_cols: list = None) -> pd.DataFrame:
    """Generate time-series features avoiding data leakage."""
    df = df.copy()
    
    if group_cols is None:
        group_cols = ['origin', 'destination', 'vessel_type']
        
    df['date'] = pd.to_datetime(df['date'])
    df = df.sort_values(by=['date'] + group_cols)
    
    # 1. Lag Features
    lags = [1, 3, 7, 14, 30]
    for lag in lags:
        df[f'lag_{lag}'] = df.groupby(group_cols)[target_col].shift(lag)
        
    # 2. Rolling Features (using only past data, hence shift(1) to avoid leakage)
    rolling_windows = [7, 14, 30]
    for w in rolling_windows:
        # Shift(1) ensures the rolling window ends at t-1 for predicting t
        rolling = df.groupby(group_cols)[target_col].shift(1).rolling(window=w, min_periods=1)
        df[f'rolling_mean_{w}'] = rolling.mean()
        df[f'rolling_std_{w}'] = rolling.std().fillna(0)
        
    # 3. Momentum
    df['return_1d'] = df.groupby(group_cols)[target_col].pct_change(1)
    df['return_7d'] = df.groupby(group_cols)[target_col].pct_change(7)
    df['return_14d'] = df.groupby(group_cols)[target_col].pct_change(14)
    df['rate_change_pct'] = df['return_1d'] # alias
    
    # 4. Volatility
    # Realized Volatility: standard deviation of daily returns over past 30 days
    df['realized_volatility'] = df.groupby(group_cols)['return_1d'].shift(1).rolling(30, min_periods=1).std()
    
    # EWMA Volatility
    df['ewma_volatility'] = df.groupby(group_cols)['return_1d'].shift(1).ewm(span=30, min_periods=1).std()
    
    # Drop rows with NaNs caused by lagging (optional, can also impute)
    # df = df.dropna()
    
    return df

if __name__ == "__main__":
    try:
        freight_df = pd.read_csv("freight_data_clean.csv")
        featured_df = generate_time_features(freight_df)
        featured_df.to_csv("freight_data_featured.csv", index=False)
        print(f"Generated features. Shape: {featured_df.shape}")
        print("Columns:", featured_df.columns.tolist())
    except FileNotFoundError:
        print("Data files not found.")
