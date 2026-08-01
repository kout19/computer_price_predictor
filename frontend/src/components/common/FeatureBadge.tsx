import { cn } from "@/lib/utils";

interface FeatureBadgeProps {
  label: string;
  tone?: "default" | "accent" | "muted";
}

export function FeatureBadge({
  label,
  tone = "default",
}: FeatureBadgeProps): JSX.Element {
  const toneClasses = {
    default: "border-white/15 bg-white/5 text-foreground",
    accent: "border-primary/30 bg-primary/15 text-primary",
    muted: "border-white/10 bg-white/10 text-muted-foreground",
  };

  return (
    <span
      className={cn("rounded-full border px-3 py-1 text-sm", toneClasses[tone])}
    >
      {label}
    </span>
  );
}
