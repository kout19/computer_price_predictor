"""
Response schemas for the Computer Price Prediction API.
"""

from datetime import datetime, timezone
from typing import Optional

from pydantic import BaseModel, Field


class PredictionResponse(BaseModel):
    """Successful prediction result returned to the client."""

    predicted_price: float = Field(..., description="Predicted computer price.", examples=[87999.50])
    currency: str = Field(default="INR", description="Currency of the predicted price.")
    model_version: str = Field(..., description="Version of the API/model that produced this prediction.")
    generated_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        description="UTC timestamp when the prediction was generated.",
    )


class HealthResponse(BaseModel):
    """
    Response returned by the `/health` endpoint.

    Attributes
    ----------
    status : str
        Overall service status, e.g. "ok" or "degraded".
    model_loaded : bool
        Whether the regression model is currently loaded in memory.
    preprocessor_loaded : bool
        Whether the preprocessing pipeline is currently loaded in memory.
    options_loaded : bool
        Whether the categorical options vocabulary is currently loaded.
    environment : str
        Current deployment environment.
    """

    status: str = Field(..., description="Overall service health status.")
    model_loaded: bool = Field(..., description="Whether the model is loaded.")
    preprocessor_loaded: bool = Field(..., description="Whether the preprocessor is loaded.")
    options_loaded: bool = Field(..., description="Whether the categorical options vocabulary is loaded.")
    environment: str = Field(..., description="Current deployment environment.")


class RootResponse(BaseModel):
    """Response returned by the root `/` endpoint."""

    name: str = Field(..., description="API name.")
    version: str = Field(..., description="API version.")
    docs_url: str = Field(..., description="Path to interactive API docs.")


class ErrorResponse(BaseModel):
    """Standardized error payload returned for all handled exceptions."""

    error_code: str = Field(..., description="Machine-readable error code.")
    message: str = Field(..., description="Human-readable error message.")
    details: Optional[str] = Field(default=None, description="Additional error context, if available.")