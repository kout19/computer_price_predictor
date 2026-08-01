"""
Application configuration module for the Computer Price Prediction System.

This module defines a single, centralized configuration object for the
entire backend service. All environment-dependent values (paths, API
metadata, CORS origins, runtime flags) must be declared here and nowhere
else. Other layers of the application (API routes, ML loader/predictor,
services) must depend on `Settings` via `get_settings()` rather than
reading environment variables or constructing filesystem paths directly.

Design notes
------------
- Uses `pydantic-settings` for type-safe, validated configuration loaded
  from environment variables and/or a `.env` file.
- Uses `pathlib.Path` exclusively for filesystem paths (no `os.path`).
- Exposes a cached singleton via `functools.lru_cache` so the settings
  object is created exactly once per process lifetime.
- This module does NOT configure the `logging` module itself — that is
  the responsibility of `app.core.logging`, which reads `log_level`
  from this module. Keeping the two separate follows single-responsibility:
  `config.py` declares *what* the settings are, `logging.py` decides
  *how* they are applied to the logging subsystem.
"""

from functools import lru_cache
from pathlib import Path
from typing import List

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Centralized application settings for the Computer Price Prediction API.

    Values are loaded from environment variables and, if present, a
    `.env` file located at the `backend/` project root. Every
    configurable aspect of the backend (API metadata, artifact
    locations, CORS policy, runtime flags) must be declared as a field
    on this class.

    Attributes
    ----------
    api_title : str
        Human-readable API title, surfaced in the OpenAPI schema.
    api_description : str
        Short description of the API, surfaced in the OpenAPI schema.
    api_version : str
        Semantic version of the API.
    api_v1_prefix : str
        URL prefix under which versioned routes (e.g. `/predict`) are
        mounted.
    environment : str
        Deployment environment identifier (e.g. "development",
        "staging", "production").
    debug : bool
        Whether the application is running in debug mode.
    log_level : str
        Logging verbosity level, consumed by `app.core.logging`.
    base_dir : Path
        Absolute path to the `backend/` directory, computed relative
        to this file. Used as the anchor for all other paths.
    artifacts_dir : Path
        Directory (relative to `base_dir`) containing serialized ML
        artifacts.
    model_filename : str
        Filename of the serialized regression model.
    preprocessor_filename : str
        Filename of the serialized preprocessing pipeline.
    cors_allow_origins : List[str]
        List of origins permitted to make cross-origin requests
        (React + TypeScript frontend dev/prod URLs).
    """

    # ------------------------------------------------------------------
    # API metadata
    # ------------------------------------------------------------------
    api_title: str = Field(
        default="Computer Price Prediction API",
        description="Title of the API, shown in OpenAPI docs.",
    )
    api_description: str = Field(
        default=(
            "Production REST API for predicting computer prices across "
            "multiple device types using a trained scikit-learn "
            "regression pipeline."
        ),
        description="Description of the API, shown in OpenAPI docs.",
    )
    api_version: str = Field(
        default="1.0.0",
        description="Semantic version of the API.",
    )
    api_v1_prefix: str = Field(
        default="/api/v1",
        description="URL prefix for version 1 of the API.",
    )

    # ------------------------------------------------------------------
    # Runtime environment
    # ------------------------------------------------------------------
    environment: str = Field(
        default="development",
        description="Deployment environment: development, staging, or production.",
    )
    debug: bool = Field(
        default=False,
        description="Enable debug mode (verbose errors, auto-reload hints).",
    )
    log_level: str = Field(
        default="INFO",
        description="Logging level consumed by app.core.logging.",
    )

    # ------------------------------------------------------------------
    # Filesystem / artifact paths
    # ------------------------------------------------------------------
    base_dir: Path = Field(
        default=Path(__file__).resolve().parents[2],
        description="Absolute path to the backend root directory.",
    )
    artifacts_dir: Path = Field(
        default=Path("artifacts"),
        description="Directory (relative to base_dir) containing ML artifacts.",
    )
    model_filename: str = Field(
        default="computer_best_model.joblib",
        description="Filename of the serialized best regression model.",
    )
    preprocessor_filename: str = Field(
        default="computer_preprocessor.joblib",
        description="Filename of the serialized preprocessing pipeline.",
    )

    # ------------------------------------------------------------------
    # CORS
    # ------------------------------------------------------------------
    cors_allow_origins: List[str] = Field(
        default=[
            "http://localhost:3000",
            "http://localhost:5173",
        ],
        description="Origins allowed to access the API (React frontend URLs).",
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
        """
        Validate that `log_level` is one of Python's standard levels.

        Parameters
        ----------
        value : str
            The raw log level string from the environment.

        Returns
        -------
        str
            The normalized (uppercase) log level.

        Raises
        ------
        ValueError
            If the provided level is not a recognized logging level.
        """
        allowed = {"DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"}
        normalized = value.upper()
        if normalized not in allowed:
            raise ValueError(
                f"Invalid log_level '{value}'. Must be one of {sorted(allowed)}."
            )
        return normalized

    @field_validator("environment")
    @classmethod
    def validate_environment(cls, value: str) -> str:
        """
        Validate that `environment` is one of the recognized deployment stages.

        Parameters
        ----------
        value : str
            The raw environment string from the environment variables.

        Returns
        -------
        str
            The normalized (lowercase) environment name.

        Raises
        ------
        ValueError
            If the provided environment is not recognized.
        """
        allowed = {"development", "staging", "production"}
        normalized = value.lower()
        if normalized not in allowed:
            raise ValueError(
                f"Invalid environment '{value}'. Must be one of {sorted(allowed)}."
            )
        return normalized

    @property
    def artifacts_path(self) -> Path:
        """
        Resolve the absolute path to the artifacts directory.

        Returns
        -------
        Path
            Absolute path to `base_dir / artifacts_dir`.
        """
        return (self.base_dir / self.artifacts_dir).resolve()

    @property
    def model_path(self) -> Path:
        """
        Resolve the absolute path to the serialized model file.

        Returns
        -------
        Path
            Absolute path to the model `.joblib` file.
        """
        return self.artifacts_path / self.model_filename

    @property
    def preprocessor_path(self) -> Path:
        """
        Resolve the absolute path to the serialized preprocessor file.

        Returns
        -------
        Path
            Absolute path to the preprocessor `.joblib` file.
        """
        return self.artifacts_path / self.preprocessor_filename

    @property
    def is_production(self) -> bool:
        """
        Determine whether the application is running in production.

        Returns
        -------
        bool
            True if `environment` is "production", False otherwise.
        """
        return self.environment == "production"


@lru_cache
def get_settings() -> Settings:
    """
    Return a cached, process-wide singleton instance of `Settings`.

    Using `lru_cache` ensures environment variables and the `.env` file
    are parsed exactly once, and that every part of the application
    (API routes, ML loader/predictor, services, startup hooks) shares
    the same configuration object. This is the only sanctioned way to
    access configuration elsewhere in the codebase.

    Returns
    -------
    Settings
        The singleton application settings instance.
    """
    return Settings()