import type { UsageStore, Category } from "@/types";
import { formatSeconds } from "@/utils/format";
import { Target, Award } from "lucide-react";

interface ProductivityScoreProps {
  usage: UsageStore;
  categories: Record<string, Category>;
  dateRange: { start: string; end: string };
}

/**
 * Calculate productivity score (0-100) based on:
 * - Time in productive categories (Work, Learning)
 * - Consistency across days
 * - Total active time
 */
const calculateScore = (
  usage: UsageStore,
  categories: Record<string, Category>,
  dateRange: { start: string; end: string }
): { score: number; breakdown: any } => {
  let productiveSeconds = 0;
  let totalSeconds = 0;
  const weights = { Work: 1.0, Learning: 0.9, Social: 0.2, Other: 0.5 };

  // Calculate weighted time across date range
  const start = new Date(dateRange.start);
  const end = new Date(dateRange.end);
  const daysWithData: string[] = [];

  const current = new Date(start);
  while (current <= end) {
    const dateStr = current.toISOString().split("T")[0];
    const dayUsage = usage[dateStr] || {};

    let dayTotal = 0;
    let dayProductive = 0;

    Object.entries(dayUsage).forEach(([domain, seconds]) => {
      const category = categories[domain] || "Other";
      const weight = weights[category];
      dayTotal += seconds;
      dayProductive += seconds * weight;
    });

    if (dayTotal > 0) {
      daysWithData.push(dateStr);
      totalSeconds += dayTotal;
      productiveSeconds += dayProductive;
    }

    current.setDate(current.getDate() + 1);
  }

  // Base score: weighted productive time ratio
  const baseScore =
    totalSeconds > 0 ? (productiveSeconds / totalSeconds) * 70 : 0;

  // Consistency bonus: reward regular activity
  const totalDays =
    Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  const consistencyRatio = daysWithData.length / totalDays;
  const consistencyBonus = consistencyRatio * 20;

  // Active time bonus: reward substantial daily usage (2+ hours/day)
  const avgSecondsPerDay = totalSeconds / Math.max(daysWithData.length, 1);
  const activeBonus = Math.min((avgSecondsPerDay / (2 * 3600)) * 10, 10);

  const finalScore = Math.min(
    100,
    Math.max(0, baseScore + consistencyBonus + activeBonus)
  );

  return {
    score: Math.round(finalScore),
    breakdown: {
      baseScore: Math.round(baseScore),
      consistencyBonus: Math.round(consistencyBonus),
      activeBonus: Math.round(activeBonus),
      productiveTime: productiveSeconds,
      totalTime: totalSeconds,
      daysActive: daysWithData.length,
      totalDays,
    },
  };
};

export const ProductivityScore = ({
  usage,
  categories,
  dateRange,
}: ProductivityScoreProps) => {
  const { score, breakdown } = calculateScore(usage, categories, dateRange);

  // Color based on score
  const getScoreColor = (s: number) => {
    if (s >= 80) return "text-green-500";
    if (s >= 60) return "text-blue-500";
    if (s >= 40) return "text-yellow-500";
    return "text-orange-500";
  };

  const getScoreLabel = (s: number) => {
    if (s >= 80) return "Excellent";
    if (s >= 60) return "Good";
    if (s >= 40) return "Fair";
    return "Needs Improvement";
  };

  return (
    <div className="bg-gradient-to-br from-card to-card/50 border border-border rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Award className="w-5 h-5 text-purple-500" />
            Productivity Score
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            Based on {breakdown.daysActive} active days
          </p>
        </div>
        <Target className="w-8 h-8 text-muted-foreground/20" />
      </div>

      <div className="flex items-baseline gap-3 mb-4">
        <div className={`text-6xl font-bold ${getScoreColor(score)}`}>
          {score}
        </div>
        <div className="text-2xl text-muted-foreground">/100</div>
      </div>

      <div className={`text-sm font-medium mb-4 ${getScoreColor(score)}`}>
        {getScoreLabel(score)}
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden mb-4">
        <div
          className={`h-full transition-all duration-500 ${
            score >= 80
              ? "bg-green-500"
              : score >= 60
              ? "bg-blue-500"
              : score >= 40
              ? "bg-yellow-500"
              : "bg-orange-500"
          }`}
          style={{ width: `${score}%` }}
        />
      </div>

      {/* Breakdown */}
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div>
          <div className="text-muted-foreground">Productive Time</div>
          <div className="font-medium">
            {formatSeconds(breakdown.productiveTime)}
          </div>
        </div>
        <div>
          <div className="text-muted-foreground">Consistency</div>
          <div className="font-medium">
            {breakdown.daysActive}/{breakdown.totalDays} days
          </div>
        </div>
      </div>
    </div>
  );
};
