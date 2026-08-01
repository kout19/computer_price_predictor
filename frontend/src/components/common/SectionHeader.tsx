import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  action?: ReactNode;
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  action,
}: SectionHeaderProps): JSX.Element {
  const alignmentClass =
    align === "center" ? "items-center text-center" : "items-start text-left";

  return (
    <div className={cn("flex flex-col gap-3", alignmentClass)}>
      {eyebrow ? (
        <p className="text-sm font-medium uppercase tracking-[0.25em] text-primary">
          {eyebrow}
        </p>
      ) : null}
      <div className="flex w-full items-end justify-between gap-4">
        <div
          className={cn(
            "flex flex-col gap-2",
            align === "center" ? "items-center" : "items-start",
          )}
        >
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {title}
          </h2>
          {description ? (
            <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
              {description}
            </p>
          ) : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
    </div>
  );
}
