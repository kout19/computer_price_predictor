/**
 * "Power" section of the prediction form: battery capacity, charger
 * wattage, PSU wattage, plus physical/misc fields (weight, warranty,
 * webcam megapixels).
 */

import { BatteryCharging } from "lucide-react";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { FormSectionCard } from "@/components/prediction/FormSectionCard";
import { NumberField } from "@/components/prediction/NumberField";
import type { PredictionFormValues } from "@/lib/validation/predictionSchema";

interface PowerSectionProps {
  register: UseFormRegister<PredictionFormValues>;
  errors: FieldErrors<PredictionFormValues>;
}

export function PowerSection({
  register,
  errors,
}: PowerSectionProps): JSX.Element {
  return (
    <FormSectionCard
      index={6}
      icon={<BatteryCharging className="h-4.5 w-4.5" />}
      title="Power & Physical"
      description="Power delivery and physical characteristics"
    >
      <NumberField
        register={register}
        errors={errors}
        name="battery_wh"
        label="Battery (Wh)"
        required={false}
        helpText="Leave blank for desktops"
      />
      <NumberField
        register={register}
        errors={errors}
        name="charger_watts"
        label="Charger (W)"
        required={false}
      />
      <NumberField
        register={register}
        errors={errors}
        name="psu_watts"
        label="PSU (W)"
        required={false}
        helpText="Leave blank for laptops"
      />
      <NumberField
        register={register}
        errors={errors}
        name="weight_kg"
        label="Weight (kg)"
        step={0.1}
        required={false}
      />
      <NumberField
        register={register}
        errors={errors}
        name="warranty_months"
        label="Warranty (months)"
      />
      <NumberField
        register={register}
        errors={errors}
        name="megapixels"
        label="Webcam (MP)"
        step={0.1}
        required={false}
      />
    </FormSectionCard>
  );
}
