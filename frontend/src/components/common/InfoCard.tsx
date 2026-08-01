import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { GlassPanel } from "@/components/common/GlassPanel";

interface InfoCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  accent?: boolean;
}

export function InfoCard({
  icon,
  title,
  description,
  accent = false,
}: InfoCardProps): JSX.Element {
  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.01 }}
      transition={{ duration: 0.2 }}
    >
      <GlassPanel className={accent ? "border-primary/30 bg-primary/10" : ""}>
        <div className="flex flex-col gap-3 p-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/15 text-primary">
            {icon}
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
            <p className="text-sm leading-6 text-muted-foreground">
              {description}
            </p>
          </div>
        </div>
      </GlassPanel>
    </motion.div>
  );
}
