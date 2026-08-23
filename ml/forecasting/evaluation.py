import numpy as np

def calculate_mae(y_true, y_pred):
    return np.mean(np.abs(y_true - y_pred))

def calculate_rmse(y_true, y_pred):
    return np.sqrt(np.mean(np.square(y_true - y_pred)))

def calculate_mape(y_true, y_pred):
    # Avoid division by zero
    mask = y_true != 0
    return np.mean(np.abs((y_true[mask] - y_pred[mask]) / y_true[mask])) * 100

def calculate_smape(y_true, y_pred):
    # Symmetric MAPE
    denominator = (np.abs(y_true) + np.abs(y_pred)) / 2.0
    mask = denominator != 0
    return np.mean(np.abs(y_true[mask] - y_pred[mask]) / denominator[mask]) * 100

def calculate_directional_accuracy(y_true, y_pred):
    if len(y_true) < 2:
        return 0.0
    # Direction is 1 if it goes up, -1 if it goes down
    actual_direction = np.sign(np.diff(y_true))
    predicted_direction = np.sign(np.diff(y_pred))
    
    # Check if directions match (ignore 0 diffs for simplicity or handle them)
    correct = np.sum(actual_direction == predicted_direction)
    total = len(actual_direction)
    return (correct / total) * 100 if total > 0 else 0.0

def evaluate_forecast(y_true, y_pred, model_name="Model"):
    y_true = np.array(y_true)
    y_pred = np.array(y_pred)
    
    metrics = {
        "Model": model_name,
        "MAE": calculate_mae(y_true, y_pred),
        "RMSE": calculate_rmse(y_true, y_pred),
        "MAPE": calculate_mape(y_true, y_pred),
        "sMAPE": calculate_smape(y_true, y_pred),
        "Directional Accuracy (%)": calculate_directional_accuracy(y_true, y_pred)
    }
    return metrics
