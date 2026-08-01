/**
 * Types for the categorical options vocabulary fetched from
 * GET /api/v1/options. Mirrors the backend's
 * `CategoricalOptionsResponse` schema exactly.
 */

/** Mapping of categorical field name to its valid, training-time values. */
export type PredictionOptions = Record<string, string[]>;

/** Raw response payload from GET /api/v1/options. */
export interface OptionsResponse {
  options: PredictionOptions;
}
