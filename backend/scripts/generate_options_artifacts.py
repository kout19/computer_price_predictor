"""
Generates the `options.json` artifact from the training DataFrame.

Run this once as part of (or immediately after) model training, using
the SAME DataFrame that was fitted into `computer_preprocessor.joblib`.
The output is consumed at API startup by
`app.ml.options_loader.CategoricalOptionsLoader`.

IMPORTANT: Edit `CATEGORICAL_COLUMNS` and `load_training_dataframe()`
below to match your actual training pipeline before running this.

Usage
-----
    python scripts/generate_options_artifact.py
"""

import json
import logging
from pathlib import Path
from typing import Dict, List

import pandas as pd

logging.basicConfig(level=logging.INFO, format="%(asctime)s | %(levelname)s | %(message)s")
logger = logging.getLogger(__name__)

# ----------------------------------------------------------------------
# EDIT THIS: must match PredictionRequest's categorical fields exactly.
# ----------------------------------------------------------------------
CATEGORICAL_COLUMNS: List[str] = [
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
    "wifi"
]


OUTPUT_PATH = Path(__file__).resolve().parents[1] / "artifacts" / "options.json"


def load_training_dataframe() -> pd.DataFrame:
    """
    Load the same dataset that was used to train the model.
    """
    data_path = (
        Path(__file__).resolve().parents[1]
        / "data"
        / "processed"
        / "computer_prices_final.csv"
    )

    logger.info("Loading training data from %s", data_path)

    return pd.read_csv(data_path)


def extract_categorical_options(df: pd.DataFrame, columns: List[str]) -> Dict[str, List[str]]:
    """
    Extract sorted, unique, non-null values for each categorical column.

    Parameters
    ----------
    df : pd.DataFrame
        The training dataset.
    columns : List[str]
        Names of categorical columns to extract vocabulary for.

    Returns
    -------
    Dict[str, List[str]]
        Mapping of column name to its sorted list of unique values.

    Raises
    ------
    KeyError
        If a configured column is not present in the DataFrame.
    """
    options: Dict[str, List[str]] = {}
    for column in columns:
        if column not in df.columns:
            raise KeyError(f"Column '{column}' not found in training DataFrame.")

        unique_values = (
            df[column]
            .dropna()
            .astype(str)
            .str.strip()
            .unique()
            .tolist()
        )
        options[column] = sorted(unique_values)
        logger.info("Extracted %d unique values for '%s'.", len(options[column]), column)

    return options


def write_options_artifact(options: Dict[str, List[str]], output_path: Path) -> None:
    """
    Write the extracted options to disk as formatted JSON.

    Parameters
    ----------
    options : Dict[str, List[str]]
        The extracted categorical vocabulary.
    output_path : Path
        Destination path for the `options.json` artifact.
    """
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with output_path.open("w", encoding="utf-8") as file_handle:
        json.dump(options, file_handle, indent=2, ensure_ascii=False)
    logger.info("Wrote options artifact to '%s'.", output_path)


def main() -> None:
    """Entry point: load data, extract vocabulary, write artifact."""
    df = load_training_dataframe()
    options = extract_categorical_options(df, CATEGORICAL_COLUMNS)
    write_options_artifact(options, OUTPUT_PATH)


if __name__ == "__main__":
    main()