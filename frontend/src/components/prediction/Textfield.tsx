/**
 * Generic, reusable text input field bound to React Hook Form via
 * `register()`. Used for free-text fields (e.g. cpu_suffix,
 * gpu_suffix) that don't warrant a fixed dropdown vocabulary.
 */

import type {
  FieldErrors,
  FieldValues,
  Path,
  UseFormRegister,
} from "react-hook-form";
import { Input } from "@/components/ui/input";
import { FormFieldWrapper } from "@/components/prediction/FormFieldWrapper";

interface TextFieldProps<TFormValues extends FieldValues> {
  register: UseFormRegister<TFormValues>;
  errors: FieldErrors<TFormValues>;
  name: Path<TFormValues>;
  label: string;
  placeholder?: string;
  required?: boolean;
  helpText?: string;
}

export function TextField<TFormValues extends FieldValues>({
  register,
  errors,
  name,
  label,
  placeholder,
  required = false,
  helpText,
}: TextFieldProps<TFormValues>): JSX.Element {
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
        type="text"
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        {...register(name)}
      />
    </FormFieldWrapper>
  );
}
