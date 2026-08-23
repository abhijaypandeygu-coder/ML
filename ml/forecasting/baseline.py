import numpy as np
import pandas as pd
from typing import List, Union

class NaiveForecaster:
    """Naive Baseline: \hat{y}_{t+h} = y_t"""
    def __init__(self):
        self.last_value = None

    def fit(self, y: Union[np.ndarray, pd.Series, List[float]]):
        if len(y) == 0:
            raise ValueError("Training data cannot be empty.")
        self.last_value = y[-1] if isinstance(y, (list, np.ndarray)) else y.iloc[-1]
        return self

    def predict(self, horizon: int) -> np.ndarray:
        if self.last_value is None:
            raise ValueError("Model must be fitted before prediction.")
        return np.full(horizon, self.last_value)

class SeasonalNaiveForecaster:
    """Seasonal Naive Baseline: \hat{y}_{t+h} = y_{t+h-m} where m is the seasonal period"""
    def __init__(self, season_length: int = 365):
        self.season_length = season_length
        self.history = None

    def fit(self, y: Union[np.ndarray, pd.Series, List[float]]):
        if len(y) < self.season_length:
            raise ValueError(f"Training data length ({len(y)}) must be >= season length ({self.season_length}).")
        
        self.history = y[-self.season_length:] if isinstance(y, (list, np.ndarray)) else y.iloc[-self.season_length:].values
        return self

    def predict(self, horizon: int) -> np.ndarray:
        if self.history is None:
            raise ValueError("Model must be fitted before prediction.")
        
        preds = []
        for h in range(horizon):
            idx = h % self.season_length
            preds.append(self.history[idx])
        return np.array(preds)

class MovingAverageForecaster:
    """Moving Average Baseline: \hat{y}_{t+h} = \frac{1}{w} \sum_{i=1}^{w} y_{t-i+1}"""
    def __init__(self, window: int = 7):
        self.window = window
        self.history = None

    def fit(self, y: Union[np.ndarray, pd.Series, List[float]]):
        if len(y) < self.window:
            raise ValueError(f"Training data length ({len(y)}) must be >= window ({self.window}).")
            
        self.history = list(y[-self.window:]) if isinstance(y, (list, np.ndarray)) else y.iloc[-self.window:].tolist()
        return self

    def predict(self, horizon: int) -> np.ndarray:
        if self.history is None:
            raise ValueError("Model must be fitted before prediction.")
            
        preds = []
        current_history = self.history.copy()
        
        for _ in range(horizon):
            pred = np.mean(current_history[-self.window:])
            preds.append(pred)
            current_history.append(pred)
            
        return np.array(preds)

if __name__ == "__main__":
    from ml.forecasting.evaluation import evaluate_forecast
    
    # Simple test
    print("Testing Baselines...")
    train_data = np.sin(np.linspace(0, 10, 100)) + np.random.normal(0, 0.1, 100)
    test_data = np.sin(np.linspace(10, 11, 10)) + np.random.normal(0, 0.1, 10)
    
    models = {
        "Naive": NaiveForecaster(),
        "SeasonalNaive (m=10)": SeasonalNaiveForecaster(season_length=10),
        "MovingAverage (w=5)": MovingAverageForecaster(window=5)
    }
    
    results = []
    for name, model in models.items():
        model.fit(train_data)
        preds = model.predict(horizon=10)
        metrics = evaluate_forecast(test_data, preds, name)
        results.append(metrics)
        
    results_df = pd.DataFrame(results)
    print(results_df.to_string(index=False))
