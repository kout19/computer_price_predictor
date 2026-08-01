"""
Prediction orchestration service for the Computer Price Prediction System.

This module composes `app.ml.loader.ArtifactLoader`,
`app.ml.options_loader.CategoricalOptionsLoader`, and
`app.ml.predictor.Predictor` into a single cohesive service consumed by
the API layer. It contains no direct file I/O and no direct
DataFrame/model manipulation — those responsibilities are delegated to
the ML layer. The service's sole job is orchestration and providing a
clean, HTTP-agnostic interface for the API routes to depend on.
"""

import logging
from pathlib import Path
from typing import Dict, List

from app.ml.loader import ArtifactLoader
from app.ml.options_loader import CategoricalOptionsLoader
from app.ml.predictor import Predictor
from app.schemas.request import PredictionRequest
from app.utils.exceptions import ModelNotLoadedError

logger = logging.getLogger(__name__)


class PredictionService:
    """
    Coordinates artifact loading, options loading, and price prediction.

    An instance of this class is constructed once at application
    startup and stored on `app.state`, then injected into route
    handlers via FastAPI's dependency injection. This guarantees the
    model, preprocessor, and categorical vocabulary are all loaded
    into memory exactly once per process, never per request.

    Attributes
    ----------
    preprocessor_path : Path
        Absolute path to the serialized preprocessing pipeline.
    model_path : Path
        Absolute path to the serialized regression model.
    options_path : Path
        Absolute path to the cached categorical options vocabulary.
    """

    def __init__(
        self, preprocessor_path: Path, model_path: Path, options_path: Path
    ) -> None:
        """
        Initialize the service with artifact paths, without loading them.

        Parameters
        ----------
        preprocessor_path : Path
            Absolute path to the serialized preprocessor file.
        model_path : Path
            Absolute path to the serialized regression model file.
        options_path : Path
            Absolute path to the categorical options JSON file.
        """
        self.preprocessor_path = preprocessor_path
        self.model_path = model_path
        self.options_path = options_path

        self._loader = ArtifactLoader(
            preprocessor_path=preprocessor_path, model_path=model_path
        )
        self._options_loader = CategoricalOptionsLoader(options_path=options_path)
        self._predictor: Predictor = Predictor(preprocessor=None, model=None)

    def initialize(self) -> None:
        """
        Load ML artifacts and the categorical vocabulary, and construct
        the internal predictor.

        Must be called exactly once during application startup, before
        any call to `predict_price` or `get_options`. Typically invoked
        from the FastAPI lifespan context manager in `app.main`.

        Raises
        ------
        ArtifactLoadError
            If the model or preprocessor fails to load from disk.
        OptionsLoadError
            If the categorical options vocabulary fails to load or parse.
        """
        self._loader.load()
        self._options_loader.load()
        self._predictor = Predictor(
            preprocessor=self._loader.preprocessor, model=self._loader.model
        )
        logger.info("PredictionService initialized and ready to serve requests.")

    @property
    def is_ready(self) -> bool:
        """
        Whether the service is ready to serve predictions.

        Returns
        -------
        bool
            True if both the model and preprocessor are loaded.
        """
        return self._predictor.is_ready

    @property
    def model_loaded(self) -> bool:
        """Whether the regression model has been loaded."""
        return self._loader.model is not None

    @property
    def preprocessor_loaded(self) -> bool:
        """Whether the preprocessing pipeline has been loaded."""
        return self._loader.preprocessor is not None

    @property
    def options_loaded(self) -> bool:
        """Whether the categorical options vocabulary has been loaded."""
        return self._options_loader.is_loaded

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
        features = request.to_feature_dict()
        logger.debug("Dispatching prediction for features: %s", features)
        return self._predictor.predict(features)

    def get_options(self) -> Dict[str, List[str]]:
        """
        Retrieve the cached categorical options vocabulary.

        Returns
        -------
        Dict[str, List[str]]
            Mapping of categorical field name to its list of valid,
            training-time values.

        Raises
        ------
        ModelNotLoadedError
            If called before `initialize()` has completed successfully,
            i.e. the options vocabulary has not yet been loaded.
        """
        if not self._options_loader.is_loaded or self._options_loader.options is None:
            message = "Categorical options requested before the service was initialized."
            logger.error(message)
            raise ModelNotLoadedError(message)

        return self._options_loader.options