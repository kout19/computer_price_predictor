"""
Application configuration module for the Computer Price Prediction System.

This module defines a single, centralized configuration object for the
entire backend service. All environment-dependent values (paths, API
metadata, CORS origins, runtime flags) must be declared here and nowhere
else. Other layers of the application (API routes, ML loader/predictor,
services) must depend on `Settings` via `get_settings()` rather than
reading environment variables or constructing filesystem paths directly.
"""

from functools import lru_cache
from pathlib import Path
from typing import List

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Centralized application settings for the Computer Price Prediction API.

    Attributes
    ----------
    api_title : str
        Human-readable API title, surfaced in the OpenAPI schema.
    api_description : str
        Short description of the API, surfaced in the OpenAPI schema.
    api_version : str
        Semantic version of the API.
    api_v1_prefix : str
        URL prefix under which versioned routes are mounted.
    environment : str
        Deployment environment identifier.
    debug : bool
        Whether the application is running in debug mode.
    log_level : str
        Logging verbosity level, consumed by `app.core.logging`.
    base_dir : Path
        Absolute path to the `backend/` directory.
    artifacts_dir : Path
        Directory (relative to `base_dir`) containing serialized artifacts.
    model_filename : str
        Filename of the serialized regression model.
    preprocessor_filename : str
        Filename of the serialized preprocessing pipeline.
    options_filename : str
        Filename of the cached categorical options vocabulary (JSON),
        generated at training time from the training DataFrame.
    cors_allow_origins : List[str]
        Origins permitted to make cross-origin requests.
    """

    api_title: str = Field(default="Computer Price Prediction API")
    api_description: str = Field(
        default=(
            "Production REST API for predicting computer prices across "
            "multiple device types using a trained scikit-learn "
            "regression pipeline."
        )
    )
    api_version: str = Field(default="1.0.0")
    api_v1_prefix: str = Field(default="/api/v1")

    environment: str = Field(default="development")
    debug: bool = Field(default=False)
    log_level: str = Field(default="INFO")

    base_dir: Path = Field(default=Path(__file__).resolve().parents[2])
    artifacts_dir: Path = Field(default=Path("artifacts"))
    model_filename: str = Field(default="computer_best_model.joblib")
    preprocessor_filename: str = Field(default="computer_preprocessor.joblib")
    options_filename: str = Field(
        default="options.json",
        description=(
            "Filename of the cached categorical options vocabulary, "
            "generated during training from the training DataFrame's "
            "unique categorical values."
        ),
    )

    cors_allow_origins: List[str] = Field(
        default=["http://localhost:3000", "http://localhost:5173"]
    )

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        env_prefix="APP_",
        case_sensitive=False,
        extra="ignore",
    )

    @field_validator("log_level")
    @classmethod
    def validate_log_level(cls, value: str) -> str:
        """Validate that `log_level` is a recognized Python logging level."""
        allowed = {"DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"}
        normalized = value.upper()
        if normalized not in allowed:
            raise ValueError(f"Invalid log_level '{value}'. Must be one of {sorted(allowed)}.")
        return normalized

    @field_validator("environment")
    @classmethod
    def validate_environment(cls, value: str) -> str:
        """Validate that `environment` is a recognized deployment stage."""
        allowed = {"development", "staging", "production"}
        normalized = value.lower()
        if normalized not in allowed:
            raise ValueError(f"Invalid environment '{value}'. Must be one of {sorted(allowed)}.")
        return normalized

    @property
    def artifacts_path(self) -> Path:
        """Resolve the absolute path to the artifacts directory."""
        return (self.base_dir / self.artifacts_dir).resolve()

    @property
    def model_path(self) -> Path:
        """Resolve the absolute path to the serialized model file."""
        return self.artifacts_path / self.model_filename

    @property
    def preprocessor_path(self) -> Path:
        """Resolve the absolute path to the serialized preprocessor file."""
        return self.artifacts_path / self.preprocessor_filename

    @property
    def options_path(self) -> Path:
        """
        Resolve the absolute path to the cached categorical options file.

        Returns
        -------
        Path
            Absolute path to the `options.json` artifact.
        """
        return self.artifacts_path / self.options_filename

    @property
    def is_production(self) -> bool:
        """Determine whether the application is running in production."""
        return self.environment == "production"


@lru_cache
def get_settings() -> Settings:
    """Return a cached, process-wide singleton instance of `Settings`."""
    return Settings()