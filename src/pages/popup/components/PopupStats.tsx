import { Globe } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Text } from "@/components/ui/text";
import { formatDuration } from "@/utils/format";

interface PopupStatsProps {
  totalSeconds: number;
  openTabsCount: number;
}

export const PopupStats = ({
  totalSeconds,
  openTabsCount,
}: PopupStatsProps) => {
  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-2xl p-4 text-center">
        <Label className="text-muted-foreground font-medium mb-1 block">
          Total Active Time Today
        </Label>
        <Text variant="h2" className="text-indigo-400 !mt-0">
          {formatDuration(totalSeconds)}
        </Text>
      </div>

      <div className="bg-muted/50 border border-border rounded-xl p-3 flex justify-between items-center px-4">
        <div className="flex items-center gap-2">
          <Globe size={14} className="text-indigo-400" />
          <Label className="text-muted-foreground font-medium tracking-tight">
            Open Websites
          </Label>
        </div>
        <Text variant="large" className="text-foreground leading-none !mt-0">
          {openTabsCount}
        </Text>
      </div>
    </div>
  );
};
