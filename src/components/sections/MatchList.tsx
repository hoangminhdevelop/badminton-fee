import { useAppContext } from "@/hooks/useAppContext";
import { Table } from "lucide-react";
import MatchComponent from "../Match";
import MatchForm from "../MatchForm";

export default function MatchList() {
  const { matches } = useAppContext();

  const sortedMatches = [...matches].sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return dateB.getTime() - dateA.getTime();
  });

  return (
    <div className="w-full max-w-none sm:mx-auto">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h3 className="text-lg sm:text-xl">Danh sách trận:</h3>
        <MatchForm />
      </div>
      <div className="pt-0">
        <div className="space-y-3">
          {sortedMatches.map((match) => (
            <MatchComponent key={match.id} match={match} />
          ))}
          {matches.length === 0 && (
            <div className="text-center py-8 sm:py-12 bg-slate-50 rounded-lg sm:rounded-xl border border-slate-200">
              <Table className="w-8 h-8 sm:w-12 sm:h-12 text-slate-400 mx-auto mb-3 sm:mb-4" />
              <p className="text-slate-500 font-medium text-sm sm:text-base">
                Chưa có trận đấu nào được tạo
              </p>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Bấm vào nút "Tạo mới" để bắt đầu
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
