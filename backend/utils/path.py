# src/utils/paths.py
from pathlib import Path

# The path to this file is: project_root/src/utils/paths.py
# We go up 3 levels to reach project_root
PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent

# Key data directories
DATA_DIR = PROJECT_ROOT / "data"
RAW_DIR = DATA_DIR / "raw"
PROCESSED_DIR = DATA_DIR / "processed"
FEATURES_DIR = DATA_DIR / "features"

# Artifacts (fitted transformers, models)
ARTIFACTS_DIR = PROJECT_ROOT / "artifacts"

# Ensure they exist when the module is first imported
for directory in [RAW_DIR, PROCESSED_DIR, FEATURES_DIR, ARTIFACTS_DIR]:
    directory.mkdir(parents=True, exist_ok=True)

# Specific file paths (optional, but handy)
CLEANED_DATA = PROCESSED_DIR / "laptop_price_cleaned.csv"
TRAIN_FEATURES = FEATURES_DIR / "train_features.csv"
TEST_FEATURES = FEATURES_DIR / "test_features.csv"