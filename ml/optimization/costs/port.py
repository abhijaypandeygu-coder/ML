def calculate_port_cost(
    origin_base_dues: float,
    destination_base_dues: float,
    vessel_capacity_mt: float,
    number_of_voyages: int
) -> float:
    """
    Section 12: Port Cost Calculation
    Simple estimation logic assuming scale factor on capacity.
    """
    origin_total = origin_base_dues + (vessel_capacity_mt * 0.45)
    dest_total = destination_base_dues + (vessel_capacity_mt * 0.45)
    return (origin_total + dest_total) * number_of_voyages
