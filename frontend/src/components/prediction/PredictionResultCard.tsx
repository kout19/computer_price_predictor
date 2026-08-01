/**
 * Premium animated card displaying a completed price prediction.
 * This is the visual payoff of the prediction flow: predicted price,
 * currency, model version, and generation timestamp.
 */

import { motion } from "framer-motion";
import { BadgeCheck, Calendar, DollarSign, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, formatTimestamp } from "@/lib/utils";
import type { PredictionResponse } from "@/types/prediction";

interface PredictionResultCardProps {
  result: PredictionResponse;
}

export function PredictionResultCard({
  result,
}: PredictionResultCardProps): JSX.Element {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="glow-border rounded-lg"
    >
      <Card className="border-primary/30">
        <CardContent className="flex flex-col gap-6 p-8">
          <div className="flex items-center gap-2 text-sm font-medium text-primary">
            <Sparkles className="h-4 w-4" />
            Prediction Complete
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Predicted Price</p>
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.4 }}
              className="bg-gradient-to-r from-primary to-accent bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl"
            >
              {formatCurrency(result.predicted_price, result.currency)}
            </motion.p>
          </div>

          <div className="grid grid-cols-1 gap-4 border-t border-white/10 pt-6 sm:grid-cols-3">
            <ResultDetail
              icon={<DollarSign className="h-4 w-4" />}
              label="Currency"
              value={result.currency}
            />
            <ResultDetail
              icon={<BadgeCheck className="h-4 w-4" />}
              label="Model Version"
              value={result.model_version}
            />
            <ResultDetail
              icon={<Calendar className="h-4 w-4" />}
              label="Generated At"
              value={formatTimestamp(result.generated_at)}
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

interface ResultDetailProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function ResultDetail({ icon, label, value }: ResultDetailProps): JSX.Element {
  return (
    <div className="flex items-start gap-2.5">
      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-white/5 text-primary">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="truncate text-sm font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
}
