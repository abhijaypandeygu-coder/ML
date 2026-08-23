import pandas as pd
import numpy as np
from hmmlearn import hmm
import json

class RegimeDetectorHMM:
    """Hidden Markov Model for Market Regime Detection."""
    def __init__(self, n_components=4, random_state=42):
        self.n_components = n_components
        self.model = hmm.GaussianHMM(n_components=self.n_components, covariance_type="full", n_iter=1000, random_state=random_state)
        self.state_map = {}
        self.features = ['return_1d', 'realized_volatility']

    def fit(self, X: pd.DataFrame):
        # We need to fill NaNs for HMM
        X_clean = X[self.features].fillna(0)
        self.model.fit(X_clean)
        
        # Map states to interpretable names based on means and covariances
        means = self.model.means_
        covars = self.model.covars_
        
        # We have 4 states. Let's classify them:
        # 1. High Volatility (highest variance in returns or highest realized_volatility mean)
        # 2. Rising (highest return mean among remaining)
        # 3. Falling (lowest return mean among remaining)
        # 4. Stable (the last one, usually near 0 mean and low variance)
        
        volatilities = [covars[i][0][0] for i in range(self.n_components)] # variance of return_1d
        high_vol_state = np.argmax(volatilities)
        
        remaining_states = [i for i in range(self.n_components) if i != high_vol_state]
        
        returns_means = [(i, means[i][0]) for i in remaining_states]
        returns_means.sort(key=lambda x: x[1]) # sort by return mean
        
        falling_state = returns_means[0][0]
        stable_state = returns_means[1][0]
        rising_state = returns_means[2][0]
        
        self.state_map[high_vol_state] = "HIGH_VOLATILITY"
        self.state_map[rising_state] = "RISING"
        self.state_map[falling_state] = "FALLING"
        self.state_map[stable_state] = "STABLE"
        
        return self

    def predict(self, X: pd.DataFrame):
        X_clean = X[self.features].fillna(0)
        hidden_states = self.model.predict(X_clean)
        # Get state probabilities (confidence)
        state_probs = self.model.predict_proba(X_clean)
        
        results = []
        for i, state in enumerate(hidden_states):
            regime = self.state_map[state]
            confidence = state_probs[i][state]
            results.append({
                "regime": regime,
                "confidence": float(confidence),
                "features": {
                    "return_1d": float(X_clean.iloc[i]['return_1d']),
                    "realized_volatility": float(X_clean.iloc[i]['realized_volatility'])
                }
            })
        return results

if __name__ == "__main__":
    print("Training HMM Regime Detector...")
    try:
        df = pd.read_csv("freight_data_featured.csv")
        # Ensure chronological order and take a specific route to train cleanly
        df['date'] = pd.to_datetime(df['date'])
        df = df.sort_values('date')
        
        # Train on just one route for cleaner regime detection in this demo
        route_df = df[df['origin'] == 'Australia'].copy()
        
        detector = RegimeDetectorHMM()
        detector.fit(route_df)
        
        predictions = detector.predict(route_df)
        
        print("\nSample Regime Output (Last 3 days):")
        print(json.dumps(predictions[-3:], indent=2))
        
        # Count regimes
        regime_counts = pd.Series([p['regime'] for p in predictions]).value_counts()
        print("\nRegime Distribution:")
        print(regime_counts)
        
    except FileNotFoundError:
        print("Data files not found.")
