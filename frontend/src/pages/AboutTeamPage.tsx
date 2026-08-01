import { motion } from "framer-motion";
import { Code2, Cpu, Rocket, Sparkles, Workflow } from "lucide-react";
import { PageContainer } from "@/components/common/PageContainer";
import { SectionHeader } from "@/components/common/SectionHeader";
import { GlassPanel } from "@/components/common/GlassPanel";
import { FeatureBadge } from "@/components/common/FeatureBadge";

const stackItems = [
  "React 19",
  "TypeScript",
  "Vite",
  "Tailwind CSS",
  "FastAPI",
  "TanStack Query",
  "Framer Motion",
];

export default function AboutTeamPage(): JSX.Element {
  return (
    <PageContainer className="flex flex-col gap-10 py-10 sm:py-14">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="space-y-4"
      >
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
          <Code2 className="h-4 w-4" />
          About the developer
        </div>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Building polished AI products with full-stack discipline
        </h1>
        <p className="max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg">
          This project is shaped by a single developer who focuses on user
          experience, clean architecture, and an interview-ready demonstration
          of machine learning in practice.
        </p>
      </motion.div>

      <GlassPanel className="overflow-hidden p-0">
        <div className="grid gap-0 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="bg-gradient-to-br from-primary/20 via-background/70 to-accent/15 p-8 sm:p-10">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <Cpu className="h-6 w-6" />
            </div>
            <h2 className="mt-6 text-2xl font-semibold tracking-tight">
              Full Stack Developer
            </h2>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              AI Engineer • Machine Learning Enthusiast
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {stackItems.map((item) => (
                <FeatureBadge key={item} label={item} tone="accent" />
              ))}
            </div>
          </div>
          <div className="p-8 sm:p-10">
            <p className="text-base leading-8 text-muted-foreground">
              The project blends modern frontend engineering with practical ML
              product thinking. The focus is not only on predictive accuracy,
              but also on making the experience clear, polished, and easy to
              understand for product stakeholders and interviewers.
            </p>
          </div>
        </div>
      </GlassPanel>

      <SectionHeader
        eyebrow="Profile"
        title="Project vision"
        description="The product is designed to feel like a thoughtful demo, not a rough prototype."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <GlassPanel className="p-6 sm:p-8">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <Rocket className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold tracking-tight">
                Project Vision
              </h3>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">
                Deliver a premium, interview-ready experience that demonstrates
                how ML can be packaged into a user-friendly prediction product.
              </p>
            </div>
          </div>
        </GlassPanel>
        <GlassPanel className="p-6 sm:p-8">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <Workflow className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold tracking-tight">
                Development Process
              </h3>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">
                The UI is structured around clear reusable components,
                accessible interactions, and subtle motion to keep the
                experience polished without feeling overdesigned.
              </p>
            </div>
          </div>
        </GlassPanel>
      </div>

      <GlassPanel className="p-6 sm:p-8">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-sm font-medium text-primary">
            <Sparkles className="h-4 w-4" />
            Future improvements
          </div>
          <p className="text-sm leading-7 text-muted-foreground">
            Planned next steps include richer visualizations, benchmark-backed
            metrics, and a stronger model explainability layer so the product
            can evolve beyond the initial demo.
          </p>
        </div>
      </GlassPanel>
    </PageContainer>
  );
}
