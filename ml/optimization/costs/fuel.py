def calculate_fuel_cost(
    sea_days: float,
    port_days: float,
    consumption_sea_tpd: float,
    consumption_port_tpd: float,
    fuel_price_usd: float,
    number_of_voyages: int
) -> float:
    """
    Section 11: Fuel Cost Calculation
    """
    fuel_sea = sea_days * consumption_sea_tpd
    fuel_port = port_days * consumption_port_tpd
    total_fuel_mt = (fuel_sea + fuel_port) * number_of_voyages
    return total_fuel_mt * fuel_price_usd
