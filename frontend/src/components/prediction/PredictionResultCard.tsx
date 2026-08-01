/**
 * Premium animated card displaying a completed price prediction.
 * This is the visual payoff of the prediction flow: predicted price,
 * currency, model version, and generation timestamp.
 */

import { PredictionCard } from "@/components/prediction/PredictionCard";
import type { PredictionResponse } from "@/types/prediction";

interface PredictionResultCardProps {
  result: PredictionResponse;
}

export function PredictionResultCard({
  result,
}: PredictionResultCardProps): JSX.Element {
  return <PredictionCard result={result} />;
}
