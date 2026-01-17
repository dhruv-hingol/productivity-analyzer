import { PieChart } from "lucide-react";
import { Text } from "@/components/ui/text";
import { CATEGORY_COLORS } from "@/content";
import type { Category } from "@/types";
import { formatDuration } from "@/utils/format";

interface PopupCategorySummaryProps {
  categorySummary: Record<Category, number>;
  totalSeconds: number;
}

export const PopupCategorySummary = ({
  categorySummary,
  totalSeconds,
}: PopupCategorySummaryProps) => {
  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <Text
          variant="small"
          className="flex items-center gap-2 text-muted-foreground !mt-0"
        >
          <PieChart size={14} />
          Category Breakdown
        </Text>
      </div>
      <div className="space-y-3">
        {(Object.keys(CATEGORY_COLORS) as Category[]).map((cat) => {
          const seconds = categorySummary[cat] || 0;
          const percentage =
            totalSeconds > 0 ? (seconds / totalSeconds) * 100 : 0;

          return (
            <div key={cat} className="space-y-1">
              <div className="flex justify-between items-center">
                <Text variant="small" className="text-muted-foreground !mt-0">
                  {cat}
                </Text>
                <Text
                  variant="small"
                  className="text-foreground font-bold !mt-0"
                >
                  {formatDuration(seconds)}
                </Text>
              </div>
              <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full ${CATEGORY_COLORS[cat]} rounded-full transition-all duration-500`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
