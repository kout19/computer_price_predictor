/**
 * "Memory" section of the prediction form: RAM, storage type,
 * storage capacity, and drive count.
 */

import { MemoryStick } from "lucide-react";
import type { Control, FieldErrors, UseFormRegister } from "react-hook-form";
import { FormSectionCard } from "@/components/prediction/FormSectionCard";
import { SelectField } from "@/components/prediction/SelectField";
import { NumberField } from "@/components/prediction/NumberField";
import { STORAGE_TYPE_OPTIONS } from "@/constants/formOptions";
import type { PredictionFormValues } from "@/lib/validation/predictionSchema";

interface MemorySectionProps {
  control: Control<PredictionFormValues>;
  register: UseFormRegister<PredictionFormValues>;
  errors: FieldErrors<PredictionFormValues>;
}

export function MemorySection({ control, register, errors }: MemorySectionProps): JSX.Element {
  return (
    <FormSectionCard
      index={3}
      icon={<MemoryStick className="h-4.5 w-4.5" />}
      title="Memory & Storage"
      description="RAM and storage configuration"
    >
      <NumberField register={register} errors={errors} name="ram_gb" label="RAM (GB)" />
      <SelectField
        control={control}
        name="storage_type"
        label="Storage Type"
        options={STORAGE_TYPE_OPTIONS}
      />
      <NumberField
        register={register}
        errors={errors}
        name="storage_gb"
        label="Storage Capacity (GB)"
      />
      <NumberField
        register={register}
        errors={errors}
        name="storage_drive_count"
        label="Number of Drives"
      />
    </FormSectionCard>
  );
}