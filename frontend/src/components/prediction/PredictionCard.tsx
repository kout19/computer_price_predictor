import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  CalendarRange,
  CircleDollarSign,
  Sparkles,
} from "lucide-react";
import { GlassPanel } from "@/components/common/GlassPanel";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatTimestamp } from "@/lib/utils";
import type { PredictionResponse } from "@/types/prediction";

interface PredictionCardProps {
  result: PredictionResponse;
}

export function PredictionCard({ result }: PredictionCardProps): JSX.Element {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="mx-auto w-full max-w-3xl"
    >
      <GlassPanel className="border-primary/30 bg-gradient-to-br from-primary/10 via-background/80 to-accent/10 p-0">
        <div className="flex flex-col gap-8 p-10 sm:p-10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm font-medium text-primary">
              <Sparkles className="h-4 w-4" />
              Prediction ready
            </div>
            <div className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm text-primary">
              Confidence placeholder
            </div>
          </div>
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.28em] text-muted-foreground">
              Predicted Price
            </p>
            <p className="bg-gradient-to-r from-primary to-accent bg-clip-text text-5xl font-bold tracking-tight text-transparent sm:text-6xl">
              {formatCurrency(result.predicted_price, result.currency)}
            </p>
            <p className="max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
              This prediction is generated using the trained Gradient Boosting
              regression model and the selected feature set.
            </p>
          </div>
          <div className="grid gap-4 rounded-xl border border-white/10 bg-white/5 p-5 sm:grid-cols-3">
            <div className="flex items-start gap-3">
              <CircleDollarSign className="mt-0.5 h-4 w-4 text-primary" />
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Currency
                </p>
                <p className="mt-1 text-sm font-semibold">{result.currency}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <BadgeCheck className="mt-0.5 h-4 w-4 text-primary" />
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Model Version
                </p>
                <p className="mt-1 text-sm font-semibold">
                  {result.model_version}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CalendarRange className="mt-0.5 h-4 w-4 text-primary" />
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Prediction Time
                </p>
                <p className="mt-1 text-sm font-semibold">
                  {formatTimestamp(result.generated_at)}
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
            <p className="text-sm text-muted-foreground">
              Ready for demo presentation and further analysis.
            </p>
            <Button asChild variant="glow" size="sm">
              <a href="/model-info">
                Review model details
                <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </GlassPanel>
    </motion.div>
  );
}
