/**
 * Generic, reusable Select field bound to React Hook Form via
 * Controller (required since Radix's Select is not a native input
 * and can't use plain `register()`). Every categorical dropdown
 * across the 7 form sections is an instance of this component.
 */

import { Controller, type Control, type FieldValues, type Path } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormFieldWrapper } from "@/components/prediction/FormFieldWrapper";
import type { SelectOption } from "@/lib/toSelectOptions";

interface SelectFieldProps<TFormValues extends FieldValues> {
  control: Control<TFormValues>;
  name: Path<TFormValues>;
  label: string;
  options: SelectOption[];
  placeholder?: string;
  required?: boolean;
  helpText?: string;
}

export function SelectField<TFormValues extends FieldValues>({
  control,
  name,
  label,
  options,
  placeholder = "Select an option",
  required = true,
  helpText,
}: SelectFieldProps<TFormValues>): JSX.Element {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormFieldWrapper
          label={label}
          htmlFor={name}
          error={fieldState.error}
          required={required}
          helpText={helpText}
        >
          <Select
            value={field.value ?? undefined}
            onValueChange={field.onChange}
          >
            <SelectTrigger id={name} aria-invalid={Boolean(fieldState.error)}>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormFieldWrapper>
      )}
    />
  );
}