"""
Custom exception hierarchy for the Computer Price Prediction API.

Domain-specific exceptions allow centralized exception handlers in
`main.py` to map failures to precise HTTP status codes and consistent,
safe error payloads, while keeping internal diagnostic detail out of
client responses.
"""


class ComputerPricePredictionError(Exception):
    """
    Base class for all application-specific exceptions.

    Attributes
    ----------
    message : str
        Human-readable, client-safe error message.
    error_code : str
        Machine-readable identifier for the error category.
    """

    error_code: str = "APPLICATION_ERROR"

    def __init__(self, message: str) -> None:
        self.message = message
        super().__init__(message)


class ArtifactLoadError(ComputerPricePredictionError):
    """
    Raised when the model or preprocessor artifact fails to load from disk.
    """

    error_code = "ARTIFACT_LOAD_ERROR"


class OptionsLoadError(ComputerPricePredictionError):
    """
    Raised when the cached categorical options vocabulary (`options.json`)
    fails to load or parse.

    Distinguished from `ArtifactLoadError` because options are a JSON
    vocabulary cache, not a `.joblib` model/preprocessor artifact, and
    a missing options file should never block predictions — only the
    `/api/v1/options` endpoint depends on it.
    """

    error_code = "OPTIONS_LOAD_ERROR"


class ModelNotLoadedError(ComputerPricePredictionError):
    """
    Raised when a prediction is attempted before artifacts are loaded.
    """

    error_code = "MODEL_NOT_LOADED"


class FeaturePreprocessingError(ComputerPricePredictionError):
    """
    Raised when validated request data fails to be transformed by the
    preprocessing pipeline.
    """

    error_code = "FEATURE_PREPROCESSING_ERROR"


class PredictionExecutionError(ComputerPricePredictionError):
    """
    Raised when the underlying regression model fails during inference.
    """

    error_code = "PREDICTION_EXECUTION_ERROR"