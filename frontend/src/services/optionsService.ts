/**
 * Service layer for the categorical options vocabulary endpoint.
 * The single source of truth for dropdown values — no component or
 * hook should ever hardcode categorical options.
 */

import { axiosClient } from "@/api/axiosClient";
import type { OptionsResponse, PredictionOptions } from "@/types/options";

const OPTIONS_ENDPOINT = "/api/v1/options";

export const optionsService = {
  /**
   * Fetch the categorical options vocabulary used during model training.
   *
   * @returns Mapping of categorical field name to its valid values.
   * @throws {ApiRequestError} If the backend is unavailable or the
   *   vocabulary has not yet loaded (503).
   */
  async getPredictionOptions(): Promise<PredictionOptions> {
    const response = await axiosClient.get<OptionsResponse>(OPTIONS_ENDPOINT);
    return response.data.options;
  },
};
