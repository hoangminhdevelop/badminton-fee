import type { FeeResult } from "@/lib/types";
import { DollarSign, Globe, Star } from "lucide-react";
import { EmptyState } from "../EmptyState";
import { useState } from "react";
import { Button } from "../ui/button";
import { useAppContext } from "@/hooks/useAppContext";
import { calculateFees } from "@/lib/feeCalculator";
import { Checkbox } from "../ui/checkbox";
import { roundMoney } from "@/lib/currency";

export default function FeeTable() {
  const { cost, matches, players } = useAppContext();

  const [fees, setFees] = useState<FeeResult[]>(
    cost ? calculateFees(matches, players, cost) : []
  );

  console.log("fees", fees);

  const reloadFeeTable = () => {
    setFees(cost ? calculateFees(matches, players, cost) : []);
  };

  if (!cost) {
    return (
      <div className="text-center py-8 sm:py-12 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200 mx-4 sm:mx-0">
        <EmptyState
          icon={
            <DollarSign className="w-12 h-12 sm:w-16 sm:h-16 text-amber-400" />
          }
          title="Yêu cầu cài đặt chi phí"
          description="Vui lòng cài đặt chi phí thuê sân và cầu trước khi tính toán bảng phí."
          className="text-amber-800"
        />
      </div>
    );
  }

  return (
    <div className="bg-white overflow-hidden">
      <Button onClick={reloadFeeTable}>Reload</Button>
      {/* Mobile Card Layout */}
      <div className="block ">
        <div className="py-2 space-y-4">
          {fees.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-slate-500">
                <Globe className="w-10 h-10 mx-auto mb-3 text-slate-300" />
                <p className="font-medium text-sm">Chưa có dữ liệu</p>
                <p className="text-xs mt-1">
                  Bấm Reload để tính toán lại phí cho các trận đấu đã có
                </p>
              </div>
            </div>
          ) : (
            <>
              {fees.map(
                (f) =>
                  f.matches > 0 && (
                    <div
                      key={f.playerId}
                      className="bg-slate-50 rounded-lg p-2 border border-slate-200"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div>
                          <h3 className="font-semibold text-slate-800">
                            <Checkbox className="mr-2" />
                            <span>{f.name}</span>
                          </h3>
                        </div>
                      </div>
                      <div className="grid grid-cols-5 gap-2 text-center">
                        <div>
                          <div className="text-xs text-slate-600 mb-1">
                            Số trận
                          </div>
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
                            {f.matches}
                          </span>
                        </div>
                        <div>
                          <div className="text-xs text-slate-600 mb-1">
                            Thắng
                          </div>
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                            {f.wins}
                          </span>
                        </div>
                        <div>
                          <div className="text-xs text-slate-600 mb-1">
                            Phí sân (VND)
                          </div>
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                            {f.stateFee.toLocaleString()}
                          </span>
                        </div>
                        <div>
                          <div className="text-xs text-slate-600 mb-1">
                            Phí cầu (VND)
                          </div>
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                            {f.shuttlecockFee.toLocaleString()}
                          </span>
                        </div>
                        <div>
                          <div className="text-xs text-slate-600 mb-1">
                            Phí (VND)
                          </div>
                          <div className="font-semibold text-slate-900 text-sm">
                            {roundMoney(
                              f.stateFee + f.shuttlecockFee
                            ).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
              )}
              {/* Mobile Total Card */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-4 border-2 border-amber-200 mt-4 flex justify-between items-center">
                <div className="flex items-center gap-2 mb-3">
                  <Star className="w-5 h-5 text-amber-600" />
                  <h3 className="font-bold text-amber-800">Total Summary</h3>
                </div>
                <div className="font-bold text-amber-800 text-base">
                  {fees
                    .reduce((sum, f) => sum + f.stateFee + f.shuttlecockFee, 0)
                    .toLocaleString()}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
