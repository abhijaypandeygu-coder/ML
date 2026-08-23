from datetime import datetime, date
from typing import Optional
from pydantic import BaseModel, Field
from enum import Enum

class ProvenanceType(str, Enum):
    REAL = "REAL"
    SYNTHETIC = "SYNTHETIC"
    SIMULATED = "SIMULATED"
    IMPORTED = "IMPORTED"
    DERIVED = "DERIVED"

class QualityStatus(str, Enum):
    VALID = "VALID"
    SUSPICIOUS = "SUSPICIOUS"
    OUTLIER = "OUTLIER"
    INVALID = "INVALID"
    UNKNOWN = "UNKNOWN"

class FreshnessStatus(str, Enum):
    FRESH = "FRESH"
    AGING = "AGING"
    STALE = "STALE"
    UNKNOWN = "UNKNOWN"

class BaseDataRecord(BaseModel):
    """Base class for all domain records to ensure provenance and time-awareness."""
    timestamp: datetime = Field(description="UTC timestamp of the observation")
    source: str = Field(description="Source identifier or URL")
    source_type: ProvenanceType
    data_quality: QualityStatus = QualityStatus.UNKNOWN
    last_updated: datetime = Field(default_factory=datetime.utcnow)
