/**
 * Grid of feature highlight cards on the Home page. Uses
 * scroll-triggered (`whileInView`) entrance animations so cards
 * animate in as the user scrolls, rather than all firing on mount.
 */

import { motion } from "framer-motion";
import {
  BarChart3,
  Cpu,
  Database,
  Gauge,
  type LucideIcon,
  ShieldCheck,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

const FEATURES: Feature[] = [
  {
    icon: Cpu,
    title: "37 Specification Fields",
    description:
      "From CPU cores to display resolution, capture every detail that drives a device's market price.",
  },
  {
    icon: Gauge,
    title: "Instant Predictions",
    description:
      "Get a price estimate in seconds via a FastAPI backend serving a pre-trained regression pipeline.",
  },
  {
    icon: BarChart3,
    title: "Transparent Model Metrics",
    description:
      "Compare MAE, MSE, RMSE, and R² across every algorithm we evaluated before choosing the best one.",
  },
  {
    icon: Database,
    title: "Rich Dataset Insights",
    description:
      "Explore the full feature breakdown and preprocessing workflow behind the trained model.",
  },
  {
    icon: ShieldCheck,
    title: "Validated Inputs",
    description:
      "Every field is validated client-side and server-side, so predictions are always based on sound data.",
  },
];

export function FeatureGrid(): JSX.Element {
  return (
    <section className="container py-16">
      <div className="mb-10 flex flex-col items-center gap-2 text-center">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Everything you need to estimate device pricing
        </h2>
        <p className="max-w-xl text-sm text-muted-foreground sm:text-base">
          Built with the same rigor as production ML systems — clean data,
          validated inputs, and transparent model performance.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
          >
            <Card className="h-full transition-transform hover:-translate-y-1">
              <CardContent className="flex flex-col gap-3 p-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
                  <feature.icon className="h-5 w-5" />
                </span>
                <h3 className="font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
