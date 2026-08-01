/**
 * "Display" section of the prediction form: panel type, size,
 * refresh rate, and resolution.
 */

import { Monitor } from "lucide-react";
import type { Control, FieldErrors, UseFormRegister } from "react-hook-form";
import { FormSectionCard } from "@/components/prediction/FormSectionCard";
import { SelectField } from "@/components/prediction/SelectField";
import { NumberField } from "@/components/prediction/NumberField";
import { DISPLAY_TYPE_OPTIONS } from "@/constants/formOptions";
import type { PredictionFormValues } from "@/lib/validation/predictionSchema";

interface DisplaySectionProps {
  control: Control<PredictionFormValues>;
  register: UseFormRegister<PredictionFormValues>;
  errors: FieldErrors<PredictionFormValues>;
}

export function DisplaySection({
  control,
  register,
  errors,
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
        options={DISPLAY_TYPE_OPTIONS}
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
