def calculate_idle_cost(
    expected_idle_days: float,
    daily_vessel_cost_usd: float,
    probability_idle_gt_7_days: float,
    alternative_employment_probability: float,
    repositioning_cost_usd: float
) -> float:
    """
    Section 14: Idle-Time Model Integration
    """
    base_idle_cost = expected_idle_days * daily_vessel_cost_usd
    
    # If alternative employment is likely, the cost is just repositioning
    if alternative_employment_probability > 0.7:
        expected_cost = (base_idle_cost * (1 - alternative_employment_probability)) + (repositioning_cost_usd * alternative_employment_probability)
    else:
        expected_cost = base_idle_cost
        
    return expected_cost
