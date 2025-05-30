import { cn } from "@/lib/utils";
import * as React from "react";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  className?: string;
  action?: React.ReactNode;
}

export function EmptyState({
  icon,
  title,
  description,
  className,
  action,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "text-center py-8 flex flex-col items-center justify-center",
        className
      )}
    >
      {icon && <div className="mb-3">{icon}</div>}
      <h3 className="font-medium text-slate-700 mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-slate-500 mb-4">{description}</p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
}
