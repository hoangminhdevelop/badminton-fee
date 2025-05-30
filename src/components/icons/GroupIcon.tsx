import { IconProps } from "./types";

export function GroupIcon({ className = "w-4 h-4", ...props }: IconProps) {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
      {...props}
    >
      <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zM4 18v-4.5l2-1.5v-2c0-1.1.9-2 2-2h2c1.1 0 2 .9 2 2v6.5l6 4.5H4z" />
    </svg>
  );
}
