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
        """
        Initialize the exception.

        Parameters
        ----------
        message : str
            Human-readable, client-safe error message.
        """
        self.message = message
        super().__init__(message)


class ArtifactLoadError(ComputerPricePredictionError):
    """
    Raised when the model or preprocessor artifact fails to load from disk.

    Typically indicates a missing file, a corrupted `.joblib` file, or
    a scikit-learn version mismatch between training and serving
    environments.
    """

    error_code = "ARTIFACT_LOAD_ERROR"


class ModelNotLoadedError(ComputerPricePredictionError):
    """
    Raised when a prediction is attempted before artifacts are loaded.

    Should only occur if the predictor is used outside the normal
    FastAPI application lifespan (e.g. a misconfigured test).
    """

    error_code = "MODEL_NOT_LOADED"


class FeaturePreprocessingError(ComputerPricePredictionError):
    """
    Raised when validated request data fails to be transformed by the
    preprocessing pipeline (e.g. unseen category values, column
    mismatch against the fitted pipeline).
    """

    error_code = "FEATURE_PREPROCESSING_ERROR"


class PredictionExecutionError(ComputerPricePredictionError):
    """
    Raised when the underlying regression model fails during
    inference on already-preprocessed features.
    """

    error_code = "PREDICTION_EXECUTION_ERROR"