/**
 * Domain types for the Laptop/Computer Price Prediction feature.
 *
 * These types mirror the FastAPI backend's Pydantic schemas exactly:
 * - `PredictionRequest` (app/schemas/prediction_request.py)
 * - `PredictionResponse` (app/schemas/prediction_response.py)
 *
 * Keeping this file in sync with the backend contract is critical —
 * any drift here causes either silent 422 validation errors or
 * TypeScript types that lie about the actual API shape.
 */

/** Device categories recognized by the trained model. */
export type DeviceType =
  | "Laptop"
  | "Desktop"
  | "AIO"
  | "Workstation"
  | "Tablet";

/** Full request payload sent to POST /api/v1/predict. */
export interface PredictionRequest {
  // General
  device_type: string;
  brand: string;
  release_year: number;
  os: string;
  form_factor: string;

  // CPU
  cpu_brand: string;
  cpu_tier: string;
  cpu_cores: number;
  cpu_threads: number;
  cpu_base_ghz: number;
  cpu_boost_ghz: number | null;
  cpu_series: string;
  cpu_generation: string;
  cpu_suffix: string | null;

  // GPU
  gpu_brand: string;
  gpu_tier: string;
  gpu_family: string;
  gpu_generation: string | null;
  gpu_suffix: string | null;
  vram_gb: number | null;

  // Memory & Storage
  ram_gb: number;
  storage_type: string;
  storage_gb: number;
  storage_drive_count: number;

  // Display
  display_type: string | null;
  display_size_in: number | null;
  refresh_hz: number | null;
  resolution_width: number;
  resolution_height: number;

  // Power
  battery_wh: number | null;
  charger_watts: number | null;
  psu_watts: number | null;

  // Connectivity
  wifi: string;
  bluetooth: string;

  // Physical & Misc
  weight_kg: number | null;
  warranty_months: number;
  megapixels: number | null;
}

/** Response payload returned by POST /api/v1/predict. */
export interface PredictionResponse {
  predicted_price: number;
  currency: string;
  model_version: string;
  generated_at: string;
}

/** Standardized error envelope returned by the backend on failure. */
export interface ApiErrorResponse {
  error_code: string;
  message: string;
  details?: string | null;
}

/** Response payload returned by GET /health. */
export interface HealthResponse {
  status: "ok" | "degraded";
  model_loaded: boolean;
  preprocessor_loaded: boolean;
  environment: string;
}

/**
 * Logical grouping of form fields, used to render the multi-section
 * prediction form and to organize field-level metadata (labels,
 * placeholders, help text) consistently across the UI.
 */
export type PredictionFormSection =
  | "general"
  | "cpu"
  | "gpu"
  | "memory"
  | "display"
  | "connectivity"
  | "power";
