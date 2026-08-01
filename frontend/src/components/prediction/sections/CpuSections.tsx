/**
 * "CPU" section of the prediction form. All categorical fields
 * (brand, series, suffix) are dynamic dropdowns sourced from the
 * backend's options vocabulary. cpu_tier and cpu_generation are
 * numeric per the trained model's schema.
 */

import { Cpu } from "lucide-react";
import type { Control, FieldErrors, UseFormRegister } from "react-hook-form";
import { FormSectionCard } from "@/components/prediction/FormSectionCard";
import { SelectField } from "@/components/prediction/SelectField";
import { NumberField } from "@/components/prediction/NumberField";
import { toSelectOptions } from "@/lib/toSelectOptions";
import type { PredictionFormValues } from "@/lib/validation/predictionSchema";
import type { PredictionOptions } from "@/types/options";

interface CpuSectionProps {
  control: Control<PredictionFormValues>;
  register: UseFormRegister<PredictionFormValues>;
  errors: FieldErrors<PredictionFormValues>;
  options: PredictionOptions;
}

export function CpuSection({
  control,
  register,
  errors,
  options,
}: CpuSectionProps): JSX.Element {
  return (
    <FormSectionCard
      index={1}
      icon={<Cpu className="h-4.5 w-4.5" />}
      title="CPU"
      description="Processor specifications"
    >
      <SelectField
        control={control}
        name="cpu_brand"
        label="CPU Brand"
        options={toSelectOptions(options.cpu_brand)}
      />
      <NumberField
        register={register}
        errors={errors}
        name="cpu_tier"
        label="CPU Tier"
        helpText="Numeric tier value used by the trained model"
      />
      <SelectField
        control={control}
        name="cpu_series"
        label="CPU Series"
        options={toSelectOptions(options.cpu_series)}
      />
      <NumberField
        register={register}
        errors={errors}
        name="cpu_generation"
        label="CPU Generation"
      />
      <NumberField
        register={register}
        errors={errors}
        name="cpu_cores"
        label="Cores"
      />
      <NumberField
        register={register}
        errors={errors}
        name="cpu_threads"
        label="Threads"
      />
      <NumberField
        register={register}
        errors={errors}
        name="cpu_base_ghz"
        label="Base Clock (GHz)"
        step={0.1}
      />
      <NumberField
        register={register}
        errors={errors}
        name="cpu_boost_ghz"
        label="Boost Clock (GHz)"
        step={0.1}
        required={false}
        helpText="Leave blank if not applicable"
      />
      <SelectField
        control={control}
        name="cpu_suffix"
        label="CPU Suffix"
        options={toSelectOptions(options.cpu_suffix)}
        required={false}
      />
    </FormSectionCard>
  );
}
