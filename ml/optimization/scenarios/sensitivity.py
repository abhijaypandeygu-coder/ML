from typing import Dict, Any, Callable, List

class SensitivityAnalysisEngine:
    def __init__(self):
        pass

    def run_sensitivity(
        self,
        base_inputs: Dict[str, Any],
        variable: str,
        range_pct: List[float],
        optimization_callback: Callable
    ) -> Dict[str, Any]:
        """
        Section 25: Sensitivity Analysis
        """
        results = []
        base_val = base_inputs.get(variable, 0.0)
        
        for pct in range_pct:
            test_inputs = base_inputs.copy()
            test_val = base_val * (1 + pct)
            test_inputs[variable] = test_val
            
            res = optimization_callback(test_inputs)
            
            results.append({
                "pct_change": round(pct * 100, 1),
                "variable_value": test_val,
                "recommended_strategy": res.get("recommended_strategy"),
                "total_cost": res.get("total_cost")
            })
            
        return {
            "variable_tested": variable,
            "base_value": base_val,
            "sensitivity_results": results
        }
