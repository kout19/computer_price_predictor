import { motion } from "framer-motion";
import {
  ArrowRight,
  Cpu,
  Database,
  Layers3,
  Sparkles,
  Workflow,
} from "lucide-react";
import { Link } from "react-router-dom";
import { PageContainer } from "@/components/common/PageContainer";
import { SectionHeader } from "@/components/common/SectionHeader";
import { GlassPanel } from "@/components/common/GlassPanel";
import { InfoCard } from "@/components/common/InfoCard";
import { FeatureBadge } from "@/components/common/FeatureBadge";
import { Button } from "@/components/ui/button";
import { FeatureImportanceChart } from "@/components/charts/FeatureImportanceChart";
import {
  getBestModel,
  getFeatureImportance,
} from "@/services/modelMetricsService";

const models = [
  "Linear Regression",
  "Ridge",
  "Lasso",
  "Decision Tree",
  "Random Forest",
  "Gradient Boosting",
];

const pipelineSteps = [
  "Dataset",
  "Preprocessing",
  "Feature Engineering",
  "Encoding",
  "Scaling",
  "Gradient Boosting",
  "Prediction",
];

export default function ModelInfoPage(): JSX.Element {
  const featureImportance = getFeatureImportance();
  const bestModel = getBestModel();

  return (
    <PageContainer className="flex flex-col gap-10 py-10 sm:py-14">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="space-y-4"
      >
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
          <Cpu className="h-4 w-4" />
          Model overview
        </div>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          A production-style modeling workflow for price estimation
        </h1>
        <p className="max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg">
          Multiple regression candidates were evaluated before selecting the
          strongest performer for the prediction experience.
        </p>
      </motion.div>

      <SectionHeader
        eyebrow="Models evaluated"
        title="Candidate algorithms"
        description="The app compares several classic and ensemble regressors to identify the most reliable estimator."
      />

      <GlassPanel className="p-6 sm:p-8">
        <div className="flex flex-wrap gap-2">
          {models.map((model) => (
            <FeatureBadge
              key={model}
              label={model}
              tone={model === "Gradient Boosting" ? "accent" : "default"}
            />
          ))}
        </div>
      </GlassPanel>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <InfoCard
          icon={<Database className="h-5 w-5" />}
          title="Linear Regression"
          description="A simple baseline that provides strong interpretability and fast training."
        />
        <InfoCard
          icon={<Workflow className="h-5 w-5" />}
          title="Ridge"
          description="Adds regularization to reduce overfitting while keeping a linear structure."
        />
        <InfoCard
          icon={<Layers3 className="h-5 w-5" />}
          title="Lasso"
          description="Encourages sparsity and can be useful when feature selection matters."
        />
        <InfoCard
          icon={<Cpu className="h-5 w-5" />}
          title="Decision Tree"
          description="Captures nonlinear patterns but can be unstable without careful tuning."
        />
        <InfoCard
          icon={<Database className="h-5 w-5" />}
          title="Random Forest"
          description="An ensemble of trees that improves robustness and reduces variance."
        />
        <InfoCard
          icon={<Sparkles className="h-5 w-5" />}
          title="Gradient Boosting"
          description="A sequential boosting approach that often delivers the best predictive quality on structured tabular data."
          accent
        />
      </div>

      <SectionHeader
        eyebrow="Selection rationale"
        title="Why Gradient Boosting was selected"
        description="The selected model balances strong predictive power, stability, and suitability for the structured tabular data in this project."
      />

      <GlassPanel className="p-6 sm:p-8">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <p className="text-base leading-8 text-muted-foreground">
            Gradient Boosting stood out because it can model nonlinear
            relationships between hardware specifications and price while
            retaining strong performance on tabular data. It also provides a
            practical fit for an interview-ready ML product experience where the
            emphasis is on accurate predictions rather than purely interpretable
            baselines.
          </p>
          <div className="rounded-xl border border-primary/20 bg-primary/10 p-4">
            <p className="text-sm font-semibold text-primary">Best performer</p>
            <p className="mt-2 text-lg font-semibold text-foreground">
              {bestModel?.modelName ?? "Gradient Boosting"}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              R² {bestModel ? bestModel.r2Score.toFixed(2) : "0.82"} · RMSE{" "}
              {bestModel ? bestModel.rmse.toFixed(1) : "177.6"}
            </p>
          </div>
        </div>
      </GlassPanel>

      <SectionHeader
        eyebrow="Feature influence"
        title="Which signals matter most"
        description="The imported feature importance profile gives a compact view of the attributes driving the price estimate."
      />

      <GlassPanel className="p-6 sm:p-8">
        <FeatureImportanceChart data={featureImportance} />
      </GlassPanel>

      <SectionHeader
        eyebrow="Pipeline architecture"
        title="Model workflow"
        description="The full pipeline transforms raw features into a final price prediction."
      />

      <GlassPanel className="p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-center gap-3">
          {pipelineSteps.map((step, index) => (
            <div key={step} className="flex items-center gap-3">
              <div className="rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                {step}
              </div>
              {index < pipelineSteps.length - 1 ? (
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              ) : null}
            </div>
          ))}
        </div>
      </GlassPanel>

      <div className="flex justify-center">
        <Button asChild variant="glow">
          <Link to="/model-comparison">Explore model comparison</Link>
        </Button>
      </div>
    </PageContainer>
  );
}
