/**
 * Full prediction form: composes all 7 section components, wires the
 * submit action, and surfaces submission errors. Categorical dropdown
 * options are fetched by the parent page and passed down here.
 */

import { AlertTriangle, Loader2, Sparkles } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import { GlassPanel } from "@/components/common/GlassPanel";
import { Button } from "@/components/ui/button";
import { GeneralSection } from "@/components/prediction/sections/GeneralSection";
import { CpuSection } from "@/components/prediction/sections/CpuSections";
import { GpuSection } from "@/components/prediction/sections/GpuSections";
import { MemorySection } from "@/components/prediction/sections/MemorySections";
import { DisplaySection } from "@/components/prediction/sections/DisplaySections";
import { ConnectivitySection } from "@/components/prediction/sections/ConnectivitySection";
import { PowerSection } from "@/components/prediction/sections/PowerSections";
import type { PredictionFormValues } from "@/lib/validation/predictionSchema";
import type { PredictionOptions } from "@/types/options";

interface PredictionFormProps {
  form: UseFormReturn<PredictionFormValues>;
  isSubmitting: boolean;
  submissionError: string | null;
  onSubmit: (values: PredictionFormValues) => Promise<void>;
  options: PredictionOptions;
}

export function PredictionForm({
  form,
  isSubmitting,
  submissionError,
  onSubmit,
  options,
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
      <GlassPanel className="flex flex-col gap-4 p-6 sm:p-7">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-foreground">
              Specification Form
            </h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Provide the device attributes in a few focused sections to produce
              a reliable estimate.
            </p>
          </div>
        </div>
      </GlassPanel>

      <div className="flex flex-col gap-6">
        <GeneralSection
          control={control}
          register={register}
          errors={errors}
          options={options}
        />
        <CpuSection
          control={control}
          register={register}
          errors={errors}
          options={options}
        />
        <GpuSection
          control={control}
          register={register}
          errors={errors}
          options={options}
        />
        <MemorySection
          control={control}
          register={register}
          errors={errors}
          options={options}
        />
        <DisplaySection
          control={control}
          register={register}
          errors={errors}
          options={options}
        />
        <ConnectivitySection
          control={control}
          register={register}
          errors={errors}
          options={options}
        />
        <PowerSection register={register} errors={errors} />
      </div>

      {submissionError && (
        <GlassPanel className="flex items-start gap-3 border-destructive/30 bg-destructive/10 p-4">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
          <p className="text-sm text-destructive">{submissionError}</p>
        </GlassPanel>
      )}

      <div className="flex justify-end">
        <Button
          type="submit"
          variant="glow"
          size="lg"
          disabled={isSubmitting}
          className="w-full sm:w-auto"
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
      </div>
    </form>
  );
}
