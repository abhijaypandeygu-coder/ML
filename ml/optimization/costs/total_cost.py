from typing import Dict, Any

def calculate_total_cost(
    charter_cost: float,
    fuel_cost: float,
    port_cost: float,
    delay_cost: float,
    idle_cost: float,
    risk_penalty_score: float,
    risk_tolerance: str
) -> Dict[str, float]:
    """
    Section 9: Total Cost Function
    Calculates expected total cost and applies risk penalty based on tolerance.
    """
    total_cost = charter_cost + fuel_cost + port_cost + delay_cost + idle_cost
    
    # Lambda = f(risk tolerance)
    if risk_tolerance == "LOW":
        lambda_factor = 25000.0  # High penalty per risk point
    elif risk_tolerance == "MEDIUM":
        lambda_factor = 10000.0  # Moderate penalty per risk point
    elif risk_tolerance == "HIGH":
        lambda_factor = 2500.0   # Low penalty per risk point
    else:
        lambda_factor = 10000.0

    risk_penalty = lambda_factor * risk_penalty_score
    risk_adjusted_cost = total_cost + risk_penalty

    return {
        "charter_cost": charter_cost,
        "fuel_cost": fuel_cost,
        "port_cost": port_cost,
        "delay_cost": delay_cost,
        "idle_cost": idle_cost,
        "total_expected_cost": total_cost,
        "risk_penalty": risk_penalty,
        "risk_adjusted_cost": risk_adjusted_cost
    }
