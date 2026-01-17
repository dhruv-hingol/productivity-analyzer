import { formatHoursToTime } from "@/lib/utils";
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface PieChartProps {
  data: any[];
  dataKey: string;
  nameKey: string;
  colors: Record<string, string>;
  height?: number | string;
  innerRadius?: number;
  outerRadius?: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    name: string;
    payload: {
      fill: string;
      [key: string]: any;
    };
    [key: string]: any;
  }>;
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const hours = payload[0].value as number;
    const name = payload[0].name;
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
          {name}
        </p>
        <p
          style={{
            color: "var(--foreground)",
            margin: "4px 0 0 0",
            fontSize: "14px",
          }}
        >
          <span style={{ color: payload[0].payload.fill }}>Time: </span>
          {formatHoursToTime(hours)}
        </p>
      </div>
    );
  }
  return null;
};

export const CustomPieChart = ({
  data,
  dataKey,
  nameKey,
  colors,
  height = 300,
  innerRadius = 0,
  outerRadius = 110,
}: PieChartProps) => (
  <div style={{ height, width: "100%" }}>
    <ResponsiveContainer width="100%" height="100%">
      <RechartsPieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          dataKey={dataKey}
          nameKey={nameKey}
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={colors[entry[nameKey]] || "#ccc"}
            />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend verticalAlign="bottom" height={36} />
      </RechartsPieChart>
    </ResponsiveContainer>
  </div>
);
