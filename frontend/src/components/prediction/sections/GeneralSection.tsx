/**
 * "General" section of the prediction form: device type, brand,
 * release year, operating system, and form factor.
 */

import { Laptop } from "lucide-react";
import type { Control, FieldErrors, UseFormRegister } from "react-hook-form";
import { FormSectionCard } from "@/components/prediction/FormSectionCard";
import { SelectField } from "@/components/prediction/SelectField";
import { NumberField } from "@/components/prediction/NumberField";
import {
  BRAND_OPTIONS,
  DEVICE_TYPE_OPTIONS,
  FORM_FACTOR_OPTIONS,
  OS_OPTIONS,
} from "@/constants/formOptions";
import type { PredictionFormValues } from "@/lib/validation/predictionSchema";

interface GeneralSectionProps {
  control: Control<PredictionFormValues>;
  register: UseFormRegister<PredictionFormValues>;
  errors: FieldErrors<PredictionFormValues>;
}

export function GeneralSection({
  control,
  register,
  errors,
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
        options={DEVICE_TYPE_OPTIONS}
      />
      <SelectField
        control={control}
        name="brand"
        label="Brand"
        options={BRAND_OPTIONS}
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
        options={OS_OPTIONS}
      />
      <SelectField
        control={control}
        name="form_factor"
        label="Form Factor"
        options={FORM_FACTOR_OPTIONS}
      />
    </FormSectionCard>
  );
}
