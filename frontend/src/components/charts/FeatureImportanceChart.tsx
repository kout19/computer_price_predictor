import {
  BarChart,
  Bar,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { FeatureImportancePoint } from "@/types/model";

interface FeatureImportanceChartProps {
  data: FeatureImportancePoint[];
}

export function FeatureImportanceChart({
  data,
}: FeatureImportanceChartProps): JSX.Element {
  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(148, 163, 184, 0.2)"
          />
          <XAxis
            type="number"
            domain={[0, 0.2]}
            tickFormatter={(value) => `${value.toFixed(2)}`}
          />
          <YAxis dataKey="feature" interval={0} type="category" width={140} />
          <Tooltip
            cursor={{ fill: "rgba(99, 102, 241, 0.08)" }}
            formatter={(value: number) => [`${value.toFixed(3)}`, "Importance"]}
          />
          <Bar
            dataKey="importance"
            fill="hsl(var(--primary))"
            radius={[0, 8, 8, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
