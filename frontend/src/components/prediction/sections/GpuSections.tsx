/**
 * "GPU" section of the prediction form: brand, tier, family,
 * generation, suffix, and VRAM capacity.
 */

import { MonitorSmartphone } from "lucide-react";
import type { Control, FieldErrors, UseFormRegister } from "react-hook-form";
import { FormSectionCard } from "@/components/prediction/FormSectionCard";
import { SelectField } from "@/components/prediction/SelectField";
import { NumberField } from "@/components/prediction/NumberField";
import { TextField } from "@/components/prediction/TextField";
import {
  GPU_BRAND_OPTIONS,
  GPU_FAMILY_OPTIONS,
  GPU_TIER_OPTIONS,
} from "@/constants/formOptions";
import type { PredictionFormValues } from "@/lib/validation/predictionSchema";

interface GpuSectionProps {
  control: Control<PredictionFormValues>;
  register: UseFormRegister<PredictionFormValues>;
  errors: FieldErrors<PredictionFormValues>;
}

export function GpuSection({
  control,
  register,
  errors,
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
        options={GPU_BRAND_OPTIONS}
      />
      <SelectField
        control={control}
        name="gpu_tier"
        label="GPU Tier"
        options={GPU_TIER_OPTIONS}
      />
      <SelectField
        control={control}
        name="gpu_family"
        label="GPU Family"
        options={GPU_FAMILY_OPTIONS}
      />
      <TextField
        register={register}
        errors={errors}
        name="gpu_generation"
        label="GPU Generation"
        placeholder="e.g. 40 Series"
        helpText="Optional"
      />
      <TextField
        register={register}
        errors={errors}
        name="gpu_suffix"
        label="GPU Suffix"
        placeholder="e.g. Ti, XT"
        helpText="Optional"
      />
      <NumberField
        register={register}
        errors={errors}
        name="vram_gb"
        label="VRAM (GB)"
        step={0.5}
        required={false}
        helpText="Leave blank for integrated graphics"
      />
    </FormSectionCard>
  );
}
