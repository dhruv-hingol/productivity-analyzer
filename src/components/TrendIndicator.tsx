import { ArrowUp, ArrowDown, Minus } from "lucide-react";

interface TrendIndicatorProps {
  value: number;
  label?: string;
  showPercentage?: boolean;
}

export const TrendIndicator = ({
  value,
  label,
  showPercentage = true,
}: TrendIndicatorProps) => {
  const isPositive = value > 0;
  const isNeutral = value === 0;
  const absValue = Math.abs(value);

  const colorClass = isPositive
    ? "text-green-500"
    : isNeutral
    ? "text-muted-foreground"
    : "text-red-500";

  const Icon = isPositive ? ArrowUp : isNeutral ? Minus : ArrowDown;

  return (
    <div
      className={`flex items-center gap-1 ${colorClass} text-sm font-medium`}
    >
      <Icon className="w-4 h-4" />
      <span>
        {showPercentage && absValue > 0 && `${absValue.toFixed(1)}%`}
        {label && ` ${label}`}
      </span>
    </div>
  );
};
