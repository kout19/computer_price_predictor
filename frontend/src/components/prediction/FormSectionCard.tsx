/**
 * Consistent card wrapper for each of the 7 prediction form sections
 * (General, CPU, GPU, Memory, Display, Connectivity, Power). Provides
 * a uniform icon + title header and staggered entrance animation.
 */

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FormSectionCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  children: ReactNode;
  index: number;
}

export function FormSectionCard({
  icon,
  title,
  description,
  children,
  index,
}: FormSectionCardProps): JSX.Element {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3) }}
    >
      <Card>
        <CardHeader className="flex-row items-center gap-3 space-y-0">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
            {icon}
          </span>
          <div>
            <CardTitle className="text-base">{title}</CardTitle>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {children}
        </CardContent>
      </Card>
    </motion.div>
  );
}
