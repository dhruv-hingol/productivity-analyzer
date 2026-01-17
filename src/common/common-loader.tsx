import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Text } from "@/components/ui/text";

interface CommonLoaderProps {
  message?: string;
  fullScreen?: boolean;
  className?: string;
}

export const CommonLoader = ({
  message = "Loading your activity...",
  fullScreen = true,
  className,
}: CommonLoaderProps) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 transition-colors", // Added transition-colors
        fullScreen ? "fixed inset-0 bg-background z-50 px-6" : "w-full py-12",
        className
      )}
    >
      <div className="relative">
        <div className="p-4 bg-primary rounded-2xl shadow-lg shadow-primary/20 animate-pulse transition-colors">
          {" "}
          {/* Replaced bg-indigo-600 with bg-primary, shadow-indigo-500/20 with shadow-primary/20, added transition-colors */}
          <Clock
            className="text-primary-foreground transition-colors"
            size={32}
          />{" "}
          {/* Replaced text-white with text-primary-foreground, added transition-colors */}
        </div>
        <div className="absolute inset-0 border-4 border-primary/30 rounded-2xl animate-ping transition-colors" />{" "}
        {/* Replaced border-indigo-500/30 with border-primary/30, added transition-colors */}
      </div>
      <div className="space-y-1 text-center">
        <Text variant="h3" as="h3" className="!mt-0 font-medium">
          {message}
        </Text>
        <Text variant="muted" className="text-sm !mt-0 italic">
          Syncing with local storage
        </Text>
      </div>
    </div>
  );
};
