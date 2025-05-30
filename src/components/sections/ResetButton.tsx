import { Button } from "@/components/ui/button";
import { resetStorage } from "@/lib/storage";
import { Trash2 } from "lucide-react";

export default function ResetButton() {
  const handleReset = () => {
    if (
      window.confirm(
        "Bạn có chắc chắn muốn xóa tất cả dữ liệu? Tất cả thông tin sẽ bị mất và không thể khôi phục lại."
      )
    ) {
      resetStorage();
      window.location.reload();
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
