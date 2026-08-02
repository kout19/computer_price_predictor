# Computer Price Prediction API

## Run

uvicorn app.main:app --reload

Swagger

http://127.0.0.1:8000/docs
## Architecture
React + TypeScript
↓
FastAPI REST API (app/api)
↓
PredictionService (app/services) — orchestration only
↓
ArtifactLoader (app/ml/loader.py) — disk I/O
Predictor (app/ml/predictor.py) — DataFrame + inference
↓
computer_preprocessor.joblib
computer_best_model.joblib

Each layer has a single responsibility:

| Layer | Path | Responsibility |
|---|---|---|
| API | `app/api/v1/predict.py` | HTTP routing only, no business logic |
| Dependencies | `app/api/dependencies.py` | DI wiring for `PredictionService` |
| Service | `app/services/prediction_service.py` | Orchestrates loader + predictor |
| ML — Loader | `app/ml/loader.py` | Loads `.joblib` artifacts from disk, once |
| ML — Predictor | `app/ml/predictor.py` | DataFrame conversion, transform, inference |
| Schemas | `app/schemas/` | Request/response contracts (Pydantic v2) |
| Config | `app/core/config.py` | Centralized, env-driven settings |
| Logging | `app/core/logging.py` | Logging setup, separate from config values |
| Exceptions | `app/utils/exceptions.py` | Domain exception hierarchy |

## Requirements

- Python 3.10+
- The exact scikit-learn version used to train `computer_best_model.joblib`
  (see note in `requirements.txt`)

## Setup

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env
# Edit .env if needed (defaults work for local development)
```

Place your trained artifacts at:
backend/artifacts/computer_preprocessor.joblib
backend/artifacts/computer_best_model.joblib

## Running

```bash
uvicorn app.main:app --reload --port 8000
```

- Interactive docs: `http://localhost:8000/docs`
- Health check: `http://localhost:8000/health`

## Testing

```bash
pytest tests/ -v
```

## Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/` | API metadata |
| GET | `/health` | Reports whether the model/preprocessor are loaded |
| POST | `/api/v1/predict` | Predicts a computer's price from its specification |
| GET  |`/api/v1/options` | sends the form ooption list, form dropdown lists,  to frontend

## Design Notes

- **Artifacts load once**: `PredictionService.initialize()` is invoked
  exactly once, in `app.main`'s `lifespan` startup hook — never per request.
- **Centralized exception handling**: every domain exception
  (`ArtifactLoadError`, `ModelNotLoadedError`, `FeaturePreprocessingError`,
  `PredictionExecutionError`) maps to a specific HTTP status code via
  handlers registered in `app.main`.
- **No hardcoded paths**: all artifact/config paths are resolved via
  `pathlib.Path` in `app/core/config.py`, driven by environment variables.
- **Excluded training columns**: `model`, `cpu_model`, `gpu_model`, and
  `resolution` were dropped during training and are intentionally absent
  from `PredictionRequest`.