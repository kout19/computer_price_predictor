"""
Prediction orchestration service for the Computer Price Prediction System.

This module composes `app.ml.loader.ArtifactLoader` and
`app.ml.predictor.Predictor` into a single cohesive service consumed
by the API layer. It contains no direct file I/O and no direct
DataFrame/model manipulation — those responsibilities are delegated to
the ML layer. The service's sole job is orchestration and providing a
clean, HTTP-agnostic interface for the API routes to depend on.
"""

import logging
from pathlib import Path

from app.ml.loader import ArtifactLoader
from app.ml.predictor import Predictor
from app.schemas.request import PredictionRequest

logger = logging.getLogger(__name__)


class PredictionService:
    """
    Coordinates artifact loading and price prediction for the API layer.

    An instance of this class is constructed once at application
    startup and stored on `app.state` (see `app.main`), then injected
    into route handlers via FastAPI's dependency injection. This
    guarantees the underlying model and preprocessor are loaded into
    memory exactly once per process, never per request.

    Attributes
    ----------
    preprocessor_path : Path
        Absolute path to the serialized preprocessing pipeline.
    model_path : Path
        Absolute path to the serialized regression model.
    """

    def __init__(self, preprocessor_path: Path, model_path: Path) -> None:
        """
        Initialize the service with artifact paths, without loading them.

        Parameters
        ----------
        preprocessor_path : Path
            Absolute path to the serialized preprocessor file.
        model_path : Path
            Absolute path to the serialized regression model file.
        """
        self.preprocessor_path = preprocessor_path
        self.model_path = model_path
        self._loader = ArtifactLoader(
            preprocessor_path=preprocessor_path, model_path=model_path
        )
        self._predictor: Predictor = Predictor(preprocessor=None, model=None)

    def initialize(self) -> None:
        """
        Load ML artifacts and construct the internal predictor.

        Must be called exactly once during application startup, before
        any call to `predict_price`. Typically invoked from the
        FastAPI lifespan context manager in `app.main`.

        Raises
        ------
        ArtifactLoadError
            If either artifact fails to load from disk.
        """
        self._loader.load()
        self._predictor = Predictor(
            preprocessor=self._loader.preprocessor, model=self._loader.model
        )
        logger.info("PredictionService initialized and ready to serve predictions.")

    @property
    def is_ready(self) -> bool:
        """
        Whether the service is fully initialized and ready to predict.

        Returns
        -------
        bool
            True if both artifacts are loaded and the predictor is ready.
        """
        return self._predictor.is_ready

    @property
    def model_loaded(self) -> bool:
        """
        Whether the regression model has been loaded.

        Returns
        -------
        bool
            True if the underlying model artifact is loaded.
        """
        return self._loader.model is not None

    @property
    def preprocessor_loaded(self) -> bool:
        """
        Whether the preprocessing pipeline has been loaded.

        Returns
        -------
        bool
            True if the underlying preprocessor artifact is loaded.
        """
        return self._loader.preprocessor is not None

    def predict_price(self, request: PredictionRequest) -> float:
        """
        Predict the price for a single validated computer specification.

        Parameters
        ----------
        request : PredictionRequest
            A validated request payload received from the API layer.

        Returns
        -------
        float
            The predicted price.

        Raises
        ------
        ModelNotLoadedError
            If called before `initialize()` has completed successfully.
        FeaturePreprocessingError
            If the preprocessing pipeline cannot transform the input.
        PredictionExecutionError
            If the model fails during inference.
        """
        print("=" * 80)
        print("PREDICTION SERVICE")
        print("Request object:")
        print(request)
        print()

        features = request.to_feature_dict()

        print("Feature dictionary:")
        for k, v in features.items():
            print(f"{k:25} {v!r} ({type(v).__name__})")
        print("=" * 80)

        return self._predictor.predict(features)