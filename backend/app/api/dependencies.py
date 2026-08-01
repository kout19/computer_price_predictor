"""
FastAPI dependency providers for the Computer Price Prediction API.

This module is the single place responsible for wiring dependencies
(such as the `PredictionService` singleton) into route handlers via
FastAPI's `Depends` mechanism. Route modules must never access
`request.app.state` directly — they depend on functions defined here.
"""

from fastapi import Request

from app.services.prediction_service import PredictionService


def get_prediction_service(request: Request) -> PredictionService:
    """
    Retrieve the application-wide `PredictionService` singleton.

    The service instance is created once during the application's
    startup lifespan (see `app.main.lifespan`) and stored on
    `app.state.prediction_service`. This function simply exposes that
    singleton to route handlers via dependency injection.

    Parameters
    ----------
    request : Request
        The incoming FastAPI request, used to access `app.state`.

    Returns
    -------
    PredictionService
        The shared, already-initialized prediction service instance.
    """
    return request.app.state.prediction_service