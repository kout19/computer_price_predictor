/**
 * "GPU" section of the prediction form. All categorical fields
 * (brand, family, generation, suffix) are dynamic dropdowns sourced
 * from the backend's options vocabulary. gpu_tier is numeric per the
 * trained model's schema.
 */

import { MonitorSmartphone } from "lucide-react";
import type { Control, FieldErrors, UseFormRegister } from "react-hook-form";
import { FormSectionCard } from "@/components/prediction/FormSectionCard";
import { SelectField } from "@/components/prediction/SelectField";
import { NumberField } from "@/components/prediction/NumberField";
import { toSelectOptions } from "@/lib/toSelectOptions";
import type { PredictionFormValues } from "@/lib/validation/predictionSchema";
import type { PredictionOptions } from "@/types/options";

interface GpuSectionProps {
  control: Control<PredictionFormValues>;
  register: UseFormRegister<PredictionFormValues>;
  errors: FieldErrors<PredictionFormValues>;
  options: PredictionOptions;
}

export function GpuSection({
  control,
  register,
  errors,
  options,
}: GpuSectionProps): JSX.Element {
  return (
    <FormSectionCard
      index={2}
      icon={<MonitorSmartphone className="h-4.5 w-4.5" />}
      title="GPU"
      description="Graphics processor specifications"
    >
      <SelectField
        control={control}
        name="gpu_brand"
        label="GPU Brand"
        options={toSelectOptions(options.gpu_brand)}
      />
      <NumberField
        register={register}
        errors={errors}
        name="gpu_tier"
        label="GPU Tier"
        helpText="Numeric tier value used by the trained model"
      />
      <SelectField
        control={control}
        name="gpu_family"
        label="GPU Family"
        options={toSelectOptions(options.gpu_family)}
      />
      <SelectField
        control={control}
        name="gpu_generation"
        label="GPU Generation"
        options={toSelectOptions(options.gpu_generation)}
        required={false}
      />
      <SelectField
        control={control}
        name="gpu_suffix"
        label="GPU Suffix"
        options={toSelectOptions(options.gpu_suffix)}
        required={false}
      />
    </FormSectionCard>
  );
}
