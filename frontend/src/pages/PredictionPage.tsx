/**
 * Prediction page: hosts the full computer specification form and
 * displays the animated result card once a prediction is returned.
 */

import { useEffect, useRef } from "react";
import { usePredictionForm } from "@/hooks/usePredicitionForm";
import { PredictionForm } from "@/components/prediction/PredictionForm";
import { PredictionResultCard } from "@/components/prediction/PredictionResultCard";

export default function PredictionPage(): JSX.Element {
  const { form, isSubmitting, submissionError, result, onSubmit } =
    usePredictionForm();
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (result) {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [result]);

  return (
    <div className="container flex flex-col gap-8 py-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Predict Computer Price
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          Fill in the specifications below and our trained regression model will
          estimate the market price in seconds.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px]">
        <PredictionForm
          form={form}
          isSubmitting={isSubmitting}
          submissionError={submissionError}
          onSubmit={onSubmit}
        />

        <div className="lg:sticky lg:top-24 lg:self-start">
          {result ? (
            <div ref={resultRef}>
              <PredictionResultCard result={result} />
            </div>
          ) : (
            <div className="glass-panel flex min-h-[200px] flex-col items-center justify-center gap-2 p-8 text-center text-sm text-muted-foreground">
              <p className="font-medium text-foreground">No prediction yet</p>
              <p>
                Complete the form and submit to see your estimated price here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
