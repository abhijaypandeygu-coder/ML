# Equation Registry

This document catalogues all mathematical equations and definitions used in the FreightQuant forecasting, risk, and optimization engines. 
The LLM must reference these equations directly and must not invent alternative formulas.

## 1. Rolling Volatility
- **ID:** `EQ_VOLATILITY`
- **Name:** Rolling Window Volatility
- **LaTeX:** $\sigma_{t,w} = \sqrt{\frac{1}{w-1} \sum_{i=0}^{w-1}(r_{t-i}-\bar{r})^2}$ where $r_t = \ln(F_t / F_{t-1})$
- **Variables:** 
  - $w$: Rolling window size (e.g., 30 days)
  - $F_t$: Freight rate at time $t$
  - $\bar{r}$: Mean return over window
- **Units:** Dimensionless (log-returns)
- **Source:** Standard financial econometrics definition.
- **Implementation:** `ml.features.time_features`

## 2. Pinball Loss (Quantile Loss)
- **ID:** `EQ_PINBALL_LOSS`
- **Name:** Pinball / Quantile Loss
- **LaTeX:** $L_\tau(y,q) = \max(\tau(y-q), (\tau-1)(y-q))$
- **Variables:**
  - $\tau$: Target quantile (e.g., 0.1, 0.5, 0.9)
  - $y$: Actual observation
  - $q$: Predicted quantile
- **Assumptions:** Used for asymmetric loss evaluation in probabilistic forecasting.
- **Implementation:** `ml.evaluation.metrics`

## 3. Expected Voyage Cost
- **ID:** `EQ_EXP_COST`
- **Name:** Expected Total Voyage Cost
- **LaTeX:** $E[C] = Q \times E[F] + C_{port} + C_{bunker}$
- **Variables:**
  - $Q$: Cargo quantity (MT)
  - $E[F]$: Expected future freight rate (USD/MT)
  - $C_{port}$: Port costs
  - $C_{bunker}$: Bunker costs
- **Units:** USD
- **Implementation:** `ml.optimization.costs.charter`

## 4. Value at Risk (VaR)
- **ID:** `EQ_VAR`
- **Name:** Value at Risk
- **LaTeX:** $VaR_\alpha = \inf\{l : P(L \le l) \ge \alpha\}$
- **Variables:**
  - $\alpha$: Confidence level (e.g., 0.95)
  - $L$: Loss distribution (USD)
- **Implementation:** `ml.risk.risk_engine`

## 5. Conditional Value at Risk (CVaR)
- **ID:** `EQ_CVAR`
- **Name:** Conditional Value at Risk / Expected Shortfall
- **LaTeX:** $CVaR_\alpha = E[L | L \ge VaR_\alpha]$
- **Variables:**
  - $\alpha$: Confidence level
  - $L$: Loss distribution
- **Implementation:** `ml.risk.risk_engine`
