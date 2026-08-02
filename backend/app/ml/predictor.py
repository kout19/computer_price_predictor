"""
ML inference logic for the Computer Price Prediction System.

This module is exclusively responsible for turning validated feature
data into a price prediction, given an already-loaded preprocessor
and model. It has no knowledge of file paths, joblib, or disk I/O —
see `app.ml.loader` for that. This separation follows the Single
Responsibility Principle: loading and inference are distinct concerns
with distinct failure modes.
"""

import logging
from typing import Any, Dict

import pandas as pd

from app.utils.exceptions import (
    FeaturePreprocessingError,
    ModelNotLoadedError,
    PredictionExecutionError,
)

logger = logging.getLogger(__name__)


class Predictor:
    """
    Executes price predictions using a preprocessor and regression model.

    Instances are constructed with references to already-deserialized
    artifacts (typically supplied by `ArtifactLoader`). This class
    performs no I/O of its own, which makes it trivial to unit test
    with mock/stub preprocessor and model objects.

    Parameters
    ----------
    preprocessor : Any
        A fitted scikit-learn-compatible transformer exposing
        `.transform(DataFrame) -> array-like`.
    model : Any
        A fitted scikit-learn-compatible regressor exposing
        `.predict(array-like) -> array-like`.
    """

    def __init__(self, preprocessor: Any, model: Any) -> None:
        """
        Initialize the predictor with loaded artifacts.

        Parameters
        ----------
        preprocessor : Any
            The fitted preprocessing pipeline. May be None if artifacts
            have not yet been loaded; `predict()` will raise
            `ModelNotLoadedError` in that case.
        model : Any
            The fitted regression model. May be None if artifacts have
            not yet been loaded.
        """
        self._preprocessor = preprocessor
        self._model = model

    @property
    def is_ready(self) -> bool:
        """
        Whether the predictor has both a preprocessor and model available.

        Returns
        -------
        bool
            True if both artifacts are set and non-None.
        """
        return self._preprocessor is not None and self._model is not None

    def predict(self, features: Dict[str, Any]) -> float:
        """
        Predict the computer price for a single set of input features.

        Parameters
        ----------
        features : Dict[str, Any]
            Feature dictionary, typically produced by
            `PredictionRequest.to_feature_dict()`, whose keys match the
            columns expected by the fitted preprocessing pipeline.

        Returns
        -------
        float
            The predicted computer price.

        Raises
        ------
        ModelNotLoadedError
            If called before the preprocessor and model are both set.
        FeaturePreprocessingError
            If the input features cannot be transformed by the
            preprocessing pipeline.
        PredictionExecutionError
            If the model fails during inference on preprocessed
            features, or returns an unexpected/empty result.
        """
        if not self.is_ready:
            message = "Prediction requested before model/preprocessor were available."
            logger.error(message)
            raise ModelNotLoadedError(message)

        input_df = self._to_dataframe(features)
        transformed = self._transform(input_df)
        prediction = self._infer(transformed)
        logger.info("Prediction generated successfully: %.2f", prediction)
        return prediction

    @staticmethod
    def _to_dataframe(features):

        
        df = pd.DataFrame([features])

        logger.info(df)

        logger.info(df.columns.tolist())

        return df

    def _transform(self, input_df: pd.DataFrame):
        """
        Apply preprocessing exactly as done during training.
        """

        categorical_columns = [
            "device_type",
            "brand",
            "os",
            "form_factor",
            "cpu_brand",
            "cpu_series",
            "cpu_suffix",
            "gpu_brand",
            "gpu_family",
            "gpu_generation",
            "gpu_suffix",
            "storage_type",
            "display_type",
            "wifi",
            
        ]

        numeric_columns = [
            "release_year",
            "cpu_cores",
             "cpu_tier",
             "gpu_tier",
             "bluetooth",
            "cpu_threads",
            "cpu_base_ghz",
            "cpu_boost_ghz",
            "cpu_generation",
            "vram_gb",
            "ram_gb",
            "storage_gb",
            "storage_drive_count",
            "display_size_in",
            "refresh_hz",
            "battery_wh",
            "charger_watts",
            "psu_watts",
            "weight_kg",
            "warranty_months",
            "resolution_width",
            "resolution_height",
            "megapixels",
        ]

        try:

            # ---------- categorical ----------
            for col in categorical_columns:
                if col in input_df.columns:
                    input_df[col] = (
                        input_df[col]
                        .fillna("Unknown")
                        .astype(str)
                    )

            # ---------- numeric ----------
            for col in numeric_columns:
                if col in input_df.columns:
                    input_df[col] = pd.to_numeric(
                        input_df[col],
                        errors="coerce"
                    )

            logger.info("Prediction DataFrame")
            logger.info(input_df.dtypes)

            transformed = self._preprocessor.transform(input_df)
            return transformed

        except Exception as exc:

            logger.exception(exc)

            raise FeaturePreprocessingError(
                "Failed to preprocess input features."
            ) from exc
    def _infer(self, transformed_features: Any) -> float:
        """
        Execute the regression model on preprocessed features.

        Parameters
        ----------
        transformed_features : Any
            Output of the preprocessing pipeline's `transform` call.

        Returns
        -------
        float
            The predicted price as a plain Python float.

        Raises
        ------
        PredictionExecutionError
            If the model raises during `predict`, or returns an
            unexpected/empty result.
        """
        try:
            prediction = self._model.predict(transformed_features)
        except Exception as exc:  # noqa: BLE001 - boundary with third-party model
            message = "Model failed to generate a prediction."
            logger.exception(message)
            raise PredictionExecutionError(message) from exc

        if prediction is None or len(prediction) == 0:
            message = "Model returned an empty prediction result."
            logger.error(message)
            raise PredictionExecutionError(message)

        return float(prediction[0])