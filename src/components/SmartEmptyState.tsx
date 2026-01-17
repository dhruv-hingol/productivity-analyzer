import { getTodayDate } from "@/utils/helpers";

interface SmartEmptyStateProps {
  date: string;
  type?: "table" | "chart";
}

export const SmartEmptyState = ({
  date,
  type = "table",
}: SmartEmptyStateProps) => {
  const today = getTodayDate();
  const selectedDate = new Date(date);
  const todayDate = new Date(today);

  const isToday = date === today;
  const isFuture = selectedDate > todayDate;
  const isPast = selectedDate < todayDate;

  if (isFuture) {
    return (
      <div className="py-12 text-center">
        <p className="text-lg font-medium text-muted-foreground">
          📅 Future Date
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Cannot show data for dates in the future
        </p>
      </div>
    );
  }

  if (isToday) {
    return (
      <div className="py-12 text-center">
        <p className="text-lg font-medium text-foreground">
          👋 No activity tracked yet today
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Start browsing to see your productivity data appear here
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Your time will be tracked automatically (idle time excluded)
        </p>
      </div>
    );
  }

  if (isPast) {
    const dayOfWeek = selectedDate.toLocaleDateString(undefined, {
      weekday: "long",
    });
    return (
      <div className="py-12 text-center">
        <p className="text-lg font-medium text-muted-foreground">
          📊 No data recorded
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          No activity was tracked on {dayOfWeek},{" "}
          {selectedDate.toLocaleDateString()}
        </p>
        {type === "table" && (
          <p className="text-xs text-muted-foreground mt-1">
            Try selecting a different date to view your activity
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="py-12 text-center">
      <p className="text-semibold text-center text-muted-foreground">
        No data found
      </p>
    </div>
  );
};
