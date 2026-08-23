from pydantic import BaseModel

class Port(BaseModel):
    port_id: str
    country: str
    max_draft_m: float
    max_loa_m: float
    max_beam_m: float
    cargo_handling_rate_tpd: float
    congestion_level: str = "LOW"
    avg_wait_days: float = 0.0
    port_dues_base_usd: float = 0.0
