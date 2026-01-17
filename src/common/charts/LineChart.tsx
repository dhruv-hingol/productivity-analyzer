import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface LineChartProps {
  data: any[];
  dataKey: string;
  xAxisKey: string;
  stroke?: string;
  height?: number | string;
  yAxisLabel?: string;
}

export const CustomLineChart = ({
  data,
  dataKey,
  xAxisKey,
  stroke = "#4f46e5",
  height = 300,
  yAxisLabel,
}: LineChartProps) => (
  <div style={{ height, width: "100%" }}>
    <ResponsiveContainer width="100%" height="100%">
      <RechartsLineChart data={data}>
        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
          stroke="#1e293b"
        />
        <XAxis
          dataKey={xAxisKey}
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#64748b", fontSize: 12 }}
          dy={10}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#64748b", fontSize: 12 }}
          label={
            yAxisLabel
              ? {
                  value: yAxisLabel,
                  angle: -90,
                  position: "insideLeft",
                  fill: "#64748b",
                  fontSize: 12,
                }
              : undefined
          }
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#020617",
            border: "1px solid #1e293b",
            borderRadius: "12px",
          }}
          itemStyle={{ color: "#fff" }}
        />
        <Line
          type="monotone"
          dataKey={dataKey}
          stroke={stroke}
          strokeWidth={2}
          dot={{ r: 4, fill: stroke }}
          activeDot={{ r: 6 }}
        />
      </RechartsLineChart>
    </ResponsiveContainer>
  </div>
);
