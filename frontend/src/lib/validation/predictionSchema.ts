/**
 * Zod validation schema for the computer specification prediction
 * form. Field constraints are intentionally kept in lockstep with the
 * backend's `PredictionRequest` Pydantic schema (same bounds, same
 * required/optional fields) so client-side and server-side validation
 * never disagree.
 */

import { z } from "zod";

/** Shared "required, non-empty string" rule for categorical fields. */
const requiredString = (label: string) =>
  z
    .string()
    .trim()
    .min(1, { message: `${label} is required.` });

/** Shared helper for optional string fields (nullable on the backend). */
const optionalString = () =>
  z
    .string()
    .trim()
    .optional()
    .transform((value) => (value === "" || value === undefined ? null : value));

export const predictionSchema = z.object({
  // ------------------------------------------------------------------
  // General
  // ------------------------------------------------------------------
  device_type: requiredString("Device type"),
  brand: requiredString("Brand"),
  release_year: z.coerce
    .number({ invalid_type_error: "Release year is required." })
    .int()
    .min(1990, "Release year must be 1990 or later.")
    .max(2035, "Release year must be 2035 or earlier."),
  os: requiredString("Operating system"),
  form_factor: requiredString("Form factor"),

  // ------------------------------------------------------------------
  // CPU
  // ------------------------------------------------------------------
  cpu_brand: requiredString("CPU brand"),
  cpu_tier: requiredString("CPU tier"),
  cpu_cores: z.coerce
    .number({ invalid_type_error: "CPU cores is required." })
    .int()
    .min(1, "Must have at least 1 core.")
    .max(256, "Must be 256 or fewer cores."),
  cpu_threads: z.coerce
    .number({ invalid_type_error: "CPU threads is required." })
    .int()
    .min(1, "Must have at least 1 thread.")
    .max(512, "Must be 512 or fewer threads."),
  cpu_base_ghz: z.coerce
    .number({ invalid_type_error: "CPU base clock is required." })
    .gt(0, "Must be greater than 0.")
    .max(10, "Must be 10 GHz or less."),
  cpu_boost_ghz: z.coerce
    .number()
    .gt(0, "Must be greater than 0.")
    .max(10, "Must be 10 GHz or less.")
    .optional()
    .nullable(),
  cpu_series: requiredString("CPU series"),
  cpu_generation: requiredString("CPU generation"),
  cpu_suffix: optionalString(),

  // ------------------------------------------------------------------
  // GPU
  // ------------------------------------------------------------------
  gpu_brand: requiredString("GPU brand"),
  gpu_tier: requiredString("GPU tier"),
  gpu_family: requiredString("GPU family"),
  gpu_generation: optionalString(),
  gpu_suffix: optionalString(),
  vram_gb: z.coerce
    .number()
    .min(0, "Cannot be negative.")
    .max(64, "Must be 64 GB or less.")
    .optional()
    .nullable(),

  // ------------------------------------------------------------------
  // Memory & Storage
  // ------------------------------------------------------------------
  ram_gb: z.coerce
    .number({ invalid_type_error: "RAM is required." })
    .int()
    .min(1, "Must be at least 1 GB.")
    .max(512, "Must be 512 GB or less."),
  storage_type: requiredString("Storage type"),
  storage_gb: z.coerce
    .number({ invalid_type_error: "Storage capacity is required." })
    .int()
    .min(1, "Must be at least 1 GB.")
    .max(32000, "Must be 32000 GB or less."),
  storage_drive_count: z.coerce
    .number({ invalid_type_error: "Drive count is required." })
    .int()
    .min(1, "Must have at least 1 drive.")
    .max(8, "Must be 8 or fewer drives."),

  // ------------------------------------------------------------------
  // Display
  // ------------------------------------------------------------------
  display_type: optionalString(),
  display_size_in: z.coerce
    .number()
    .gt(0, "Must be greater than 0.")
    .max(100, "Must be 100 inches or less.")
    .optional()
    .nullable(),
  refresh_hz: z.coerce
    .number()
    .int()
    .min(30, "Must be at least 30 Hz.")
    .max(540, "Must be 540 Hz or less.")
    .optional()
    .nullable(),
  resolution_width: z.coerce
    .number({ invalid_type_error: "Resolution width is required." })
    .int()
    .min(640, "Must be at least 640 px.")
    .max(15360, "Must be 15360 px or less."),
  resolution_height: z.coerce
    .number({ invalid_type_error: "Resolution height is required." })
    .int()
    .min(480, "Must be at least 480 px.")
    .max(8640, "Must be 8640 px or less."),

  // ------------------------------------------------------------------
  // Power
  // ------------------------------------------------------------------
  battery_wh: z.coerce
    .number()
    .min(0, "Cannot be negative.")
    .max(300, "Must be 300 Wh or less.")
    .optional()
    .nullable(),
  charger_watts: z.coerce
    .number()
    .min(0, "Cannot be negative.")
    .max(500, "Must be 500 W or less.")
    .optional()
    .nullable(),
  psu_watts: z.coerce
    .number()
    .min(0, "Cannot be negative.")
    .max(2000, "Must be 2000 W or less.")
    .optional()
    .nullable(),

  // ------------------------------------------------------------------
  // Connectivity
  // ------------------------------------------------------------------
  wifi: requiredString("Wi-Fi standard"),
  bluetooth: requiredString("Bluetooth version"),

  // ------------------------------------------------------------------
  // Physical & Misc
  // ------------------------------------------------------------------
  weight_kg: z.coerce
    .number()
    .gt(0, "Must be greater than 0.")
    .max(50, "Must be 50 kg or less.")
    .optional()
    .nullable(),
  warranty_months: z.coerce
    .number({ invalid_type_error: "Warranty is required." })
    .int()
    .min(0, "Cannot be negative.")
    .max(120, "Must be 120 months or less."),
  megapixels: z.coerce
    .number()
    .min(0, "Cannot be negative.")
    .max(200, "Must be 200 MP or less.")
    .optional()
    .nullable(),
});

/** Inferred TypeScript type for the validated form output. */
export type PredictionFormValues = z.infer<typeof predictionSchema>;
