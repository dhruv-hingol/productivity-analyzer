import { formatHoursToTime } from "@/utils/helpers";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface BarChartProps {
  data: any[];
  dataKey: string;
  xAxisKey: string;
  fill?: string;
  height?: number | string;
  yAxisLabel?: string;
  yAxisDomain?: [number, number];
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    color: string;
    [key: string]: any;
  }>;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const hours = payload[0].value as number;
    return (
      <div
        style={{
          backgroundColor: "var(--card)",
          border: "1px solid var(--border)",
          borderRadius: "12px",
          padding: "8px 12px",
        }}
      >
        <p
          style={{
            color: "var(--foreground)",
            margin: 0,
            fontSize: "14px",
            fontWeight: 500,
          }}
        >
          {label}
        </p>
        <p
          style={{
            color: "var(--foreground)",
            margin: "4px 0 0 0",
            fontSize: "14px",
          }}
        >
          <span style={{ color: payload[0].color }}>Time: </span>
          {formatHoursToTime(hours)}
        </p>
      </div>
    );
  }
  return null;
};

export const CustomBarChart = ({
  data,
  dataKey,
  xAxisKey,
  fill = "#4f46e5",
  height = 300,
  yAxisLabel,
  yAxisDomain,
}: BarChartProps) => (
  <div style={{ height, width: "100%" }}>
    <ResponsiveContainer width="100%" height="100%">
      <RechartsBarChart data={data}>
        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
          stroke="var(--border)"
        />
        <XAxis
          dataKey={xAxisKey}
          axisLine={false}
          tickLine={false}
          tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
          dy={10}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
          domain={yAxisDomain}
          label={
            yAxisLabel
              ? {
                  value: yAxisLabel,
                  angle: -90,
                  position: "insideLeft",
                  fill: "var(--muted-foreground)",
                  fontSize: 12,
                }
              : undefined
          }
        />
        <Tooltip
          content={<CustomTooltip />}
          cursor={{ fill: "var(--accent)", opacity: 0.1 }}
        />
        <Bar dataKey={dataKey} fill={fill} radius={[6, 6, 0, 0]} />
      </RechartsBarChart>
    </ResponsiveContainer>
  </div>
);
