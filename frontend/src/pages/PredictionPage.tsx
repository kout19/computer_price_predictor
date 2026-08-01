/**
 * Prediction page: fetches the categorical options vocabulary from
 * the backend, then hosts the full specification form and the
 * animated result card once a prediction is returned.
 */

import { useEffect, useRef } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import { usePredictionForm } from "@/hooks/usePredicitionForm";
import { usePredictionOptions } from "@/hooks/usePredictionOptions";
import { PredictionForm } from "@/components/prediction/PredictionForm";
import { PredictionResultCard } from "@/components/prediction/PredictionResultCard";

export default function PredictionPage(): JSX.Element {
  const { form, isSubmitting, submissionError, result, onSubmit } =
    usePredictionForm();
  const {
    data: options,
    isLoading: isLoadingOptions,
    isError: isOptionsError,
    error: optionsError,
    refetch: refetchOptions,
  } = usePredictionOptions();
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

      {isLoadingOptions && (
        <div className="glass-panel flex flex-col items-center gap-3 p-12 text-center">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">
            Loading form options...
          </p>
        </div>
      )}

      {isOptionsError && (
        <div className="glass-panel flex flex-col items-center gap-3 p-12 text-center">
          <AlertTriangle className="h-6 w-6 text-destructive" />
          <p className="text-sm text-foreground">
            Failed to load form options: {optionsError.message}
          </p>
          <button
            type="button"
            onClick={() => refetchOptions()}
            className="text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            Try again
          </button>
        </div>
      )}

      {options && (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px]">
          <PredictionForm
            form={form}
            isSubmitting={isSubmitting}
            submissionError={submissionError}
            onSubmit={onSubmit}
            options={options}
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
      )}
    </div>
  );
}
