"""
Logging configuration for the Computer Price Prediction API.

This module is solely responsible for *how* the application's logging
subsystem is configured (handlers, formatters, levels). It reads the
desired verbosity from `app.core.config.Settings` but does not declare
or own that value itself — configuration values live in `config.py`,
wiring lives here.
"""

import logging
import sys

from app.core.config import Settings

_LOG_FORMAT = "%(asctime)s | %(levelname)-8s | %(name)s | %(message)s"
_DATE_FORMAT = "%Y-%m-%d %H:%M:%S"


def configure_logging(settings: Settings) -> None:
    """
    Configure application-wide logging handlers and formatting.

    This function is idempotent: calling it multiple times will not
    result in duplicate log lines, since it clears any previously
    attached handlers on the root logger before reconfiguring.

    Parameters
    ----------
    settings : Settings
        Application settings, used to determine the configured log
        level (`settings.log_level`).

    Returns
    -------
    None
    """
    root_logger = logging.getLogger()
    root_logger.setLevel(settings.log_level)

    # Remove any pre-existing handlers to avoid duplicate log lines
    # if configure_logging() is invoked more than once (e.g. in tests).
    for handler in list(root_logger.handlers):
        root_logger.removeHandler(handler)

    stream_handler = logging.StreamHandler(stream=sys.stdout)
    stream_handler.setFormatter(logging.Formatter(fmt=_LOG_FORMAT, datefmt=_DATE_FORMAT))
    root_logger.addHandler(stream_handler)

    # Reduce noise from third-party libraries unless explicitly debugging.
    if settings.log_level != "DEBUG":
        logging.getLogger("uvicorn.access").setLevel(logging.WARNING)
        logging.getLogger("multipart").setLevel(logging.WARNING)

    logging.getLogger(__name__).info(
        "Logging configured at level '%s' for environment '%s'.",
        settings.log_level,
        settings.environment,
    )