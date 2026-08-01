import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { GlassPanel } from "@/components/common/GlassPanel";
import { FeatureBadge } from "@/components/common/FeatureBadge";

interface ModelCardProps {
  title: string;
  description: string;
  advantages: string[];
  disadvantages: string[];
  trainingSpeed: string;
  interpretability: string;
  quality: string;
  highlight?: boolean;
  icon?: ReactNode;
}

export function ModelCard({
  title,
  description,
  advantages,
  disadvantages,
  trainingSpeed,
  interpretability,
  quality,
  highlight = false,
  icon,
}: ModelCardProps): JSX.Element {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.2 }}
    >
      <GlassPanel
        className={highlight ? "border-primary/30 bg-primary/10" : ""}
      >
        <div className="flex flex-col gap-5 p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {description}
              </p>
            </div>
            {icon ? (
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
                {icon}
              </div>
            ) : null}
          </div>
          <div className="flex flex-wrap gap-2">
            <FeatureBadge
              label={trainingSpeed}
              tone={highlight ? "accent" : "default"}
            />
            <FeatureBadge label={interpretability} tone="muted" />
            <FeatureBadge
              label={quality}
              tone={highlight ? "accent" : "muted"}
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm font-semibold">Advantages</p>
              <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                {advantages.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold">Disadvantages</p>
              <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                {disadvantages.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-accent" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </GlassPanel>
    </motion.div>
  );
}
