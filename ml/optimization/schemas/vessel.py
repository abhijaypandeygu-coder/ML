from pydantic import BaseModel
from datetime import date
from typing import Optional

class Vessel(BaseModel):
    vessel_id: str
    vessel_type: str
    capacity_mt: float
    draft_m: float
    loa_m: float
    beam_m: float
    speed_knots: float
    bunker_consumption_sea_tpd: float
    bunker_consumption_port_tpd: float
    daily_charter_rate_usd: float
    available_from: date
    available_at_port: Optional[str] = None
