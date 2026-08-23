from typing import Dict, Any, Callable

class WhatIfScenarioEngine:
    def __init__(self):
        pass

    def run_scenario(
        self,
        base_inputs: Dict[str, Any],
        adjustments: Dict[str, Any],
        optimization_callback: Callable
    ) -> Dict[str, Any]:
        """
        Section 24: Scenario Analysis
        Runs the optimization pipeline with adjusted inputs and compares to base.
        """
        # Run base
        base_result = optimization_callback(base_inputs)
        
        # Apply adjustments
        scenario_inputs = base_inputs.copy()
        for k, v in adjustments.items():
            if k in scenario_inputs:
                # If adjustment is a percentage string like '+15%', parse it
                if isinstance(v, str) and v.endswith('%'):
                    pct = float(v.replace('%', '').replace('+', '')) / 100.0
                    scenario_inputs[k] = scenario_inputs[k] * (1 + pct)
                else:
                    scenario_inputs[k] = v
                    
        # Run scenario
        scenario_result = optimization_callback(scenario_inputs)
        
        return {
            "scenario_name": "Custom Scenario",
            "adjustments_applied": adjustments,
            "base_recommendation": base_result.get("recommended_strategy"),
            "scenario_recommendation": scenario_result.get("recommended_strategy"),
            "base_cost": base_result.get("total_cost"),
            "scenario_cost": scenario_result.get("total_cost")
        }
