import pandas as pd
import numpy as np
import xgboost as xgb
import json
from datetime import timedelta

class ProbabilisticForecaster:
    """Uses Quantile Regression to generate confidence intervals."""
    def __init__(self, quantiles=[0.1, 0.5, 0.9], **kwargs):
        self.quantiles = quantiles
        self.models = {}
        for q in self.quantiles:
            self.models[q] = xgb.XGBRegressor(
                objective='reg:quantileerror',
                quantile_alpha=q,
                n_estimators=100,
                learning_rate=0.1,
                max_depth=5,
                **kwargs
            )
        self.features = None
        
    def fit(self, X: pd.DataFrame, y: pd.Series):
        self.features = X.columns.tolist()
        for q, model in self.models.items():
            model.fit(X, y)
        return self
        
    def predict(self, X: pd.DataFrame) -> pd.DataFrame:
        if self.features is None:
            raise ValueError("Model must be fitted before prediction")
            
        results = {}
        for q, model in self.models.items():
            results[f'q_{q}'] = model.predict(X[self.features])
            
        return pd.DataFrame(results, index=X.index)
        
    def format_output(self, date_series, predictions_df):
        """Format to the requested JSON structure."""
        outputs = []
        for i, (idx, row) in enumerate(predictions_df.iterrows()):
            out = {
                "date": date_series.iloc[i].strftime("%Y-%m-%d"),
                "forecast": float(row['q_0.5']),
                "lower_bound": float(row['q_0.1']),
                "upper_bound": float(row['q_0.9'])
            }
            outputs.append(out)
        return outputs

if __name__ == "__main__":
    print("Training Probabilistic Forecaster...")
    try:
        df = pd.read_csv("freight_data_featured.csv")
        df = df.dropna().copy()
        
        df['date'] = pd.to_datetime(df['date'])
        df = df.sort_values('date')
        
        exclude_cols = ['date', 'origin', 'destination', 'vessel_type', 'freight_rate', 'currency', 'unit']
        feature_cols = [c for c in df.columns if c not in exclude_cols]
        
        split_idx = int(len(df) * 0.8)
        train_df = df.iloc[:split_idx]
        test_df = df.iloc[split_idx:]
        
        X_train = train_df[feature_cols]
        y_train = train_df['freight_rate']
        
        X_test = test_df[feature_cols]
        y_test = test_df['freight_rate']
        
        model = ProbabilisticForecaster()
        model.fit(X_train, y_train)
        
        # Test on a small 7-day horizon slice for output demo
        sample_x = X_test.iloc[:7]
        sample_dates = test_df['date'].iloc[:7]
        
        preds_df = model.predict(sample_x)
        json_out = model.format_output(sample_dates, preds_df)
        
        print("\nSample Probabilistic Forecast Output:")
        print(json.dumps(json_out, indent=2))
        
        # Calculate coverage (percentage of actuals falling within the interval)
        all_preds = model.predict(X_test)
        coverage = ((y_test >= all_preds['q_0.1']) & (y_test <= all_preds['q_0.9'])).mean()
        print(f"\nPrediction Interval (80%) Coverage on Test Set: {coverage * 100:.2f}%")
        
    except FileNotFoundError:
        print("Data files not found.")
