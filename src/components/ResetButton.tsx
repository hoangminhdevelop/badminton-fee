import { Button } from "../components/ui/button";
import { resetAll } from "../lib/storage";

export default function ResetButton({ onReset }: { onReset?: () => void }) {
  const handleReset = () => {
    if (
      window.confirm(
        "⚠️ Are you sure you want to reset all data? This action cannot be undone."
      )
    ) {
      resetAll();
      if (onReset) onReset();
    }
  };

  return (
    <Button
      onClick={handleReset}
      className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium px-8 py-3 rounded-xl shadow-sm transition-all duration-200 flex items-center gap-2"
    >
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19 4h-3.5l-1-1h-5l-1 1H5v2h14M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12z" />
      </svg>
      Reset All Data
    </Button>
  );
}
