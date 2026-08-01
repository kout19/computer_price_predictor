/**
 * Service layer for the prediction domain.
 *
 * Wraps the centralized Axios client with typed, endpoint-specific
 * functions. Components and hooks depend on this module, never on
 * `axiosClient` directly — this keeps the endpoint paths and
 * request/response shapes in one place.
 */

import { axiosClient } from "@/api/axiosClient";
import type {
  HealthResponse,
  PredictionRequest,
  PredictionResponse,
} from "@/types/prediction";

const PREDICT_ENDPOINT = "/api/v1/predict";
const HEALTH_ENDPOINT = "/health";

export const predictionService = {
  /**
   * Submit a full computer specification and receive a predicted price.
   *
   * @param payload - Validated computer specification.
   * @returns The prediction result from the backend.
   * @throws {ApiRequestError} If the request fails validation (422),
   *   the service is unavailable (503), or an unexpected error occurs.
   */
  async predictPrice(payload: PredictionRequest): Promise<PredictionResponse> {
    const response = await axiosClient.post<PredictionResponse>(
      PREDICT_ENDPOINT,
      payload,
    );
    return response.data;
  },

  /**
   * Check backend service health, including whether the ML model and
   * preprocessor are loaded.
   *
   * @returns Current health status of the backend.
   */
  async checkHealth(): Promise<HealthResponse> {
    const response = await axiosClient.get<HealthResponse>(HEALTH_ENDPOINT);
    return response.data;
  },
};
