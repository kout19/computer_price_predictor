/**
 * "Display" section. display_type is a dynamic dropdown.
 */

import { Monitor } from "lucide-react";
import type { Control, FieldErrors, UseFormRegister } from "react-hook-form";
import { FormSectionCard } from "@/components/prediction/FormSectionCard";
import { SelectField } from "@/components/prediction/SelectField";
import { NumberField } from "@/components/prediction/NumberField";
import { toSelectOptions } from "@/lib/toSelectOptions";
import type { PredictionFormValues } from "@/lib/validation/predictionSchema";
import type { PredictionOptions } from "@/types/options";

interface DisplaySectionProps {
  control: Control<PredictionFormValues>;
  register: UseFormRegister<PredictionFormValues>;
  errors: FieldErrors<PredictionFormValues>;
  options: PredictionOptions;
}

export function DisplaySection({
  control,
  register,
  errors,
  options,
}: DisplaySectionProps): JSX.Element {
  return (
    <FormSectionCard
      index={4}
      icon={<Monitor className="h-4.5 w-4.5" />}
      title="Display"
      description="Screen specifications"
    >
      <SelectField
        control={control}
        name="display_type"
        label="Display Type"
        options={toSelectOptions(options.display_type)}
        required={false}
      />
      <NumberField
        register={register}
        errors={errors}
        name="display_size_in"
        label="Display Size (in)"
        step={0.1}
        required={false}
      />
      <NumberField
        register={register}
        errors={errors}
        name="refresh_hz"
        label="Refresh Rate (Hz)"
        required={false}
      />
      <NumberField
        register={register}
        errors={errors}
        name="resolution_width"
        label="Resolution Width (px)"
      />
      <NumberField
        register={register}
        errors={errors}
        name="resolution_height"
        label="Resolution Height (px)"
      />
    </FormSectionCard>
  );
}
