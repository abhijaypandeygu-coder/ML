# Data Dictionary

## 1. Freight Market Data (`freightquant.db` -> `market_rates`)
| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `date` | DATE | The date of the observed freight rate. |
| `route` | VARCHAR | The specific voyage route (e.g., Australia -> Paradip). |
| `vessel_type` | VARCHAR | Type of vessel (e.g., Capesize, Panamax). |
| `spot_rate` | FLOAT | The daily spot market freight rate (in USD per MT). |
| `bunker_price` | FLOAT | The daily cost of High Sulphur Fuel Oil (HSFO) per MT. |
| `realized_volatility` | FLOAT | 30-day trailing volatility of the spot rate. |
| `source_type` | VARCHAR | Identifier for data provenance (e.g., 'SYNTHETIC', 'BTS_FAF'). |

## 2. Port Metrics (`freightquant.db` -> `port_metrics`)
| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `date` | DATE | Date of measurement. |
| `port_id` | VARCHAR | Name/ID of the port (e.g., 'Paradip'). |
| `congestion_index` | FLOAT | Normalized 0-1 scale indicating port backlog. |
| `average_delay_days` | FLOAT | Expected queue waiting time before berthing. |
| `weather_disruption_flag` | BOOLEAN | Indicates extreme weather events (e.g., Cyclones). |
