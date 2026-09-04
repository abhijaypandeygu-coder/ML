import httpx
import json
import sys

def main():
    print("=========================================")
    print("FreightQuant ML Evaluation Pipeline")
    print("=========================================\n")
    
    print("[1/5] Running Data Quality & Leakage Checks...")
    print("[2/5] Running Rolling-Window Forecast Backtests...")
    print("[3/5] Evaluating Optimization & Hard Constraints...")
    print("[4/5] Calculating Business Metrics vs Spot Baseline...")
    print("[5/5] Running Monte Carlo Robustness Tests...\n")
    
    try:
        response = httpx.post("http://localhost:8000/api/v1/evaluation/run", timeout=30.0)
        if response.status_code == 200:
            report = response.json()
            
            with open("evaluation_report.json", "w") as f:
                json.dump(report, f, indent=4)
                
            print("Evaluation Completed Successfully!")
            print(f"Overall Status: {report['overall_status']}")
            print(f"Savings vs Spot: {report['business_impact']['cost_reduction_pct']:.1f}%")
            print(f"ML Forecast MAPE: {report['forecast_performance'][-1]['mape']}%")
            print(f"Constraint Pass Rate: {100.0 - report['optimization_performance']['constraint_violation_rate']}%")
            print("\nReport saved to evaluation_report.json")
        else:
            print(f"Failed to run evaluation. Status: {response.status_code}")
            sys.exit(1)
    except Exception as e:
        print(f"Error connecting to API: {e}")
        print("Ensure the backend API is running.")
        sys.exit(1)

if __name__ == "__main__":
    main()
