/**
 * Full prediction form: composes all 7 section components, wires the
 * submit action, and surfaces submission errors. All state/logic is
 * supplied by the `usePredictionForm` hook — this component is
 * purely compositional.
 */

import { AlertTriangle, Loader2, Sparkles } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { GeneralSection } from "@/components/prediction/sections/GeneralSection";
import { CpuSection } from "@/components/prediction/sections/CpuSections";
import { GpuSection } from "@/components/prediction/sections/GpuSections";
import { MemorySection } from "@/components/prediction/sections/MemorySections";
import { DisplaySection } from "@/components/prediction/sections/DisplaySections";
import { ConnectivitySection } from "@/components/prediction/sections/ConnectivitySection";
import { PowerSection } from "@/components/prediction/sections/PowerSections";
import type { PredictionFormValues } from "@/lib/validation/predictionSchema";

interface PredictionFormProps {
  form: UseFormReturn<PredictionFormValues>;
  isSubmitting: boolean;
  submissionError: string | null;
  onSubmit: (values: PredictionFormValues) => Promise<void>;
}

export function PredictionForm({
  form,
  isSubmitting,
  submissionError,
  onSubmit,
}: PredictionFormProps): JSX.Element {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-6"
      noValidate
    >
      <GeneralSection control={control} register={register} errors={errors} />
      <CpuSection control={control} register={register} errors={errors} />
      <GpuSection control={control} register={register} errors={errors} />
      <MemorySection control={control} register={register} errors={errors} />
      <DisplaySection control={control} register={register} errors={errors} />
      <ConnectivitySection control={control} />
      <PowerSection register={register} errors={errors} />

      {submissionError && (
        <div
          role="alert"
          className="flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          <AlertTriangle className="h-4 w-4 shrink-0" />
          {submissionError}
        </div>
      )}

      <Button
        type="submit"
        variant="glow"
        size="lg"
        disabled={isSubmitting}
        className="self-end"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Predicting Price...
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4" />
            Predict Price
          </>
        )}
      </Button>
    </form>
  );
}
