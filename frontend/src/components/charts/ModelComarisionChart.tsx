import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ModelMetricsWithMeta } from "@/types/model";

interface ModelComparisonChartProps {
  data: ModelMetricsWithMeta[];
}

export function ModelComparisonChart({
  data,
}: ModelComparisonChartProps): JSX.Element {
  const chartData = data.map((model) => ({
    name: model.modelName,
    r2: model.r2Score,
    rmse: model.rmse,
  }));

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(148, 163, 184, 0.2)"
          />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 12 }}
            angle={-10}
            textAnchor="end"
            height={70}
          />
          <YAxis
            yAxisId="left"
            domain={[0, 1]}
            tickFormatter={(value) => `${value.toFixed(2)}`}
          />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip />
          <Legend />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="r2"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="rmse"
            stroke="hsl(var(--accent))"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
