/**
 * TanStack Query hook for fetching the categorical options vocabulary
 * exactly once per session. The vocabulary only changes when the
 * backend model is retrained/redeployed, so it's treated as
 * effectively static for the lifetime of the app session
 * (`staleTime: Infinity`, no automatic refetching).
 */

import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { optionsService } from "@/services/optionsService";
import type { PredictionOptions } from "@/types/options";

export const OPTIONS_QUERY_KEY = ["prediction-options"] as const;

/**
 * Fetch and cache the categorical options vocabulary.
 *
 * @returns TanStack Query result containing the options mapping.
 */
export function usePredictionOptions(): UseQueryResult<
  PredictionOptions,
  Error
> {
  return useQuery({
    queryKey: OPTIONS_QUERY_KEY,
    queryFn: optionsService.getPredictionOptions,
    staleTime: Infinity,
    retry: 2,
  });
}
