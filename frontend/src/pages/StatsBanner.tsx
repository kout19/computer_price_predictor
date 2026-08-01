/**
 * Stat strip reinforcing platform credibility (dataset size, feature
 * count, best model R²). Values are placeholders — update once real
 * dataset/model statistics are available (see DatasetOverview type).
 */

import { motion } from "framer-motion";

interface Stat {
  value: string;
  label: string;
}

const STATS: Stat[] = [
  { value: "37", label: "Input Features" },
  { value: "5+", label: "Regression Models Evaluated" },
  { value: "< 50Sec", label: "Average Prediction Time" },
  { value: "0.87+", label: "Best Model R² Score" },
];

export function StatsBanner(): JSX.Element {
  return (
    <section className="container pb-16">
      <div className="glass-panel grid grid-cols-2 gap-6 p-8 sm:grid-cols-4">
        {STATS.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.08 }}
            className="flex flex-col items-center gap-1 text-center"
          >
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-3xl font-bold text-transparent">
              {stat.value}
            </span>
            <span className="text-xs text-muted-foreground sm:text-sm">
              {stat.label}
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
