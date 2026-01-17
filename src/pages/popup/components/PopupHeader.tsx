import { Clock, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { ThemeToggle } from "@/components/ui/theme-toggle";

interface PopupHeaderProps {
  onOpenOptions: () => void;
}

export const PopupHeader = ({ onOpenOptions }: PopupHeaderProps) => {
  return (
    <header className="px-6 py-5 bg-card/50 border-b border-border flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <div className="p-2 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-500/10">
          <Clock className="text-white" size={20} />
        </div>
        <Text variant="large" className="font-bold tracking-tight !mt-0">
          Time Tracker
        </Text>
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Button
          variant="ghost"
          size="icon"
          onClick={onOpenOptions}
          className="text-muted-foreground hover:text-foreground hover:bg-accent rounded-xl"
        >
          <LayoutDashboard size={18} />
        </Button>
      </div>
    </header>
  );
};
