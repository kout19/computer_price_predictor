"""
API routes for retrieving the categorical options vocabulary
(API version 1).

Exposes the exact set of categorical values seen during model
training, so the frontend never needs to hardcode or guess dropdown
vocabulary that could drift from what the trained pipeline expects.
"""

import logging

from fastapi import APIRouter, Depends, status

from app.api.dependencies import get_prediction_service
from app.schemas.options_response import CategoricalOptionsResponse
from app.services.prediction_service import PredictionService

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/options", tags=["Options"])


@router.get(
    "",
    response_model=CategoricalOptionsResponse,
    status_code=status.HTTP_200_OK,
    summary="Get valid categorical field values",
    description=(
        "Returns every categorical field's valid values, exactly as "
        "observed in the training dataset. The frontend must source "
        "all dropdown options from this endpoint rather than "
        "hardcoding them, to guarantee submitted values always match "
        "the trained model's vocabulary."
    ),
)
def get_options(
    service: PredictionService = Depends(get_prediction_service),
) -> CategoricalOptionsResponse:
    """
    Retrieve the cached categorical options vocabulary.

    Parameters
    ----------
    service : PredictionService
        Injected singleton service holding the loaded vocabulary.

    Returns
    -------
    CategoricalOptionsResponse
        Mapping of categorical field name to its valid values.

    Raises
    ------
    ModelNotLoadedError
        Propagated to the global exception handler if the service is
        not yet initialized.
    """
    logger.debug("Received request for categorical options.")
    options = service.get_options()
    return CategoricalOptionsResponse(options=options)