import { cn } from "@/lib/utils";

interface AvatarProps {
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "w-5 h-5 sm:w-6 sm:h-6 text-xs",
  md: "w-8 h-8 sm:w-10 sm:h-10 text-sm",
  lg: "w-12 h-12 text-base",
};

export function Avatar({ name, size = "md", className }: AvatarProps) {
  const initials = name.charAt(0).toUpperCase();

  return (
    <div
      className={cn(
        "bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-medium",
        sizeClasses[size],
        className
      )}
    >
      {initials}
    </div>
  );
}
