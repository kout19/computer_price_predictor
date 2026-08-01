import { motion } from "framer-motion";
import { BarChart3, Gauge, Sparkles, TimerReset } from "lucide-react";
import { PageContainer } from "@/components/common/PageContainer";
import { SectionHeader } from "@/components/common/SectionHeader";
import { GlassPanel } from "@/components/common/GlassPanel";
import { ModelCard } from "@/components/common/ModelCard";
import { FeatureBadge } from "@/components/common/FeatureBadge";
import { ModelComparisonChart } from "@/components/charts/ModelComarisionChart";
import { getModelMetrics } from "@/services/modelMetricsService";

const models = [
  {
    title: "Linear Regression",
    description: "A strong baseline that is easy to explain and train quickly.",
    advantages: ["Fast to train", "Highly interpretable"],
    disadvantages: ["Can underfit nonlinear relationships"],
    trainingSpeed: "Fast",
    interpretability: "High",
    quality: "Baseline",
  },
  {
    title: "Ridge",
    description:
      "Adds regularization to reduce variance while preserving a linear form.",
    advantages: [
      "More stable than plain linear regression",
      "Good for noisy features",
    ],
    disadvantages: ["Still limited in capturing nonlinear effects"],
    trainingSpeed: "Fast",
    interpretability: "High",
    quality: "Solid",
  },
  {
    title: "Lasso",
    description: "Useful for sparse feature selection and simpler explanation.",
    advantages: ["Feature selection", "Reduced overfitting"],
    disadvantages: ["Can discard useful signals"],
    trainingSpeed: "Fast",
    interpretability: "High",
    quality: "Moderate",
  },
  {
    title: "Decision Tree",
    description:
      "Captures nonlinear patterns with a simple tree-based structure.",
    advantages: ["Flexibility", "Quick to inspect"],
    disadvantages: ["Prone to overfitting"],
    trainingSpeed: "Medium",
    interpretability: "Medium",
    quality: "Good",
  },
  {
    title: "Random Forest",
    description:
      "An ensemble of trees that provides more robustness than a single decision tree.",
    advantages: ["Robust", "Handles nonlinear structure well"],
    disadvantages: ["Less interpretable than linear models"],
    trainingSpeed: "Medium",
    interpretability: "Medium",
    quality: "Very good",
  },
  {
    title: "Gradient Boosting",
    description:
      "Sequential boosting can capture subtle nonlinear patterns and deliver strong regression performance.",
    advantages: ["Excellent predictive quality", "Strong on tabular data"],
    disadvantages: [
      "Slightly slower to train",
      "Less transparent than linear models",
    ],
    trainingSpeed: "Medium",
    interpretability: "Medium",
    quality: "Best",
    highlight: true,
  },
];

export default function ModelComparisonPage(): JSX.Element {
  const modelMetrics = getModelMetrics();
  const bestModel = modelMetrics.find((model) => model.isBestModel);

  return (
    <PageContainer className="flex flex-col gap-10 py-10 sm:py-14">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="space-y-4"
      >
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
          <BarChart3 className="h-4 w-4" />
          Model comparison
        </div>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Comparing the evaluated regression approaches
        </h1>
        <p className="max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg">
          Each model is reviewed for accuracy potential, interpretability, and
          training efficiency so the selected approach is easy to justify.
        </p>
      </motion.div>

      <SectionHeader
        eyebrow="Selected model"
        title="Gradient Boosting"
        description="The chosen model for production-style inference and interview presentation."
      />

      <GlassPanel className="p-6 sm:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <FeatureBadge
                label={`Prediction quality: ${bestModel?.quality ?? "Best"}`}
                tone="accent"
              />
              <FeatureBadge
                label={`Training speed: ${bestModel?.trainingSpeed ?? "Medium"}`}
                tone="muted"
              />
              <FeatureBadge
                label={`Interpretability: ${bestModel?.interpretability ?? "Medium"}`}
                tone="muted"
              />
            </div>
            <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
              Gradient Boosting is highlighted as the selected learner because
              it offers a strong balance of predictive performance and practical
              deployment fit for structured tabular data.
            </p>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-primary">
            <Sparkles className="h-4 w-4" />
            Selected for the live prediction experience
          </div>
        </div>
      </GlassPanel>

      <GlassPanel className="p-6 sm:p-8">
        <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-foreground">
          <BarChart3 className="h-4 w-4 text-primary" />
          Performance overview
        </div>
        <ModelComparisonChart data={modelMetrics} />
      </GlassPanel>

      <div className="grid gap-6 lg:grid-cols-2">
        {models.map((model) => (
          <ModelCard
            key={model.title}
            {...model}
            icon={<Gauge className="h-5 w-5" />}
          />
        ))}
      </div>

      <GlassPanel className="p-6 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">
              Benchmark snapshot
            </h2>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">
              The dashboard now references a small local benchmark set for MAE,
              RMSE, and R² so the comparison page reads like a real model
              evaluation report instead of a placeholder screen.
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <TimerReset className="h-4 w-4" />
            Ready for richer future evaluation data
          </div>
        </div>
      </GlassPanel>
    </PageContainer>
  );
}
