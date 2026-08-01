import featureImportanceData from "@/data/feature-importance.json";
import modelMetricsData from "@/data/model-metrics.json";
import datasetInsightsData from "@/data/dataset-insights.json";
import type {
  DatasetInsights,
  FeatureImportancePoint,
  ModelMetrics,
  ModelMetricsWithMeta,
} from "@/types/model";

export function getFeatureImportance(): FeatureImportancePoint[] {
  return featureImportanceData as FeatureImportancePoint[];
}

export function getModelMetrics(): ModelMetricsWithMeta[] {
  return modelMetricsData as ModelMetricsWithMeta[];
}

export function getDatasetInsights(): DatasetInsights {
  return datasetInsightsData as DatasetInsights;
}

export function getBestModel():
  | ModelMetrics
  | ModelMetricsWithMeta
  | undefined {
  return getModelMetrics().find((model) => model.isBestModel);
}
