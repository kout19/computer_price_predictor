"""
ML artifact loading for the Computer Price Prediction System.

This module is exclusively responsible for reading serialized
artifacts (the preprocessing pipeline and the regression model) from
disk. It has no knowledge of feature engineering, DataFrames, or
inference — see `app.ml.predictor` for that. Isolating I/O this way
means storage location/strategy can change (e.g. local disk to S3)
without touching prediction logic.
"""

import logging
from pathlib import Path
from typing import Any

import joblib

from app.utils.exceptions import ArtifactLoadError

logger = logging.getLogger(__name__)


class ArtifactLoader:
    """
    Loads and holds deserialized ML artifacts from disk.

    Instances are intended to be constructed once and reused for the
    lifetime of the application process. Artifacts are not loaded at
    construction time; `load()` must be called explicitly (typically
    from the FastAPI startup lifespan) so that loading is observable
    and logged as a distinct startup step.

    Attributes
    ----------
    preprocessor_path : Path
        Absolute path to the serialized preprocessing pipeline.
    model_path : Path
        Absolute path to the serialized regression model.
    """

    def __init__(self, preprocessor_path: Path, model_path: Path) -> None:
        """
        Initialize the loader with artifact paths, without loading them.

        Parameters
        ----------
        preprocessor_path : Path
            Absolute path to the serialized preprocessor file.
        model_path : Path
            Absolute path to the serialized regression model file.
        """
        self.preprocessor_path = preprocessor_path
        self.model_path = model_path
        self._preprocessor: Any = None
        self._model: Any = None

    @property
    def preprocessor(self) -> Any:
        """
        The deserialized preprocessing pipeline.

        Returns
        -------
        Any
            The loaded preprocessor object, or None if not yet loaded.
        """
        return self._preprocessor

    @property
    def model(self) -> Any:
        """
        The deserialized regression model.

        Returns
        -------
        Any
            The loaded model object, or None if not yet loaded.
        """
        return self._model

    @property
    def is_loaded(self) -> bool:
        """
        Whether both artifacts have been successfully loaded.

        Returns
        -------
        bool
            True if both the preprocessor and model are loaded.
        """
        return self._preprocessor is not None and self._model is not None

    def load(self) -> None:
        """
        Load both artifacts from disk into memory.

        Intended to be called exactly once during application startup.

        Prints a detailed loading report to stdout (useful for debugging)
        and logs the result via the standard logging system.

        Raises
        ------
        ArtifactLoadError
            If either artifact file is missing, unreadable, or fails
            to deserialize.
        """
        # --- Detailed debug output ---
        print("=" * 80)
        print("Loading Preprocessor From:")
        print(self.preprocessor_path.resolve())

        print("\nLoading Model From:")
        print(self.model_path.resolve())
        print("=" * 80)

        # --- Load artifacts ---
        self._preprocessor = self._load_joblib(self.preprocessor_path, "preprocessor")
        print("\n========== PREPROCESSOR ==========")
        self._model = self._load_joblib(self.model_path, "model")
        for name, transformer, columns in self._preprocessor.transformers_:
            
            print(f"\n{name}")
            print(columns)

        # --- Confirmation ---
        print("\n✅ Loaded Successfully!")
        logger.info(
            "ML artifacts loaded successfully (preprocessor=%s, model=%s).",
            self.preprocessor_path.name,
            self.model_path.name,
        )

    @staticmethod
    def _load_joblib(path: Path, artifact_name: str) -> Any:
        """
        Load a single joblib artifact from disk with error handling.

        Parameters
        ----------
        path : Path
            Absolute path to the `.joblib` file.
        artifact_name : str
            Human-readable label used in log/error messages.

        Returns
        -------
        Any
            The deserialized Python object.

        Raises
        ------
        ArtifactLoadError
            If the file does not exist or fails to deserialize.
        """
        if not path.exists():
            message = f"{artifact_name.capitalize()} artifact not found at '{path}'."
            logger.error(message)
            raise ArtifactLoadError(message)

        try:
            artifact = joblib.load(path)
        except Exception as exc:  # noqa: BLE001 - intentional broad catch at I/O boundary
            message = f"Failed to load {artifact_name} artifact from '{path}'."
            logger.exception(message)
            raise ArtifactLoadError(message) from exc

        logger.debug("%s artifact loaded from '%s'.", artifact_name.capitalize(), path)
        return artifact
    
        for name, transformer, columns in self._preprocessor.transformers_:
                
            print("\n", name)
            print(columns)
