import type { ReactNode } from "react";
import { GlassPanel } from "@/components/common/GlassPanel";

interface MetricCardProps {
  label: string;
  value: string;
  description?: string;
  icon?: ReactNode;
}

export function MetricCard({
  label,
  value,
  description,
  icon,
}: MetricCardProps): JSX.Element {
  return (
    <GlassPanel className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-2 text-xl font-semibold tracking-tight">{value}</p>
          {description ? (
            <p className="mt-2 text-sm text-muted-foreground">{description}</p>
          ) : null}
        </div>
        {icon ? (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
            {icon}
          </div>
        ) : null}
      </div>
    </GlassPanel>
  );
}
