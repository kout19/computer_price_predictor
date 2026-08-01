/**
 * Prediction page: fetches the categorical options vocabulary from
 * the backend, then hosts the full specification form and the
 * animated result card once a prediction is returned.
 */

import { useEffect, useRef } from "react";
import { AlertTriangle, Loader2, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { usePredictionForm } from "@/hooks/usePredicitionForm";
import { usePredictionOptions } from "@/hooks/usePredictionOptions";
import { PageContainer } from "@/components/common/PageContainer";
import { GlassPanel } from "@/components/common/GlassPanel";
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
    <PageContainer className="flex flex-col gap-8 py-10 sm:py-14">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="flex flex-col gap-3"
      >
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
          <Sparkles className="h-4 w-4" />
          Live prediction workflow
        </div>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Predict Computer Price
        </h1>
        <p className="max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg">
          Configure the device specifications below to generate an instant
          estimate from the trained regression pipeline.
        </p>
      </motion.div>

      {isLoadingOptions && (
        <GlassPanel className="flex flex-col items-center gap-4 p-10 text-center sm:p-14">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 text-primary">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
          <div className="space-y-2">
            <p className="text-lg font-semibold">Analyzing specifications...</p>
            <p className="text-sm text-muted-foreground">
              Preparing the form options from the backend vocabulary.
            </p>
          </div>
          <div className="h-2 w-full max-w-xs overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-2/3 animate-pulse rounded-full bg-gradient-to-r from-primary to-accent" />
          </div>
        </GlassPanel>
      )}

      {isOptionsError && (
        <GlassPanel className="flex flex-col items-center gap-4 p-10 text-center sm:p-14">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div className="space-y-2">
            <p className="text-lg font-semibold">
              We could not load the form options.
            </p>
            <p className="text-sm text-muted-foreground">
              {optionsError.message}
            </p>
          </div>
          <button
            type="button"
            onClick={() => refetchOptions()}
            className="text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            Try again
          </button>
        </GlassPanel>
      )}

      {options && (
        <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1.2fr_0.8fr]">
          <PredictionForm
            form={form}
            isSubmitting={isSubmitting}
            submissionError={submissionError}
            onSubmit={onSubmit}
            options={options}
          />

          <div className="xl:sticky xl:top-24 xl:self-start">
            {result ? (
              <div ref={resultRef}>
                <PredictionResultCard result={result} />
              </div>
            ) : (
              <GlassPanel className="flex min-h-[260px] flex-col items-center justify-center gap-3 p-8 text-center text-sm text-muted-foreground">
                <p className="text-lg font-semibold text-foreground">
                  Awaiting prediction
                </p>
                <p>
                  Complete the form and submit to reveal the model estimate
                  here.
                </p>
              </GlassPanel>
            )}
          </div>
        </div>
      )}
    </PageContainer>
  );
}
