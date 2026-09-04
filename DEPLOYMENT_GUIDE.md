# FreightQuant AI/ML Deployment Guide

## 1. Environment Setup

Make sure you are running in the `backend/venv` virtual environment where all ML and API dependencies are installed.

```bash
cd backend
venv\Scripts\activate
```

## 2. Generate Data & Initialize DuckDB Pipeline

Since the BTS APIs block automated traffic, use our internal generator to build the historical 4-year daily datasets and load them into the DuckDB / Parquet backend.

```bash
cd ../ml/data/db
python ingest_synthetic.py
```

## 3. Train the Custom Local LLM

The custom PyTorch LLM needs to be trained on the local data to generate the `custom_freight_llm.pth` weights and `vocab_mapping.json`. 

```bash
cd ../../llm
python train_llm.py
```

## 4. Start the Background Cron Jobs (Ingestion & Scraping)

Start the APScheduler cron jobs to automatically fetch daily market rates and port congestion updates. This also streams logs to `ml/logs/system_audit.log`.

```bash
cd ../data
python cron_jobs.py
```

## 5. Run the Automated Test Suite

Verify that all engines (MILP, Risk, Validation) are functioning correctly.

```bash
cd ../../
backend\venv\Scripts\pytest.exe tests/test_engines.py
```

## 6. Start the FastAPI ML Server

Start the ML API which acts as the orchestrator for the forecasting, optimization, and explainability layer.

```bash
cd ml/api
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

## 7. Start the Frontend

Navigate to your frontend directory (e.g. `SIH-main/client`) and start the UI.

```bash
npm install
npm start
```
