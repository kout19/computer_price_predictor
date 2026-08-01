import { motion } from "framer-motion";
import { GlassPanel } from "@/components/common/GlassPanel";

interface StatCardProps {
  value: string;
  label: string;
  hint?: string;
}

export function StatCard({ value, label, hint }: StatCardProps): JSX.Element {
  return (
    <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
      <GlassPanel className="h-full p-6 text-center">
        <p className="bg-gradient-to-r from-primary to-accent bg-clip-text text-3xl font-semibold tracking-tight text-transparent sm:text-4xl">
          {value}
        </p>
        <p className="mt-2 text-sm font-medium text-foreground">{label}</p>
        {hint ? (
          <p className="mt-2 text-xs text-muted-foreground">{hint}</p>
        ) : null}
      </GlassPanel>
    </motion.div>
  );
}
