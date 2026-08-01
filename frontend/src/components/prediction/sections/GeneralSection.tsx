/**
 * "General" section of the prediction form. All dropdowns sourced
 * dynamically from the backend options vocabulary.
 */

import { Laptop } from "lucide-react";
import type { Control, FieldErrors, UseFormRegister } from "react-hook-form";
import { FormSectionCard } from "@/components/prediction/FormSectionCard";
import { SelectField } from "@/components/prediction/SelectField";
import { NumberField } from "@/components/prediction/NumberField";
import { toSelectOptions } from "@/lib/toSelectOptions";
import type { PredictionFormValues } from "@/lib/validation/predictionSchema";
import type { PredictionOptions } from "@/types/options";

interface GeneralSectionProps {
  control: Control<PredictionFormValues>;
  register: UseFormRegister<PredictionFormValues>;
  errors: FieldErrors<PredictionFormValues>;
  options: PredictionOptions;
}

export function GeneralSection({
  control,
  register,
  errors,
  options,
}: GeneralSectionProps): JSX.Element {
  return (
    <FormSectionCard
      index={0}
      icon={<Laptop className="h-4.5 w-4.5" />}
      title="General"
      description="Core identity of the device"
    >
      <SelectField
        control={control}
        name="device_type"
        label="Device Type"
        options={toSelectOptions(options.device_type)}
      />
      <SelectField
        control={control}
        name="brand"
        label="Brand"
        options={toSelectOptions(options.brand)}
      />
      <NumberField
        register={register}
        errors={errors}
        name="release_year"
        label="Release Year"
        placeholder="2024"
      />
      <SelectField
        control={control}
        name="os"
        label="Operating System"
        options={toSelectOptions(options.os)}
      />
      <SelectField
        control={control}
        name="form_factor"
        label="Form Factor"
        options={toSelectOptions(options.form_factor)}
      />
    </FormSectionCard>
  );
}
