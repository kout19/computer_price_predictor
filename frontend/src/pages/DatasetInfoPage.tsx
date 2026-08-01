import { motion } from "framer-motion";
import {
  BarChart3,
  Database,
  Layers3,
  Sparkles,
  Table2,
  Workflow,
} from "lucide-react";
import { PageContainer } from "@/components/common/PageContainer";
import { SectionHeader } from "@/components/common/SectionHeader";
import { StatCard } from "@/components/common/StatCard";
import { InfoCard } from "@/components/common/InfoCard";
import { GlassPanel } from "@/components/common/GlassPanel";
import { FeatureBadge } from "@/components/common/FeatureBadge";
import { getDatasetInsights } from "@/services/modelMetricsService";
import {
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  Cell,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";

const datasetStats = [
  { value: "100,000", label: "Rows", hint: "device records" },
  { value: "38", label: "Features", hint: "including target" },
  { value: "1", label: "Target", hint: "price" },
  { value: "Regression", label: "Task", hint: "continuous output" },
];

const categoricalFeatures = [
  "device_type",
  "brand",
  "os",
  "form_factor",
  "cpu_brand",
  "cpu_series",
  "cpu_suffix",
  "gpu_suffix",
  "gpu_brand",
  "gpu_family",
  "storage_type",
  "display_type",
  "gpu_generation",
  "wifi",
];

const numericalFeatures = [
  "release_year",
  "cpu_tier",
  "cpu_cores",
  "cpu_threads",
  "cpu_base_ghz",
  "cpu_boost_ghz",
  "gpu_tier",
  "vram_gb",
  "ram_gb",
  "storage_gb",
  "storage_drive_count",
  "display_size_in",
  "refresh_hz",
  "battery_wh",
  "charger_watts",
  "psu_watts",
  "bluetooth",
  "weight_kg",
  "warranty_months",
  "cpu_generation",
  "resolution_width",
  "resolution_height",
  "megapixels",
  "price",
];

export default function DatasetInfoPage(): JSX.Element {
  const insights = getDatasetInsights();
  const chartColors = [
    "hsl(var(--primary))",
    "hsl(var(--accent))",
    "hsl(var(--secondary))",
  ];

  return (
    <PageContainer className="flex flex-col gap-10 py-10 sm:py-14">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="space-y-4"
      >
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
          <Database className="h-4 w-4" />
          Dataset overview
        </div>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Training data designed for real-world laptop and desktop pricing
        </h1>
        <p className="max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg">
          The model is trained on a large synthetic-but-structured computer
          price dataset that captures a wide range of hardware and platform
          characteristics.
        </p>
      </motion.div>

      <SectionHeader
        eyebrow="Snapshot"
        title="Dataset statistics"
        description="A compact view of the data profile used for training and inference."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {datasetStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.06 }}
          >
            <StatCard value={stat.value} label={stat.label} hint={stat.hint} />
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <GlassPanel className="p-6 sm:p-8">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <Table2 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold tracking-tight">
                Feature breakdown
              </h2>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">
                The dataset combines a mix of categorical, ordinal, and
                continuous variables that cover the main drivers of hardware
                pricing.
              </p>
            </div>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm font-semibold">Categorical features</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {categoricalFeatures.map((feature) => (
                  <FeatureBadge key={feature} label={feature} tone="accent" />
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm font-semibold">Numerical features</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {numericalFeatures.map((feature) => (
                  <FeatureBadge key={feature} label={feature} tone="muted" />
                ))}
              </div>
            </div>
          </div>
        </GlassPanel>

        <div className="space-y-4">
          <InfoCard
            icon={<Workflow className="h-5 w-5" />}
            title="Target variable"
            description="The target is the final device price, modeled as a continuous numeric value for regression."
            accent
          />
          <InfoCard
            icon={<Layers3 className="h-5 w-5" />}
            title="Machine learning task"
            description="The problem is framed as supervised regression, where the model learns relationships between specifications and price."
          />
        </div>
      </div>

      <SectionHeader
        eyebrow="Data composition"
        title="A quick look at the training distribution"
        description="The dataset is balanced enough to expose meaningful patterns across operating systems, brands, and storage types."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <GlassPanel className="p-6 sm:p-8">
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-foreground">
            <BarChart3 className="h-4 w-4 text-primary" />
            Feature type distribution
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={insights.featureTypeBreakdown}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={90}
                >
                  {insights.featureTypeBreakdown.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={chartColors[index % chartColors.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </GlassPanel>

        <GlassPanel className="p-6 sm:p-8">
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-foreground">
            <BarChart3 className="h-4 w-4 text-accent" />
            Platform and hardware mix
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={insights.osDistribution}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(148, 163, 184, 0.2)"
                />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="value"
                  fill="hsl(var(--accent))"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassPanel>
      </div>

      <SectionHeader
        eyebrow="Preprocessing"
        title="How the training pipeline prepares data"
        description="The preprocessing workflow transforms raw inputs into a consistent feature representation before model fitting."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <InfoCard
          icon={<Sparkles className="h-5 w-5" />}
          title="Missing values"
          description="Missing entries are handled during preprocessing so the model receives a complete feature matrix."
        />
        <InfoCard
          icon={<Layers3 className="h-5 w-5" />}
          title="Encoding"
          description="Categorical values are converted into model-compatible representations for the downstream estimator."
        />
        <InfoCard
          icon={<Workflow className="h-5 w-5" />}
          title="Scaling"
          description="Continuous features are normalized to ensure the estimator is not dominated by magnitude differences."
        />
        <InfoCard
          icon={<Database className="h-5 w-5" />}
          title="Feature engineering"
          description="The pipeline keeps the feature set structured and consistent between training and prediction."
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <GlassPanel className="p-6 sm:p-8">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent/15 text-accent">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold tracking-tight">
                Train / test split
              </h2>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">
                The data is partitioned into training and holdout subsets to
                evaluate model generalization and avoid overfitting during model
                selection.
              </p>
            </div>
          </div>
        </GlassPanel>

        <GlassPanel className="p-6 sm:p-8">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <Database className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold tracking-tight">
                Dataset profile
              </h2>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">
                The current synthesis includes{" "}
                {insights.overview.totalRecords.toLocaleString()} rows,{" "}
                {insights.overview.totalFeatures} features, and a price target
                designed to support realistic regression behavior.
              </p>
            </div>
          </div>
        </GlassPanel>
      </div>
    </PageContainer>
  );
}
