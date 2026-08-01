import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GlassPanelProps {
  children: ReactNode;
  className?: string;
}

export function GlassPanel({
  children,
  className,
}: GlassPanelProps): JSX.Element {
  return (
    <div className={cn("glass-panel rounded-xl shadow-lg", className)}>
      {children}
    </div>
  );
}
