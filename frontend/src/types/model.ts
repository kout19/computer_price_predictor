/**
 * Types supporting the Model Comparison, Model Information, and
 * Dataset Information pages.
 *
 * These are currently populated from static content modules
 * (see src/services/modelMetricsService.ts) since the backend does
 * not yet expose a metrics endpoint. If/when one exists, only the
 * service layer needs to change — these types remain valid.
 */

/** Regression evaluation metrics for a single trained model candidate. */
export interface ModelMetrics {
  modelName: string;
  mae: number;
  mse: number;
  rmse: number;
  r2Score: number;
  isBestModel: boolean;
}

/** Describes a single feature in the training dataset. */
export interface DatasetFeature {
  name: string;
  description: string;
  dataType: "numerical" | "categorical";
  example: string;
}

/** High-level dataset statistics for the overview section. */
export interface DatasetOverview {
  totalRecords: number;
  totalFeatures: number;
  numericalFeatureCount: number;
  categoricalFeatureCount: number;
  targetVariable: string;
}

/** A single stage in the ML workflow, rendered as a timeline/stepper. */
export interface WorkflowStep {
  order: number;
  title: string;
  description: string;
}

/** Team member profile for the About page. */
export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  avatarUrl?: string;
  githubUrl?: string;
  linkedinUrl?: string;
}

/** A planned future enhancement, listed on the About page. */
export interface FutureImprovement {
  title: string;
  description: string;
}
