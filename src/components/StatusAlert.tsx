import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface StatusAlertProps {
  type: "success" | "error" | "warning" | "info";
  message: string;
  className?: string;
  show?: boolean;
  onClose?: () => void;
}

const alertStyles = {
  success: {
    container: "bg-emerald-50 border-emerald-200 text-emerald-700",
    icon: "text-emerald-600",
  },
  error: {
    container: "bg-red-50 border-red-200 text-red-700",
    icon: "text-red-600",
  },
  warning: {
    container: "bg-amber-50 border-amber-200 text-amber-700",
    icon: "text-amber-600",
  },
  info: {
    container: "bg-blue-50 border-blue-200 text-blue-700",
    icon: "text-blue-600",
  },
};

export function StatusAlert({
  type,
  message,
  className,
  show = true,
  onClose,
}: StatusAlertProps) {
  if (!show) return null;

  const styles = alertStyles[type];

  return (
    <div
      className={cn(
        "flex items-center gap-2 justify-center p-3 border rounded-lg sm:rounded-xl animate-in fade-in duration-300",
        styles.container,
        className
      )}
    >
      <Check className={cn("w-4 h-4", styles.icon)} />
      <span className="text-sm font-medium">{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-2 text-current opacity-70 hover:opacity-100"
        >
          ×
        </button>
      )}
    </div>
  );
}
