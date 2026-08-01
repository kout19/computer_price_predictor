/**
 * Full-viewport (or inline) loading indicator with a premium,
 * animated look. Used as the Suspense fallback for lazy-loaded routes
 * and reusable anywhere a branded loading state is needed.
 */

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface PageLoaderProps {
  /** "fullscreen" centers within the viewport; "inline" fits a container. */
  variant?: "fullscreen" | "inline";
  label?: string;
}

export function PageLoader({
  variant = "fullscreen",
  label = "Loading...",
}: PageLoaderProps): JSX.Element {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4",
        variant === "fullscreen"
          ? "min-h-screen w-full"
          : "min-h-[240px] w-full",
      )}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative flex h-16 w-16 items-center justify-center"
      >
        <div className="absolute inset-0 animate-pulse-glow rounded-full bg-primary/20 blur-xl" />
        <Loader2 className="relative h-8 w-8 animate-spin text-primary" />
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.3 }}
        className="text-sm font-medium text-muted-foreground"
      >
        {label}
      </motion.p>
    </div>
  );
}
