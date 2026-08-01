/**
 * Encapsulates all state and submission logic for the prediction
 * form: React Hook Form setup (with Zod validation), default values,
 * and the async submit handler that calls the prediction service.
 *
 * Separating this from the form's JSX keeps `PredictionForm` focused
 * purely on layout/presentation.
 */

import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  predictionSchema,
  type PredictionFormValues,
} from "@/lib/validation/predictionSchema";
import { predictionService } from "@/services/predictionServcies";
import { ApiRequestError } from "@/api/axiosClient";
import type { PredictionRequest, PredictionResponse } from "@/types/prediction";

const DEFAULT_VALUES: Partial<PredictionFormValues> = {
  device_type: "Laptop",
  release_year: new Date().getFullYear(),
  cpu_cores: 8,
  cpu_threads: 16,
  cpu_base_ghz: 2.5,
  ram_gb: 16,
  storage_gb: 512,
  storage_drive_count: 1,
  resolution_width: 1920,
  resolution_height: 1080,
  warranty_months: 12,
};

interface UsePredictionFormResult {
  form: ReturnType<typeof useForm<PredictionFormValues>>;
  isSubmitting: boolean;
  submissionError: string | null;
  result: PredictionResponse | null;
  onSubmit: (values: PredictionFormValues) => Promise<void>;
  resetPrediction: () => void;
}

/**
 * Provides form control, submission state, and the submit handler for
 * the computer price prediction form.
 *
 * @returns Form instance, loading/error/result state, and handlers.
 */
export function usePredictionForm(): UsePredictionFormResult {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [result, setResult] = useState<PredictionResponse | null>(null);

  const form = useForm<PredictionFormValues>({
    resolver: zodResolver(predictionSchema),
    defaultValues: DEFAULT_VALUES,
    mode: "onBlur",
  });

  const onSubmit = useCallback(async (values: PredictionFormValues) => {
    setIsSubmitting(true);
    setSubmissionError(null);
    setResult(null);

    try {
      const payload = values as unknown as PredictionRequest;
      const response = await predictionService.predictPrice(payload);
      setResult(response);
    } catch (error) {
      if (error instanceof ApiRequestError) {
        setSubmissionError(error.message);
      } else {
        setSubmissionError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const resetPrediction = useCallback(() => {
    setResult(null);
    setSubmissionError(null);
  }, []);

  return {
    form,
    isSubmitting,
    submissionError,
    result,
    onSubmit,
    resetPrediction,
  };
}
