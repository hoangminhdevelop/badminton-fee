import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import * as React from "react";

interface CurrencyInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  label?: string;
  icon?: React.ReactNode;
  error?: string;
  currency?: string;
}

export function CurrencyInput({
  value,
  onChange,
  placeholder = "0",
  className,
  label,
  icon,
  error,
  currency = "VND",
}: CurrencyInputProps) {
  return (
    <div className="bg-slate-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-slate-200">
      {label && (
        <label className="text-xs sm:text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
          {icon && <div className="text-current">{icon}</div>}
          {label}
        </label>
      )}
      <div className="relative">
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn(
            "bg-white border-slate-300 text-sm sm:text-base h-10 sm:h-11 pr-12",
            className
          )}
        />
        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 text-sm font-medium">
          {currency}
        </span>
      </div>
      {error && (
        <span className="text-red-500 text-xs sm:text-sm mt-1 block">
          {error}
        </span>
      )}
    </div>
  );
}
