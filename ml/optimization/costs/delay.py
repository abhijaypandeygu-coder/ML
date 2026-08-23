def calculate_delay_cost(
    expected_delay_days: float,
    daily_charter_rate_usd: float,
    number_of_voyages: int
) -> float:
    """
    Section 13: Delay Cost Calculation
    Assumes delay costs reflect demurrage or extended hire at 125% of base rate.
    """
    demurrage_rate = daily_charter_rate_usd * 1.25
    return expected_delay_days * demurrage_rate * number_of_voyages
