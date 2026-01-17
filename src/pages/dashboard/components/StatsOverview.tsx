import { formatSeconds } from "@/utils/format";
import { Activity, Globe, TrendingUp } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface StatsOverviewProps {
  totalTodaySeconds: number;
  uniqueDomainsCount: number;
  topCategory: string;
}

export const StatsOverview = ({
  totalTodaySeconds,
  uniqueDomainsCount,
  topCategory,
}: StatsOverviewProps) => (
  <TooltipProvider>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-all duration-300 cursor-help">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Today's Focus
              </span>
              <Activity className="w-5 h-5 text-blue-500" />
            </div>
            <div className="text-3xl font-bold text-foreground">
              {formatSeconds(totalTodaySeconds)}
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              Active time tracked
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Total active time today (excludes idle periods)</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <div className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-all duration-300 cursor-help">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Unique Domains
              </span>
              <Globe className="w-5 h-5 text-emerald-500" />
            </div>
            <div className="text-3xl font-bold text-foreground">
              {uniqueDomainsCount}
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              Sites visited today
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Number of different websites visited today</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <div className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-all duration-300 cursor-help">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Top Category
              </span>
              <TrendingUp className="w-5 h-5 text-purple-500" />
            </div>
            <div className="text-3xl font-bold text-foreground">
              {topCategory}
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              Most time spent
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Category where you spent the most time today</p>
        </TooltipContent>
      </Tooltip>
    </div>
  </TooltipProvider>
);
