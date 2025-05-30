import { cn } from "@/lib/utils";
import * as React from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  className?: string;
  gradient?: "amber" | "emerald" | "blue" | "red";
}

const gradientClasses = {
  amber: "bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200",
  emerald: "bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200",
  blue: "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200",
  red: "bg-gradient-to-r from-red-50 to-pink-50 border-red-200",
};

export function StatCard({
  title,
  value,
  icon,
  className,
  gradient = "amber",
}: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-lg p-4 border-2",
        gradientClasses[gradient],
        className
      )}
    >
      <div className="flex items-center gap-2 mb-3">
        {icon && <div className="text-current">{icon}</div>}
        <h3 className="font-bold text-slate-800">{title}</h3>
      </div>
      <div className="text-center">
        <div className="font-bold text-slate-800 text-lg">{value}</div>
      </div>
    </div>
  );
}
