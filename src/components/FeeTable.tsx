import { calculateFees } from "../lib/feeCalculator";
import { getCosts, getMatches, getPlayers } from "../lib/storage";

export default function FeeTable() {
  const players = getPlayers();
  const matches = getMatches();
  const costs = getCosts();
  const fees = costs ? calculateFees(matches, players, costs) : [];

  if (!costs) {
    return (
      <div className="text-center py-8 sm:py-12 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200 mx-4 sm:mx-0">
        <svg
          className="w-12 h-12 sm:w-16 sm:h-16 text-amber-400 mx-auto mb-3 sm:mb-4"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" />
        </svg>
        <h3 className="text-lg sm:text-xl font-semibold text-amber-800 mb-2">
          Setup Required
        </h3>
        <p className="text-amber-700 text-sm sm:text-base px-4">
          Please configure cost settings first to calculate fees
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white overflow-hidden">
      {/* Mobile Card Layout */}
      <div className="block sm:hidden">
        <div className="p-4 space-y-4">
          {fees.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-slate-500">
                <svg
                  className="w-10 h-10 mx-auto mb-3 text-slate-300"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                </svg>
                <p className="font-medium text-sm">No fee data available</p>
                <p className="text-xs mt-1">
                  Add players and matches to see calculations
                </p>
              </div>
            </div>
          ) : (
            <>
              {fees.map((f) => (
                <div
                  key={f.playerId}
                  className="bg-slate-50 rounded-lg p-4 border border-slate-200"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {f.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">{f.name}</h3>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div>
                      <div className="text-xs text-slate-600 mb-1">Matches</div>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
                        {f.matches}
                      </span>
                    </div>
                    <div>
                      <div className="text-xs text-slate-600 mb-1">Wins</div>
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                        {f.wins}
                      </span>
                    </div>
                    <div>
                      <div className="text-xs text-slate-600 mb-1">
                        Fee (VND)
                      </div>
                      <div className="font-semibold text-slate-900 text-sm">
                        {f.total.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {/* Mobile Total Card */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-4 border-2 border-amber-200 mt-4">
                <div className="flex items-center gap-2 mb-3">
                  <svg
                    className="w-5 h-5 text-amber-600"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  <h3 className="font-bold text-amber-800">Total Summary</h3>
                </div>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <div className="text-xs text-amber-700 mb-1">Matches</div>
                    <span className="bg-amber-200 text-amber-800 px-2 py-1 rounded-full text-sm font-bold">
                      {fees.reduce((sum, f) => sum + f.matches, 0)}
                    </span>
                  </div>
                  <div>
                    <div className="text-xs text-amber-700 mb-1">Wins</div>
                    <span className="bg-amber-200 text-amber-800 px-2 py-1 rounded-full text-sm font-bold">
                      {fees.reduce((sum, f) => sum + f.wins, 0)}
                    </span>
                  </div>
                  <div>
                    <div className="text-xs text-amber-700 mb-1">
                      Total (VND)
                    </div>
                    <div className="font-bold text-amber-800 text-base">
                      {fees
                        .reduce((sum, f) => sum + f.total, 0)
                        .toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Desktop Table Layout */}
      <div className="hidden sm:block">
        <div className="p-4 sm:p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">
                    Player
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-slate-700">
                    Matches
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-slate-700">
                    Wins
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-slate-700">
                    Total Fee (VND)
                  </th>
                </tr>
              </thead>
              <tbody>
                {fees.map((f, index) => (
                  <tr
                    key={f.playerId}
                    className={`border-b border-slate-100 ${
                      index % 2 === 0 ? "bg-slate-50" : "bg-white"
                    } hover:bg-blue-50 transition-colors duration-150`}
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                          {f.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-slate-800">
                          {f.name}
                        </span>
                      </div>
                    </td>
                    <td className="text-center py-4 px-4">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
                        {f.matches}
                      </span>
                    </td>
                    <td className="text-center py-4 px-4">
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                        {f.wins}
                      </span>
                    </td>
                    <td className="text-right py-4 px-4">
                      <span className="font-semibold text-slate-900 text-lg">
                        {f.total.toLocaleString()}
                      </span>
                    </td>
                  </tr>
                ))}
                {fees.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center py-12">
                      <div className="text-slate-500">
                        <svg
                          className="w-12 h-12 mx-auto mb-4 text-slate-300"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                        </svg>
                        <p className="font-medium">No fee data available</p>
                        <p className="text-sm mt-1">
                          Add players and matches to see calculations
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
                {fees.length > 0 && (
                  <tr className="bg-gradient-to-r from-amber-50 to-orange-50 border-t-2 border-amber-200">
                    <td className="py-4 px-4">
                      <span className="font-bold text-amber-800 flex items-center gap-2">
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                        Total
                      </span>
                    </td>
                    <td className="text-center py-4 px-4">
                      <span className="bg-amber-200 text-amber-800 px-3 py-1 rounded-full font-bold">
                        {fees.reduce((sum, f) => sum + f.matches, 0)}
                      </span>
                    </td>
                    <td className="text-center py-4 px-4">
                      <span className="bg-amber-200 text-amber-800 px-3 py-1 rounded-full font-bold">
                        {fees.reduce((sum, f) => sum + f.wins, 0)}
                      </span>
                    </td>
                    <td className="text-right py-4 px-4">
                      <span className="font-bold text-amber-800 text-xl">
                        {fees
                          .reduce((sum, f) => sum + f.total, 0)
                          .toLocaleString()}
                      </span>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
