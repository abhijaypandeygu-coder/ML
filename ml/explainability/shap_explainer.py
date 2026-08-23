import shap
import pandas as pd
import numpy as np
import xgboost as xgb
from typing import Dict, Any, List

class ModelExplainer:
    def __init__(self, model, feature_names: List[str]):
        """
        model: Trained XGBoost model (must be the raw model, not our wrapper)
        feature_names: List of feature names matching the model's input
        """
        self.model = model
        self.feature_names = feature_names
        # Create TreeExplainer. We assume a tree-based model (XGBoost).
        self.explainer = shap.TreeExplainer(model)
        
        # Mapping from raw feature names to human-readable text
        self.feature_map = {
            "rate_lag_1": "yesterday's freight rate",
            "rate_lag_7": "last week's freight rate",
            "volatility_7d": "recent market volatility",
            "momentum_7d": "market momentum",
            "bdi_index": "Baltic Dry Index",
            "fuel_price": "bunker fuel costs",
            "port_congestion": "port congestion levels"
        }

    def explain_prediction(self, X: pd.DataFrame, top_k: int = 3) -> Dict[str, Any]:
        """
        Explains a single prediction (or multiple). Returns human-readable explanation.
        """
        # Calculate SHAP values
        shap_values = self.explainer.shap_values(X)
        
        # If multiple rows, take the first one for the narrative explanation
        if isinstance(shap_values, list): # For multi-class (not our case, but safeguard)
            shap_vals = shap_values[1][0]
        elif len(shap_values.shape) > 1:
            shap_vals = shap_values[0]
        else:
            shap_vals = shap_values
            
        # Get base value (average model output over training set)
        base_value = self.explainer.expected_value
        if isinstance(base_value, (list, np.ndarray)):
            base_value = base_value[0]
            
        prediction = base_value + np.sum(shap_vals)
        
        # Pair feature names with their shap values
        feature_contributions = list(zip(self.feature_names, shap_vals))
        
        # Sort by absolute contribution (highest impact first)
        feature_contributions.sort(key=lambda x: abs(x[1]), reverse=True)
        
        explanations = []
        for feat, val in feature_contributions[:top_k]:
            human_name = self.feature_map.get(feat, feat)
            direction = "pushing the rate UP" if val > 0 else "pushing the rate DOWN"
            explanations.append(f"{human_name} ({direction} by ${abs(val):.2f})")
            
        narrative = f"The model predicted a freight rate of ${prediction:.2f}. "
        narrative += f"Starting from a baseline of ${base_value:.2f}, the primary drivers were: "
        narrative += ", ".join(explanations) + "."
        
        return {
            "prediction": round(prediction, 2),
            "base_value": round(float(base_value), 2),
            "top_drivers": [{"feature": f, "impact": float(v)} for f, v in feature_contributions[:top_k]],
            "narrative": narrative
        }

if __name__ == "__main__":
    print("Testing SHAP Explainer...")
    
    # Create a dummy XGBoost model and train it quickly on dummy data
    X_train = pd.DataFrame(np.random.rand(100, 5), columns=["rate_lag_1", "volatility_7d", "fuel_price", "port_congestion", "momentum_7d"])
    y_train = X_train["rate_lag_1"] * 0.5 + X_train["fuel_price"] * 0.3 + np.random.randn(100) * 0.1
    
    model = xgb.XGBRegressor(n_estimators=10, max_depth=3, base_score=0.5)
    model.fit(X_train, y_train)
    
    # Target instance to explain
    X_test = pd.DataFrame([[0.8, 0.2, 0.9, 0.5, -0.1]], columns=["rate_lag_1", "volatility_7d", "fuel_price", "port_congestion", "momentum_7d"])
    
    explainer = ModelExplainer(model=model, feature_names=X_train.columns.tolist())
    result = explainer.explain_prediction(X_test)
    
    import json
    print(json.dumps(result, indent=2))
