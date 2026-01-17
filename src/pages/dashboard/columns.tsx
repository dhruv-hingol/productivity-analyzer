import { useMemo } from "react";
import { Globe } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Text } from "@/components/ui/text";
import { CommonSelect } from "@/common/common-select";
import { formatDuration } from "@/utils/format";
import type { Column } from "@/common/common-table";
import type { Category } from "@/types";
import { CATEGORY_OPTIONS } from "@/content";

const CATEGORY_COLORS: Record<Category, string> = {
  Work: "#3b82f6",
  Learning: "#10b981",
  Social: "#a855f7",
  Other: "#64748b",
};

interface UseUsageColumnsProps {
  categories: Record<string, Category>;
  updateCategory: (domain: string, category: Category) => void;
}

export const useUsageColumns = ({
  categories,
  updateCategory,
}: UseUsageColumnsProps) => {
  return useMemo<Column<{ domain: string; seconds: number }>[]>(
    () => [
      {
        header: (
          <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Domain
          </Label>
        ),
        cell: (item) => {
          return (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground group-hover:text-foreground transition-colors">
                <Globe size={16} />
              </div>
              <a
                href={`https://${item.domain}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-foreground hover:text-primary hover:underline transition-colors cursor-pointer text-sm !mt-0"
              >
                {item.domain}
              </a>
            </div>
          );
        },
      },
      {
        header: (
          <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Category
          </Label>
        ),
        cell: (item) => (
          <div className="flex items-center gap-2">
            <CommonSelect
              options={CATEGORY_OPTIONS}
              value={categories[item.domain] || "Other"}
              onValueChange={(value) =>
                updateCategory(item.domain, value as Category)
              }
              size="sm"
              triggerClassName="h-8 min-w-[110px] bg-background border-border text-xs"
            />
            <div
              className="w-2 h-2 rounded-full shrink-0"
              style={{
                backgroundColor:
                  CATEGORY_COLORS[categories[item.domain] || "Other"],
              }}
            />
          </div>
        ),
      },
      {
        header: (
          <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Time Spent
          </Label>
        ),
        headerClassName: "text-right",
        className: "text-right",
        cell: (item) => (
          <Text
            variant="small"
            className="font-mono text-indigo-400 font-bold !mt-0"
          >
            {formatDuration(item.seconds)}
          </Text>
        ),
      },
    ],
    [categories, updateCategory, CATEGORY_OPTIONS]
  );
};
