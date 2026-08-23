# FreightQuant — Intelligent Freight Forecasting & Charter Optimization

> **SIH 2026 Problem Statement 26006:** Intelligent Freight Forecasting Model for Optimized Vessel Chartering and Bulk Cargo Procurement.

FreightQuant is an enterprise-grade maritime quantitative trading, chartering, and decision-support terminal designed for bulk-cargo procurement teams (e.g. SAIL, CIL, NTPC). It moves operations from volatile spot exposures into structured, index-linked medium-term multiple-voyage contracts (COAs) while optimizing vessel draft geometries for Indian East Coast discharge terminals.

---

## 🌟 Core Decision Principle

$$\text{Forecast} \longrightarrow \text{Understand Risk} \longrightarrow \text{Optimize} \longrightarrow \text{Recommend} \longrightarrow \text{Simulate}$$

---

## 🚀 Key Modules & Capabilities

1. **Executive Terminal Dashboard**: Live spot fixtures, 7D/30D probabilistic targets, market regime detection (`RISING` at 84.5% confidence), risk scoring, and expected savings metrics.
2. **Interactive Forward Curve**: Historical Baltic dry fixtures against 7D/14D/30D/90D/1Y ML forecast trajectories with $80\%$ and $95\%$ confidence cones.
3. **Charter Requirement Planner**: Guided workflow configuring parcel sizes, laycans, global origins (Australia, US, Mozambique, Indonesia, Russia), and Indian East Coast discharge ports (**Paradip, Visakhapatnam, Gangavaram, Gopalpur, Dhamra, Sagar-Sandheads, Haldia**).
4. **Vessel Sizing & Port Geometric Compatibility**: Automated constraint validation across Handysize, Supramax, Panamax, and Capesize classes against port drafts, LOA pockets, and crane handling rates.
5. **Charter Strategy & Recommendation**: Recommended Vessel + Entry Window + Contract Type with direct **Spot vs Short-Term vs Medium-Term COA** comparison (₹7.1 Cr savings).
6. **What-If Sensitivity Simulator**: Real-time reactive sliders for Freight shifts ($\pm 30\%$), Bunker fuel ($\pm 50\%$), Port delays ($0-15$ days), and Cargo volume perturbations with instant Before vs After delta evaluation.
7. **Idle Fleet Planner**: Ballast repositioning economics and backhaul coastal routing.
8. **Forecasting Model Transparency**: DeepAR probabilistic network, XGBoost ensemble, and ARIMA baseline backtesting benchmarks (MAE, RMSE, Directional Accuracy $84.2\%$).

---

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS v4, Custom Maritime Trading Terminal tokens
- **Data Visualization**: Recharts, SVG/Canvas
- **Icons**: Lucide React
- **Optimization**: Quantitative Multi-Objective Solver Engine

---

## 💻 Local Setup & Development

```bash
# 1. Clone repository
git clone https://github.com/Veeru2807/SIH.git
cd SIH

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Build for production
npm run build
```

---

## 📄 License
MIT License
