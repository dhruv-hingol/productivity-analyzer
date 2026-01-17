import type { SelectOption } from "@/common/common-select";
import type { Category } from "@/types";

export const CATEGORY_COLORS: Record<Category, string> = {
  Work: "bg-blue-500",
  Learning: "bg-emerald-500",
  Social: "bg-purple-500",
  Other: "bg-slate-500",
};

export const CATEGORY_OPTIONS: SelectOption[] = [
  { label: "Work", value: "Work" },
  { label: "Learning", value: "Learning" },
  { label: "Social", value: "Social" },
  { label: "Other", value: "Other" },
];
