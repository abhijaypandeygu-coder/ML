import pandas as pd
import numpy as np
from typing import List, Dict, Any
from ml.data.schemas.core import QualityStatus

class ValidationEngine:
    """
    Validates data against business rules and detects outliers.
    Strictly follows the principle: Flag invalid data, do not silently drop it.
    """
    
    def detect_outliers_iqr(self, df: pd.DataFrame, column: str) -> pd.Series:
        """Flags outliers using the robust IQR method."""
        if df[column].isnull().all():
            return pd.Series([False] * len(df), index=df.index)
            
        Q1 = df[column].quantile(0.25)
        Q3 = df[column].quantile(0.75)
        IQR = Q3 - Q1
        lower_bound = Q1 - 1.5 * IQR
        upper_bound = Q3 + 1.5 * IQR
        
        return (df[column] < lower_bound) | (df[column] > upper_bound)
        
    def validate_freight_data(self, df: pd.DataFrame) -> pd.DataFrame:
        """Validates freight data according to business rules."""
        if df.empty:
            return df
            
        df = df.copy()
        
        if 'data_quality' not in df.columns:
            df['data_quality'] = QualityStatus.VALID.value
            
        # Business Rule 1: Freight rates must be > 0
        if 'freight_rate' in df.columns:
            invalid_rates = df['freight_rate'] <= 0
            df.loc[invalid_rates, 'data_quality'] = QualityStatus.INVALID.value
            
            # Outlier detection
            outliers = self.detect_outliers_iqr(df, 'freight_rate')
            # Flag outliers only if they aren't completely invalid
            df.loc[outliers & ~invalid_rates, 'data_quality'] = QualityStatus.OUTLIER.value
            
        return df
        
    def validate_port_data(self, df: pd.DataFrame) -> pd.DataFrame:
        """Validates port data (draft, LOA, beam constraints)."""
        if df.empty:
            return df
            
        df = df.copy()
        if 'data_quality' not in df.columns:
            df['data_quality'] = QualityStatus.VALID.value
            
        # Business Rules: physical dimensions must be > 0
        for col in ['max_draft_m', 'max_loa_m', 'max_beam_m']:
            if col in df.columns:
                invalid = df[col] <= 0
                df.loc[invalid, 'data_quality'] = QualityStatus.INVALID.value
                
        return df

    def normalize_units(self, df: pd.DataFrame, column: str, from_unit: str, to_unit: str) -> pd.DataFrame:
        """Standardizes internal units across domains."""
        conversion_factors = {
            ('KM', 'NM'): 0.539957,
            ('NM', 'KM'): 1.852,
            ('LBS', 'MT'): 0.000453592,
            ('MT', 'LBS'): 2204.62,
        }
        
        df = df.copy()
        if (from_unit, to_unit) in conversion_factors and column in df.columns:
            df[column] = df[column] * conversion_factors[(from_unit, to_unit)]
            
        return df

    def generate_data_quality_report(self, df: pd.DataFrame, source_name: str) -> Dict[str, Any]:
        """
        Generates the mandatory Data Quality Report required by the Master Prompt.
        """
        if df.empty:
            return {"status": "EMPTY_DATAFRAME"}
            
        report = {
            "source_name": source_name,
            "rows": len(df),
            "features": len(df.columns),
            "missingness_percentage": round((df.isnull().sum().sum() / df.size) * 100, 2),
            "duplicates": int(df.duplicated().sum()),
            "staleness_days": None,
            "data_quality_distribution": {}
        }
        
        # Check staleness if there's a timestamp column
        if 'timestamp' in df.columns:
            try:
                latest_date = pd.to_datetime(df['timestamp']).max()
                current_date = pd.to_datetime('today')
                report['staleness_days'] = (current_date - latest_date).days
            except Exception:
                pass
                
        # Get data quality status distribution if we validated it
        if 'data_quality' in df.columns:
            report['data_quality_distribution'] = df['data_quality'].value_counts().to_dict()
            
        return report
