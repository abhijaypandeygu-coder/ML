# Data Sources

1. **Synthetic Data Generator (Primary Source)**
   - **Origin:** Internal generator (`ml/data/synthetic/generator.py`)
   - **Reason:** The primary BTS FAF API (`https://www.bts.gov/faf`) blocks automated web scraper traffic (HTTP 403). For Hackathon and evaluation purposes, we bypass this block by generating mathematically robust synthetic data mimicking the Baltic Exchange rates and global port congestion.
   
2. **Baltic Dry Index (BDI) Simulation**
   - Simulates historical Capesize and Panamax rates based on geometric Brownian motion models combined with sinusoidal seasonal seasonality.

3. **Port Congestion API Simulation**
   - Simulates vessel waiting times and loading/unloading delays at major East Coast Indian ports (e.g., Paradip, Haldia, Visakhapatnam).
