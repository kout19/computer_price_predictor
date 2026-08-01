/**
 * Reusable label + control + error-message wrapper for form fields.
 * Every field across the 7 prediction form sections is wrapped in
 * this component, so error display and spacing are defined once
 * rather than repeated ~37 times.
 */

import type { ReactNode } from "react";
import type { FieldError } from "react-hook-form";
import { AlertCircle } from "lucide-react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FormFieldWrapperProps {
  label: string;
  htmlFor: string;
  error?: FieldError;
  helpText?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}

export function FormFieldWrapper({
  label,
  htmlFor,
  error,
  helpText,
  required = false,
  children,
  className,
}: FormFieldWrapperProps): JSX.Element {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Label htmlFor={htmlFor}>
        {label}
        {required && <span className="ml-0.5 text-destructive">*</span>}
      </Label>
      {children}
      {error ? (
        <p
          className="flex items-center gap-1 text-xs text-destructive"
          role="alert"
        >
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          {error.message}
        </p>
      ) : helpText ? (
        <p className="text-xs text-muted-foreground">{helpText}</p>
      ) : null}
    </div>
  );
}
