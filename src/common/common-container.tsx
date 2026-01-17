import * as React from "react";
import { cn } from "@/lib/utils";
import { Text } from "@/components/ui/text";

interface CommonContainerProps {
  title?: React.ReactNode;
  icon?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  rightElement?: React.ReactNode;
}

export const CommonContainer = ({
  title,
  icon,
  description,
  children,
  className,
  headerClassName,
  contentClassName,
  rightElement,
}: CommonContainerProps) => {
  return (
    <div
      className={cn(
        "bg-card/40 border border-border rounded-[2.5rem] overflow-hidden flex flex-col transition-colors duration-300",
        className
      )}
    >
      {(title || icon || rightElement) && (
        <div
          className={cn(
            "p-8 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4",
            headerClassName
          )}
        >
          <div className="flex items-center gap-3">
            {icon && <div className="text-indigo-400">{icon}</div>}
            <div>
              {title && (
                <Text
                  as="h3"
                  variant="h3"
                  className="flex items-center gap-3 !mt-0"
                >
                  {title}
                </Text>
              )}
              {description && (
                <Text variant="muted" className="text-xs !mt-0">
                  {description}
                </Text>
              )}
            </div>
          </div>
          {rightElement && <div>{rightElement}</div>}
        </div>
      )}
      <div className={cn("p-8 pt-4 flex-1", contentClassName)}>{children}</div>
    </div>
  );
};
