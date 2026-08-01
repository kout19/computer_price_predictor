# """
# Unit tests for `PredictionService`, `ArtifactLoader`, and `Predictor`.

# These tests use lightweight stub objects in place of real scikit-learn
# artifacts, so they run fast and require no `.joblib` files on disk.
# This is possible only because the ML layer is cleanly separated from
# I/O and HTTP concerns (see app/ml/loader.py and app/ml/predictor.py).
# """

# from pathlib import Path
# from typing import Any, List

# import pytest

# from app.ml.predictor import Predictor
# from app.utils.exceptions import (
#     FeaturePreprocessingError,
#     ModelNotLoadedError,
#     PredictionExecutionError,
# )


# class _StubPreprocessor:
#     """A minimal stand-in for a fitted scikit-learn ColumnTransformer."""

#     def __init__(self, should_fail: bool = False) -> None:
#         self.should_fail = should_fail

#     def transform(self, df: Any) -> list[list[float]]:
#         """Return a fixed transformed representation, or raise on demand."""
#         if self.should_fail:
#             raise ValueError("Simulated preprocessing failure.")
#         return [[1.0, 2.0, 3.0]]


# class _StubModel:
#     """A minimal stand-in for a fitted scikit-learn regressor."""

#     def __init__(self, fixed_prediction: float = 999.99, should_fail: bool = False) -> None:
#         self.fixed_prediction = fixed_prediction
#         self.should_fail = should_fail

#     def predict(self, X: Any) -> list[float]:
#         """Return a fixed prediction, or raise on demand."""
#         if self.should_fail:
#             raise RuntimeError("Simulated inference failure.")
#         return [self.fixed_prediction]


# VALID_FEATURES = {
#     "device_type": "Laptop",
#     "brand": "Dell",
#     "release_year": 2024,
#     "os": "Windows 11",
#     "form_factor": "Slim",
#     "cpu_brand": "Intel",
#     "cpu_tier": "i7",
#     "cpu_cores": 14,
#     "cpu_threads": 20,
#     "cpu_base_ghz": 2.1,
#     "cpu_boost_ghz": 4.8,
#     "cpu_series": "Core Ultra",
#     "cpu_generation": "13th Gen",
#     "cpu_suffix": "H",
#     "gpu_brand": "Nvidia",
#     "gpu_tier": "RTX 4060",
#     "gpu_family": "Ada Lovelace",
#     "gpu_generation": "40 Series",
#     "gpu_suffix": None,
#     "vram_gb": 8.0,
#     "ram_gb": 16,
#     "storage_type": "NVMe SSD",
#     "storage_gb": 512,
#     "storage_drive_count": 1,
#     "display_type": "IPS",
#     "display_size_in": 14.0,
#     "refresh_hz": 120,
#     "battery_wh": 63.0,
#     "charger_watts": 100.0,
#     "psu_watts": None,
#     "wifi": "Wi-Fi 6E",
#     "bluetooth": "5.3",
#     "weight_kg": 1.6,
#     "warranty_months": 12,
#     "resolution_width": 1920,
#     "resolution_height": 1200,
#     "megapixels": 1.0,
# }


# class TestPredictor:
#     """Tests for `app.ml.predictor.Predictor` in isolation."""

#     def test_predict_returns_float_on_success(self) -> None:
#         """A ready predictor should return a plain float prediction."""
#         predictor = Predictor(
#             preprocessor=_StubPreprocessor(), model=_StubModel(fixed_prediction=54999.0)
#         )

#         result = predictor.predict(VALID_FEATURES)

#         assert isinstance(result, float)
#         assert result == pytest.approx(54999.0)

#     def test_predict_raises_when_not_ready(self) -> None:
#         """Calling predict before artifacts are set must raise ModelNotLoadedError."""
#         predictor = Predictor(preprocessor=None, model=None)

#         with pytest.raises(ModelNotLoadedError):
#             predictor.predict(VALID_FEATURES)

#     def test_predict_raises_on_preprocessing_failure(self) -> None:
#         """A failing preprocessor must surface as FeaturePreprocessingError."""
#         predictor = Predictor(
#             preprocessor=_StubPreprocessor(should_fail=True), model=_StubModel()
#         )

#         with pytest.raises(FeaturePreprocessingError):
#             predictor.predict(VALID_FEATURES)

#     def test_predict_raises_on_inference_failure(self) -> None:
#         """A failing model must surface as PredictionExecutionError."""
#         predictor = Predictor(
#             preprocessor=_StubPreprocessor(), model=_StubModel(should_fail=True)
#         )

#         with pytest.raises(PredictionExecutionError):
#             predictor.predict(VALID_FEATURES)

#     def test_is_ready_reflects_artifact_presence(self) -> None:
#         """is_ready must be False until both preprocessor and model are set."""
#         not_ready = Predictor(preprocessor=None, model=_StubModel())
#         ready = Predictor(preprocessor=_StubPreprocessor(), model=_StubModel())

#         assert not_ready.is_ready is False
#         assert ready.is_ready is True


# class TestArtifactLoaderFailureModes:
#     """Tests for `app.ml.loader.ArtifactLoader` failure handling."""

#     def test_load_raises_when_file_missing(self, tmp_path: Path) -> None:
#         """Loading a non-existent artifact path must raise ArtifactLoadError."""
#         from app.ml.loader import ArtifactLoader
#         from app.utils.exceptions import ArtifactLoadError

#         loader = ArtifactLoader(
#             preprocessor_path=tmp_path / "missing_preprocessor.joblib",
#             model_path=tmp_path / "missing_model.joblib",
#         )

#         with pytest.raises(ArtifactLoadError):
#             loader.load()

#         assert loader.is_loaded is False