/**
 * Generic, reusable numeric input field bound to React Hook Form via
 * `register()`. Used for every numeric field (cores, RAM, resolution,
 * wattage, etc.) across the 7 prediction form sections.
 */

import type {
  FieldErrors,
  FieldValues,
  Path,
  UseFormRegister,
} from "react-hook-form";
import { Input } from "@/components/ui/input";
import { FormFieldWrapper } from "@/components/prediction/FormFieldWrapper";

interface NumberFieldProps<TFormValues extends FieldValues> {
  register: UseFormRegister<TFormValues>;
  errors: FieldErrors<TFormValues>;
  name: Path<TFormValues>;
  label: string;
  placeholder?: string;
  step?: number;
  required?: boolean;
  helpText?: string;
}

export function NumberField<TFormValues extends FieldValues>({
  register,
  errors,
  name,
  label,
  placeholder,
  step = 1,
  required = true,
  helpText,
}: NumberFieldProps<TFormValues>): JSX.Element {
  const error = errors[name] as { message?: string } | undefined;

  return (
    <FormFieldWrapper
      label={label}
      htmlFor={name}
      error={error as never}
      required={required}
      helpText={helpText}
    >
      <Input
        id={name}
        type="number"
        step={step}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        {...register(name)}
      />
    </FormFieldWrapper>
  );
}
