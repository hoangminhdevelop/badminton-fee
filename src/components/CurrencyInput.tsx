import { Input } from "@/components/ui/input";
import { cn, formatCurrencyInput, parseCurrency } from "@/lib/utils";
import * as React from "react";

interface CurrencyInputProps {
  value: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  label?: string;
  icon?: React.ReactNode;
  error?: string;
  currency?: string;
  formatAsNumber?: boolean;
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
  formatAsNumber = false,
}: CurrencyInputProps) {
  const [displayValue, setDisplayValue] = React.useState(() => {
    if (formatAsNumber) {
      const numValue =
        typeof value === "string" ? parseFloat(value) || 0 : value || 0;
      return formatCurrencyInput(numValue.toString());
    }
    return value.toString();
  });

  const handleInputChange = (inputValue: string) => {
    if (formatAsNumber) {
      const formatted = formatCurrencyInput(inputValue);
      setDisplayValue(formatted);

      // Pass the numeric value back to parent
      const numericValue = parseCurrency(formatted);
      onChange(numericValue.toString());
    } else {
      setDisplayValue(inputValue);
      onChange(inputValue);
    }
  };

  // Update display value when external value changes
  React.useEffect(() => {
    if (formatAsNumber) {
      const numValue =
        typeof value === "string" ? parseFloat(value) || 0 : value || 0;
      const newDisplayValue = formatCurrencyInput(numValue.toString());
      if (newDisplayValue !== displayValue) {
        setDisplayValue(newDisplayValue);
      }
    } else {
      if (value.toString() !== displayValue) {
        setDisplayValue(value.toString());
      }
    }
  }, [value, formatAsNumber, displayValue]);

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
          value={displayValue}
          onChange={(e) => handleInputChange(e.target.value)}
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
