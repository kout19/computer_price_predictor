/**
 * Centralized Axios client for the Laptop Price Prediction frontend.
 *
 * This is the ONLY module that should import `axios` directly.
 * All API calls flow through this configured instance, ensuring
 * consistent base URL resolution, timeouts, and error normalization
 * across the entire application.
 */

import axios, { type AxiosError, type AxiosInstance } from "axios";
import type { ApiErrorResponse } from "@/types/prediction";

/**
 * Base URL for the FastAPI backend, resolved from Vite environment
 * variables. Falls back to the local development default.
 *
 * Configure via `.env`:
 *   VITE_API_BASE_URL=http://localhost:8000
 */
const API_BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000/";

const REQUEST_TIMEOUT_MS = 15_000;

/**
 * Normalized application-level error thrown by the API layer.
 *
 * All service functions should let this propagate rather than the
 * raw AxiosError, so UI components can rely on a single, predictable
 * error shape.
 */
export class ApiRequestError extends Error {
  public readonly errorCode: string;
  public readonly statusCode: number | null;
  public readonly details: string | null;

  constructor(
    message: string,
    errorCode: string,
    statusCode: number | null,
    details: string | null = null,
  ) {
    super(message);
    this.name = "ApiRequestError";
    this.errorCode = errorCode;
    this.statusCode = statusCode;
    this.details = details;
  }
}

export const axiosClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: REQUEST_TIMEOUT_MS,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Response interceptor that converts backend/network failures into a
 * single, consistent `ApiRequestError`, so consuming code never needs
 * to branch on AxiosError internals.
 */
axiosClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    if (error.response) {
      const payload = error.response.data;
      return Promise.reject(
        new ApiRequestError(
          payload?.message ?? "The server returned an unexpected error.",
          payload?.error_code ?? "UNKNOWN_ERROR",
          error.response.status,
          payload?.details ?? null,
        ),
      );
    }

    if (error.request) {
      return Promise.reject(
        new ApiRequestError(
          "Unable to reach the prediction service. Please check your connection.",
          "NETWORK_ERROR",
          null,
        ),
      );
    }

    return Promise.reject(
      new ApiRequestError(error.message, "REQUEST_SETUP_ERROR", null),
    );
  },
);
