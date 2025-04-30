from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

class DataQuality(BaseModel):
    missing_values: int
    unique_values: int
    std_dev: Optional[float] = None
    min: Optional[float] = None
    max: Optional[float] = None
    most_common_percentage: Optional[float] = None

class Trend(BaseModel):
    trend_direction: str
    trend_strength: float

class Anomaly(BaseModel):
    count: int
    percentage: float

class Correlation(BaseModel):
    column1: str
    column2: str
    correlation: float

class FileMetadata(BaseModel):
    uploaded_at: str
    file_size: int
    columns: List[str]

class FileStats(BaseModel):
    filename: str
    row_count: int
    column_count: int
    numeric_averages: Dict[str, float]
    categorical_most_common: Dict[str, List[Any]]
    data_quality: Dict[str, DataQuality]
    trends: Dict[str, Trend]
    correlations: List[Correlation]
    anomalies: Dict[str, Anomaly]
    metadata: FileMetadata

class UploadResponse(BaseModel):
    executive_summary: str
    action_items: List[str]
    file_stats: List[FileStats]
    confidence_score: float 