/**
 * "Connectivity" section of the prediction form: Wi-Fi and Bluetooth
 * standards.
 */

import { Wifi } from "lucide-react";
import type { Control } from "react-hook-form";
import { FormSectionCard } from "@/components/prediction/FormSectionCard";
import { SelectField } from "@/components/prediction/SelectField";
import { BLUETOOTH_OPTIONS, WIFI_OPTIONS } from "@/constants/formOptions";
import type { PredictionFormValues } from "@/lib/validation/predictionSchema";

interface ConnectivitySectionProps {
  control: Control<PredictionFormValues>;
}

export function ConnectivitySection({
  control,
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
        options={WIFI_OPTIONS}
      />
      <SelectField
        control={control}
        name="bluetooth"
        label="Bluetooth Version"
        options={BLUETOOTH_OPTIONS}
      />
    </FormSectionCard>
  );
}
