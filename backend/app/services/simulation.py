from app.schemas.simulation import WhatIfRequest, SimulationResponse

class SimulationService:
    def __init__(self):
        pass

    def run_what_if(self, request: WhatIfRequest) -> SimulationResponse:
        """
        Runs a what-if scenario simulation by modifying the base inputs.
        Mock implementation for the baseline architecture.
        """
        
        # Mock base cost retrieved from previous analysis ID
        base_cost = 2500000.0
        
        # Calculate impact of scenario inputs
        freight_impact = base_cost * 0.6 * (request.scenario.freight_rate_change_percent / 100.0)
        fuel_impact = base_cost * 0.3 * (request.scenario.fuel_price_change_percent / 100.0)
        delay_impact = request.scenario.delay_days * 30000 # 30k per day delay
        
        scenario_cost = base_cost + freight_impact + fuel_impact + delay_impact
        delta = scenario_cost - base_cost
        
        recommendation_change = "NO_CHANGE"
        if request.scenario.delay_days > 5:
            recommendation_change = "SWITCH_TO_SPOT"
        elif request.scenario.freight_rate_change_percent > 10:
            recommendation_change = "LOCK_LONG_TERM_CONTRACT"
            
        risk_change = "UNCHANGED"
        if request.scenario.port_congestion_multiplier >= 1.5:
            risk_change = "INCREASED"
            
        return SimulationResponse(
            base_cost=base_cost,
            scenario_cost=scenario_cost,
            delta_cost=delta,
            recommendation_change=recommendation_change,
            risk_level_change=risk_change
        )
