import { Button } from "@/components/ui/button";
import { resetStorage } from "@/lib/storage";
import { Trash2 } from "lucide-react";

export default function ResetButton() {
  const handleReset = () => {
    if (
      window.confirm(
        "Are you sure you want to reset all data? This action cannot be undone."
      )
    ) {
      resetStorage();
      window.location.reload(); // Reload the page to reflect changes
    }
  };
  return (
    <Button
      onClick={handleReset}
      className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium px-8 py-3 rounded-xl shadow-sm transition-all duration-200 flex items-center gap-2"
    >
      <Trash2 className="w-4 h-4" />
      Xóa tất cả dữ liệu
    </Button>
  );
}
