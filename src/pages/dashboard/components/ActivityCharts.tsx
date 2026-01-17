import { CustomBarChart } from "@/common/charts/BarChart";
import { CustomPieChart } from "@/common/charts/PieChart";
import { CommonContainer } from "@/common/common-container";
import type { Category } from "@/types";
import {
  Calendar,
  PieChart as PieChartIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { SmartEmptyState } from "@/components/SmartEmptyState";

interface ActivityChartsProps {
  weeklyData: any[];
  categoryData: any[];
  categoryColors: Record<Category, string>;
  startDate: Date;
  endDate: Date;
  onPreviousWeek: () => void;
  onNextWeek: () => void;
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

const formatWeekRange = (startDate: Date, endDate: Date): string => {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString(undefined, {
      day: "numeric",
      month: "short",
    });
  };
  return `${formatDate(startDate)} to ${formatDate(endDate)}`;
};

export const ActivityCharts = ({
  weeklyData,
  categoryData,
  categoryColors,
  startDate,
  endDate,
  onPreviousWeek,
  onNextWeek,
  selectedDate,
  onDateChange,
}: ActivityChartsProps) => {
  const selectedDateStr = selectedDate.toISOString().split("T")[0];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <CommonContainer
        title="Weekly Activity"
        icon={<Calendar size={20} />}
        headerClassName="pb-6"
        contentClassName="pt-0"
        rightElement={
          <div className="flex items-center gap-2">
            <button
              onClick={onPreviousWeek}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
              aria-label="Previous week"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="text-sm font-medium min-w-[140px] text-center">
              {formatWeekRange(startDate, endDate)}
            </span>
            <button
              onClick={onNextWeek}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
              aria-label="Next week"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        }
      >
        <CustomBarChart
          data={weeklyData}
          dataKey="hours"
          xAxisKey="displayDate"
          yAxisLabel="Hours"
          yAxisDomain={[0, 24]}
        />
      </CommonContainer>

      <CommonContainer
        title="Category Breakdown"
        icon={<PieChartIcon size={20} className="text-emerald-400" />}
        headerClassName="pb-6"
        contentClassName="pt-0"
        rightElement={
          <div className="relative z-10">
            <DatePicker
              selected={selectedDate}
              onChange={(date: Date | null) => onDateChange(date || new Date())}
              className="bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full md:w-auto"
              dateFormat="MMM d, yyyy"
            />
          </div>
        }
      >
        <div className="h-[300px] w-full flex items-center justify-center">
          {categoryData.length > 0 ? (
            <CustomPieChart
              data={categoryData}
              dataKey="value"
              nameKey="name"
              colors={categoryColors}
            />
          ) : (
            <SmartEmptyState date={selectedDateStr} type="chart" />
          )}
        </div>
      </CommonContainer>
    </div>
  );
};
