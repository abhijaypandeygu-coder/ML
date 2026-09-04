import pandas as pd
import numpy as np
import xgboost as xgb
from ml.forecasting.evaluation import evaluate_forecast

class XGBoostForecaster:
    def __init__(self, **kwargs):
        n_est = kwargs.pop('n_estimators', 100)
        lr = kwargs.pop('learning_rate', 0.1)
        md = kwargs.pop('max_depth', 5)
        
        self.model = xgb.XGBRegressor(
            objective='reg:squarederror',
            n_estimators=n_est,
            learning_rate=lr,
            max_depth=md,
            **kwargs
        )
        self.features = None
        
    def fit(self, X: pd.DataFrame, y: pd.Series):
        self.features = X.columns.tolist()
        self.model.fit(X, y)
        return self
        
    def predict(self, X: pd.DataFrame) -> np.ndarray:
        if self.features is None:
            raise ValueError("Model must be fitted before prediction")
        return self.model.predict(X[self.features])

if __name__ == "__main__":
    print("Training XGBoost Forecaster...")
    try:
        df = pd.read_csv("freight_data_featured.csv")
        
        # Drop rows with NaNs caused by lagging
        df = df.dropna().copy()
        
        # Sort chronologically
        df['date'] = pd.to_datetime(df['date'])
        df = df.sort_values('date')
        
        # Features to use
        exclude_cols = ['date', 'origin', 'destination', 'vessel_type', 'freight_rate', 'currency', 'unit']
        feature_cols = [c for c in df.columns if c not in exclude_cols]
        
        # Chronological split (80% train, 20% test)
        split_idx = int(len(df) * 0.8)
        train_df = df.iloc[:split_idx]
        test_df = df.iloc[split_idx:]
        
        X_train = train_df[feature_cols]
        y_train = train_df['freight_rate']
        
        X_test = test_df[feature_cols]
        y_test = test_df['freight_rate']
        
        model = XGBoostForecaster()
        model.fit(X_train, y_train)
        
        preds = model.predict(X_test)
        
        metrics = evaluate_forecast(y_test, preds, "XGBoost")
        
        results_df = pd.DataFrame([metrics])
        print(results_df.to_string(index=False))
        
    except FileNotFoundError:
        print("Data files not found.")
