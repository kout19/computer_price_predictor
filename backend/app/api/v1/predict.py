"""
API routes for computer price prediction (API version 1).

This module defines only HTTP concerns: request/response wiring,
status codes, and dependency injection. All business and ML logic is
delegated entirely to `PredictionService`. Domain exceptions raised by
the service are intentionally left uncaught here — they propagate to
the centralized exception handlers registered in `app.main`.
"""

import logging

from fastapi import APIRouter, Depends, status

from app.api.dependencies import get_prediction_service
from app.schemas.request import PredictionRequest
from app.schemas.response import PredictionResponse
from app.services.prediction_service import PredictionService

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/predict", tags=["Prediction"])

@router.post(
    "",
    response_model=PredictionResponse,
    status_code=status.HTTP_200_OK,
    summary="Predict the price of a computer",
    description=(
        "Accepts a full computer specification and returns the "
        "predicted price using the trained regression pipeline."
    ),
)
def predict_price(
    payload: PredictionRequest,
    service: PredictionService = Depends(get_prediction_service),
) -> PredictionResponse:
    """
    Predict the price of a computer given its specification.

    Parameters
    ----------
    payload : PredictionRequest
        Validated computer specification submitted by the client.
    service : PredictionService
        Injected singleton service responsible for running the
        prediction pipeline.

    Returns
    -------
    PredictionResponse
        The predicted price along with prediction metadata.

    Raises
    ------
    ModelNotLoadedError
        Propagated to the global exception handler if the service is
        not yet initialized.
    FeaturePreprocessingError
        Propagated to the global exception handler if the input
        cannot be transformed.
    PredictionExecutionError
        Propagated to the global exception handler if inference fails.
    """
    logger.info("Received prediction request for device_type=%s, brand=%s",
                payload.device_type, payload.brand)

    predicted_price = service.predict_price(payload)

    return PredictionResponse(
        predicted_price=round(predicted_price, 2),
        model_version=service.model_path.stem,
    )