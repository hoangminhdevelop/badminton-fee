import { useState } from "react";
import "./App.css";
import CostSettings from "./components/CostSettings";
import FeeTable from "./components/FeeTable";
import MatchForm from "./components/MatchForm";
import MatchList from "./components/MatchList";
import PlayerManager from "./components/PlayerManager";
import ResetButton from "./components/ResetButton";
import type { Match } from "./lib/types";

function App() {
  const [editingMatch, setEditingMatch] = useState<Match | undefined>(
    undefined
  );
  const [refreshKey, setRefreshKey] = useState(0);
  const [feeRefreshKey, setFeeRefreshKey] = useState(0);

  // Section collapse states
  const [collapsedSections, setCollapsedSections] = useState({
    setup: false,
    matches: false,
    fees: false,
  });

  const triggerRefresh = () => setRefreshKey((k) => k + 1);
  const triggerFeeRefresh = () => setFeeRefreshKey((k) => k + 1);

  const toggleSection = (section: keyof typeof collapsedSections) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <svg
                  className="w-5 h-5 sm:w-7 sm:h-7"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
                Badminton Manager
              </h1>
            </div>
            <p className="text-base sm:text-lg lg:text-xl text-white/90 max-w-2xl mx-auto px-4">
              Professional badminton match tracking and fee management system
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8">
          {/* Left Sidebar - Settings & Players */}
          <div className="lg:col-span-4 space-y-4 sm:space-y-6">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-500 px-4 sm:px-6 py-3 sm:py-4 cursor-pointer hover:from-emerald-600 hover:to-teal-600 transition-all duration-200"
                onClick={() => toggleSection("setup")}
              >
                <h2 className="text-lg sm:text-xl font-semibold text-white flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    Setup & Players
                  </div>
                  <svg
                    className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200 ${
                      collapsedSections.setup ? "rotate-180" : ""
                    }`}
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
                  </svg>
                </h2>
              </div>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  collapsedSections.setup ? "max-h-0" : "max-h-[2000px]"
                }`}
              >
                <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                  <CostSettings
                    onSave={triggerRefresh}
                    key={`costs-${refreshKey}`}
                  />
                  <PlayerManager
                    onChange={triggerRefresh}
                    key={`players-${refreshKey}`}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Main Area - Matches & Fees */}
          <div className="lg:col-span-8 space-y-4 sm:space-y-6">
            {/* Match Management Section */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-indigo-500 px-4 sm:px-6 py-3 sm:py-4 cursor-pointer hover:from-blue-600 hover:to-indigo-600 transition-all duration-200"
                onClick={() => toggleSection("matches")}
              >
                <h2 className="text-lg sm:text-xl font-semibold text-white flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
                    </svg>
                    Match Management
                  </div>
                  <svg
                    className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200 ${
                      collapsedSections.matches ? "rotate-180" : ""
                    }`}
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
                  </svg>
                </h2>
              </div>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  collapsedSections.matches ? "max-h-0" : "max-h-[2000px]"
                }`}
              >
                <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                  <div className="rounded-lg p-4">
                    <MatchForm
                      key={editingMatch?.id || `matchform-${refreshKey}`}
                      editingMatch={editingMatch}
                      triggerOnly={true}
                      onSave={() => {
                        setEditingMatch(undefined);
                        triggerRefresh();
                      }}
                    />
                  </div>
                  <MatchList
                    onEdit={(m) => setEditingMatch(m)}
                    editingMatch={editingMatch}
                    onChange={triggerRefresh}
                    showCard={false}
                    key={`matches-${refreshKey}`}
                  />
                </div>
              </div>
            </div>

            {/* Fee Calculator Section */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-500 to-orange-500 px-4 sm:px-6 py-3 sm:py-4 cursor-pointer hover:from-amber-600 hover:to-orange-600 transition-all duration-200"
                onClick={() => toggleSection("fees")}
              >
                <h2 className="text-lg sm:text-xl font-semibold text-white flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" />
                    </svg>
                    Fee Calculator
                    {/* Refresh Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        triggerFeeRefresh();
                      }}
                      className="ml-2 p-1.5 rounded-lg bg-white/20 hover:bg-white/30 transition-colors duration-200"
                      title="Refresh Fee Calculator"
                    >
                      <svg
                        className="w-3 h-3 sm:w-4 sm:h-4"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
                      </svg>
                    </button>
                  </div>
                  <svg
                    className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200 ${
                      collapsedSections.fees ? "rotate-180" : ""
                    }`}
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
                  </svg>
                </h2>
              </div>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  collapsedSections.fees ? "max-h-0" : "max-h-[2000px]"
                }`}
              >
                <div className="p-0">
                  <FeeTable key={`fee-${feeRefreshKey}`} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-8 sm:mt-12 flex justify-center">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-slate-200/60 p-4 sm:p-6">
            <ResetButton onReset={triggerRefresh} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
