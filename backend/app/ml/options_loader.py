"""
Categorical options vocabulary loading for the Computer Price
Prediction System.

This module is exclusively responsible for reading the cached
categorical vocabulary (`options.json`) from disk — the exact set of
unique values seen per categorical column during model training. It
has no knowledge of the model or preprocessor; see `app.ml.loader`
for those. Isolating this here means the frontend can always request
the precise vocabulary the model was trained on via `/api/v1/options`,
eliminating drift between UI dropdowns and backend validation.
"""

import json
import logging
from pathlib import Path
from typing import Dict, List

from app.utils.exceptions import OptionsLoadError

logger = logging.getLogger(__name__)


class CategoricalOptionsLoader:
    """
    Loads and holds the cached categorical options vocabulary from disk.

    The underlying JSON file is expected to be a flat object mapping
    each categorical feature name to the sorted list of unique string
    values observed for that feature in the training DataFrame, e.g.:

        {
          "device_type": ["AIO", "Desktop", "Laptop", "Tablet", "Workstation"],
          "brand": ["Acer", "Apple", "Asus", ...],
          ...
        }

    Attributes
    ----------
    options_path : Path
        Absolute path to the `options.json` artifact.
    """

    def __init__(self, options_path: Path) -> None:
        """
        Initialize the loader with the options file path, without loading it.

        Parameters
        ----------
        options_path : Path
            Absolute path to the `options.json` file.
        """
        self.options_path = options_path
        self._options: Dict[str, List[str]] | None = None

    @property
    def options(self) -> Dict[str, List[str]] | None:
        """
        The loaded categorical options vocabulary.

        Returns
        -------
        Dict[str, List[str]] | None
            Mapping of field name to its list of unique training
            values, or None if not yet loaded.
        """
        return self._options

    @property
    def is_loaded(self) -> bool:
        """
        Whether the options vocabulary has been successfully loaded.

        Returns
        -------
        bool
            True if `options` is populated.
        """
        return self._options is not None

    def load(self) -> None:
        """
        Load the categorical options vocabulary from disk into memory.

        Intended to be called exactly once during application startup,
        alongside `ArtifactLoader.load()`.

        Raises
        ------
        OptionsLoadError
            If the file is missing, unreadable, not valid JSON, or does
            not deserialize into a top-level JSON object.
        """
        if not self.options_path.exists():
            message = f"Categorical options artifact not found at '{self.options_path}'."
            logger.error(message)
            raise OptionsLoadError(message)

        try:
            with self.options_path.open("r", encoding="utf-8") as file_handle:
                data = json.load(file_handle)
        except (OSError, json.JSONDecodeError) as exc:
            message = f"Failed to parse categorical options artifact at '{self.options_path}'."
            logger.exception(message)
            raise OptionsLoadError(message) from exc

        if not isinstance(data, dict):
            message = "Categorical options artifact must be a JSON object mapping field names to value lists."
            logger.error(message)
            raise OptionsLoadError(message)

        self._options = data
        logger.info(
            "Categorical options loaded successfully (%d fields) from '%s'.",
            len(data),
            self.options_path.name,
        )