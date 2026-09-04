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
        
        n_est = kwargs.pop('n_estimators', 100)
        lr = kwargs.pop('learning_rate', 0.1)
        md = kwargs.pop('max_depth', 5)
        
        for q in self.quantiles:
            self.models[q] = xgb.XGBRegressor(
                objective='reg:quantileerror',
                quantile_alpha=q,
                n_estimators=n_est,
                learning_rate=lr,
                max_depth=md,
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
    print("Training Probabilistic Forecaster from DuckDB...")
    try:
        import os, sys
        sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))
        from ml.data.db.duckdb_manager import DuckDBManager
        
        db_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../data/db/freight_analytical.duckdb'))
        db = DuckDBManager(db_path=db_path)
        
        df = db.query_to_df("""
            SELECT timestamp, freight_rate 
            FROM freight_historical 
            WHERE route_id = 'AUS_01_IN_PARA' AND vessel_type = 'CAPESIZE'
            ORDER BY timestamp ASC
        """)
        db.close()
        
        if df.empty:
            print("No data found in DuckDB.")
            sys.exit(1)
            
        df['timestamp'] = pd.to_datetime(df['timestamp'])
        df = df.set_index('timestamp')
        
        df_feat = df.copy()
        for lag in [1, 7, 14, 30]:
            df_feat[f'lag_{lag}'] = df_feat['freight_rate'].shift(lag)
        for window in [7, 14, 30]:
            df_feat[f'rolling_mean_{window}'] = df_feat['freight_rate'].shift(1).rolling(window).mean()
            df_feat[f'rolling_std_{window}'] = df_feat['freight_rate'].shift(1).rolling(window).std()
            
        df_feat = df_feat.dropna()
        
        split_idx = int(len(df_feat) * 0.8)
        train_df = df_feat.iloc[:split_idx]
        test_df = df_feat.iloc[split_idx:]
        
        X_train = train_df.drop(columns=['freight_rate'])
        y_train = train_df['freight_rate']
        
        X_test = test_df.drop(columns=['freight_rate'])
        y_test = test_df['freight_rate']
        
        model = ProbabilisticForecaster(n_estimators=50, max_depth=4)
        model.fit(X_train, y_train)
        
        # Test on a small 7-day horizon slice for output demo
        sample_x = X_test.iloc[:7]
        sample_dates = pd.Series(X_test.index[:7])
        
        preds_df = model.predict(sample_x)
        json_out = model.format_output(sample_dates, preds_df)
        
        print("\n--- PHASE 7: PROBABILISTIC FORECASTING (PINBALL LOSS) ---")
        print("\nSample Probabilistic Forecast Output (Expected JSON Structure):")
        print(json.dumps(json_out, indent=2))
        
        # Calculate coverage (percentage of actuals falling within the interval)
        all_preds = model.predict(X_test)
        coverage = ((y_test >= all_preds['q_0.1']) & (y_test <= all_preds['q_0.9'])).mean()
        print(f"\nPrediction Interval (80%) Coverage on Test Set: {coverage * 100:.2f}%")
        print("Note: Coverage ~80% indicates the model correctly captured the mathematical uncertainty bounds.")
        
    except Exception as e:
        print(f"Error occurred: {e}")
