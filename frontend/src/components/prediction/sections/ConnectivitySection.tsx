/**
 * "Connectivity" section. wifi is a dynamic dropdown; bluetooth is
 * numeric per the trained model's schema.
 */

import { Wifi } from "lucide-react";
import type { Control, FieldErrors, UseFormRegister } from "react-hook-form";
import { FormSectionCard } from "@/components/prediction/FormSectionCard";
import { SelectField } from "@/components/prediction/SelectField";
import { NumberField } from "@/components/prediction/NumberField";
import { toSelectOptions } from "@/lib/toSelectOptions";
import type { PredictionFormValues } from "@/lib/validation/predictionSchema";
import type { PredictionOptions } from "@/types/options";

interface ConnectivitySectionProps {
  control: Control<PredictionFormValues>;
  register: UseFormRegister<PredictionFormValues>;
  errors: FieldErrors<PredictionFormValues>;
  options: PredictionOptions;
}

export function ConnectivitySection({
  control,
  register,
  errors,
  options,
}: ConnectivitySectionProps): JSX.Element {
  return (
    <FormSectionCard
      index={5}
      icon={<Wifi className="h-4.5 w-4.5" />}
      title="Connectivity"
      description="Wireless connectivity standards"
    >
      <SelectField
        control={control}
        name="wifi"
        label="Wi-Fi Standard"
        options={toSelectOptions(options.wifi)}
      />
      <NumberField
        register={register}
        errors={errors}
        name="bluetooth"
        label="Bluetooth Version"
        step={0.1}
        helpText="Numeric version value used by the trained model"
      />
    </FormSectionCard>
  );
}
