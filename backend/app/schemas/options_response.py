"""
Response schema for the categorical options endpoint.
"""

from typing import Dict, List

from pydantic import BaseModel, Field


class CategoricalOptionsResponse(BaseModel):
    """
    Response payload for `GET /api/v1/options`.

    Attributes
    ----------
    options : Dict[str, List[str]]
        Mapping of each categorical field name (e.g. "device_type",
        "brand", "cpu_tier") to the sorted list of unique values that
        field held in the training dataset. The frontend must source
        all dropdown choices exclusively from this payload to
        guarantee the submitted vocabulary always matches what the
        model was trained on.
    """

    options: Dict[str, List[str]] = Field(
        ...,
        description=(
            "Mapping of categorical field name to its list of valid "
            "training-time values."
        ),
    )