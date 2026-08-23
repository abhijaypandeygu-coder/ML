def calculate_charter_cost(
    daily_rate_usd: float,
    turnaround_days: float,
    number_of_voyages: int,
    strategy: str = "SPOT",
    forecast_multiplier: float = 1.0
) -> float:
    """
    Section 10: Charter Cost Calculation
    """
    base_cost = daily_rate_usd * turnaround_days * number_of_voyages * forecast_multiplier
    
    if strategy == "SHORT_TERM":
        return base_cost * 0.98 # 2% discount for short-term
    elif strategy == "MEDIUM_TERM_MULTIPLE_VOYAGE":
        return base_cost * 0.93 # 7% discount for medium-term multi-voyage
    return base_cost
