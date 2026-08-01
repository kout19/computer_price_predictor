"""
Application entrypoint for the Computer Price Prediction API.

This module is the composition root: it wires together configuration,
logging, the ML service lifecycle, CORS, exception handling, and
route registration. No business or ML logic lives here — this file
only assembles already-defined components.
"""

import logging
from contextlib import asynccontextmanager
from typing import AsyncIterator

from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.v1 import predict as predict_v1
from app.core.config import get_settings
from app.core.logging import configure_logging
from app.schemas.response import ErrorResponse, HealthResponse, RootResponse
from app.services.prediction_service import PredictionService
from app.utils.exceptions import (
    ArtifactLoadError,
    ComputerPricePredictionError,
    FeaturePreprocessingError,
    ModelNotLoadedError,
    PredictionExecutionError,
)

settings = get_settings()
configure_logging(settings)

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    """
    Manage application startup and shutdown.

    On startup, constructs a single `PredictionService`, loads the ML
    artifacts exactly once, and stores the service on `app.state` so
    it can be injected into route handlers for the lifetime of the
    process. On shutdown, releases the reference.

    Parameters
    ----------
    app : FastAPI
        The FastAPI application instance.

    Yields
    ------
    None
    """
    logger.info("Starting up '%s' (env=%s)...", settings.api_title, settings.environment)

    prediction_service = PredictionService(
        preprocessor_path=settings.preprocessor_path,
        model_path=settings.model_path,
    )
    prediction_service.initialize()
    app.state.prediction_service = prediction_service

    logger.info("Startup complete. Service is ready to accept requests.")
    yield

    logger.info("Shutting down '%s'.", settings.api_title)
    app.state.prediction_service = None


app = FastAPI(
    title=settings.api_title,
    description=settings.api_description,
    version=settings.api_version,
    lifespan=lifespan,
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ----------------------------------------------------------------------
# Centralized exception handlers
# ----------------------------------------------------------------------

@app.exception_handler(ArtifactLoadError)
async def handle_artifact_load_error(request: Request, exc: ArtifactLoadError) -> JSONResponse:
    """
    Handle failures to load ML artifacts from disk.

    Returns HTTP 503, since this indicates the service is not
    correctly deployed/configured rather than a client error.
    """
    logger.error("ArtifactLoadError: %s", exc.message)
    return JSONResponse(
        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
        content=ErrorResponse(error_code=exc.error_code, message=exc.message).model_dump(mode="json"),
    )


@app.exception_handler(ModelNotLoadedError)
async def handle_model_not_loaded_error(request: Request, exc: ModelNotLoadedError) -> JSONResponse:
    """
    Handle prediction attempts made before the model finished loading.

    Returns HTTP 503, signaling the client should retry shortly.
    """
    logger.error("ModelNotLoadedError: %s", exc.message)
    return JSONResponse(
        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
        content=ErrorResponse(error_code=exc.error_code, message=exc.message).model_dump(mode="json"),
    )


@app.exception_handler(FeaturePreprocessingError)
async def handle_feature_preprocessing_error(
    request: Request, exc: FeaturePreprocessingError
) -> JSONResponse:
    """
    Handle failures while transforming validated input features.

    Returns HTTP 422, since this typically indicates input values
    (though individually valid) fall outside what the fitted pipeline
    can handle (e.g. an unseen category).
    """
    logger.warning("FeaturePreprocessingError: %s", exc.message)
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content=ErrorResponse(error_code=exc.error_code, message=exc.message).model_dump(mode="json"),
    )


@app.exception_handler(PredictionExecutionError)
async def handle_prediction_execution_error(
    request: Request, exc: PredictionExecutionError
) -> JSONResponse:
    """
    Handle failures during model inference on preprocessed features.

    Returns HTTP 500, since this indicates an unexpected internal
    failure rather than a client input problem.
    """
    logger.error("PredictionExecutionError: %s", exc.message)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content=ErrorResponse(error_code=exc.error_code, message=exc.message).model_dump(mode="json"),
    )


@app.exception_handler(ComputerPricePredictionError)
async def handle_generic_application_error(
    request: Request, exc: ComputerPricePredictionError
) -> JSONResponse:
    """
    Catch-all handler for any unspecialized domain exception.

    Returns HTTP 500 as a safe default for application errors not
    covered by a more specific handler above.
    """
    logger.error("ComputerPricePredictionError: %s", exc.message)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content=ErrorResponse(error_code=exc.error_code, message=exc.message).model_dump(mode="json"),
    )


@app.exception_handler(Exception)
async def handle_unexpected_error(request: Request, exc: Exception) -> JSONResponse:
    """
    Catch-all handler for any exception not otherwise handled.

    Ensures the API never leaks a raw stack trace or unstructured
    error to the client, regardless of failure origin.
    """
    logger.exception("Unhandled exception while processing request: %s", request.url)
    details = None if settings.is_production else str(exc)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content=ErrorResponse(
            error_code="INTERNAL_SERVER_ERROR",
            message="An unexpected error occurred while processing the request.",
            details=details,
        ).model_dump(mode="json"),
    )


# ----------------------------------------------------------------------
# Root-level routes
# ----------------------------------------------------------------------

@app.get(
    "/",
    response_model=RootResponse,
    status_code=status.HTTP_200_OK,
    tags=["Meta"],
    summary="API root",
)
async def read_root() -> RootResponse:
    """
    Return basic API metadata.

    Returns
    -------
    RootResponse
        API name, version, and documentation URL.
    """
    return RootResponse(name=settings.api_title, version=settings.api_version, docs_url="/docs")


@app.get(
    "/health",
    response_model=HealthResponse,
    status_code=status.HTTP_200_OK,
    tags=["Meta"],
    summary="Service health check",
)
async def health_check(request: Request) -> HealthResponse:
    """
    Report the current health of the service and its ML dependencies.

    Parameters
    ----------
    request : Request
        The incoming request, used to access the prediction service
        stored on `app.state`.

    Returns
    -------
    HealthResponse
        Current status, artifact load state, and environment.
    """
    service: PredictionService = request.app.state.prediction_service
    is_healthy = service is not None and service.is_ready

    return HealthResponse(
        status="ok" if is_healthy else "degraded",
        model_loaded=bool(service and service.model_loaded),
        preprocessor_loaded=bool(service and service.preprocessor_loaded),
        environment=settings.environment,
    )


# ----------------------------------------------------------------------
# Route registration
# ----------------------------------------------------------------------

app.include_router(predict_v1.router, prefix=settings.api_v1_prefix)