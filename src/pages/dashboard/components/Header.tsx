import { Clock, Download, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { ThemeToggle } from "@/components/ui/theme-toggle";

interface HeaderProps {
  onExport: () => void;
  onReset: () => void;
}

export const Header = ({ onExport, onReset }: HeaderProps) => (
  <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-500/20">
          <Clock className="text-white" size={28} />
        </div>
        <Text
          as="h1"
          variant="h1"
          className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-600 dark:from-white dark:via-slate-200 dark:to-slate-500 bg-clip-text text-transparent italic !mt-0"
        >
          Time Tracker
        </Text>
      </div>
      <Text variant="muted" className="!mt-0">
        Insights into your digital workspace efficiency.
      </Text>
    </div>

    <div className="flex items-center gap-3">
      <ThemeToggle />
      <Button
        variant="outline"
        onClick={onExport}
        className="px-5 py-6 bg-card border-border hover:border-accent-foreground/50 hover:bg-accent rounded-xl text-sm font-semibold transition-all group"
      >
        <Download
          size={18}
          className="text-indigo-400 group-hover:scale-110 transition-transform"
        />
        Export Report
      </Button>
      <Button
        variant="outline"
        onClick={() => {
          if (confirm("Are you sure you want to clear all usage data?"))
            onReset();
        }}
        className="px-5 py-6 bg-card border-border hover:border-red-500/50 hover:bg-red-500/10 rounded-xl text-sm font-semibold transition-all text-muted-foreground hover:text-red-400 group"
      >
        <Trash2
          size={18}
          className="group-hover:scale-110 transition-transform"
        />
        Reset
      </Button>
    </div>
  </div>
);
