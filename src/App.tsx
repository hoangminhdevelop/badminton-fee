import SectionCard from "./components/SectionCard";
import CostSettings from "./components/sections/CostSettings";
import FeeTable from "./components/sections/FeeTable";
import MatchList from "./components/sections/MatchList";
import PlayerManager from "./components/sections/PlayerManager";
import ResetButton from "./components/sections/ResetButton";
import "./App.css";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8">
          {/* Left Sidebar - Settings & Players */}
          <div className="lg:col-span-4 space-y-4 sm:space-y-6">
            <SectionCard title="Chi Phí">
              <CostSettings />
            </SectionCard>
            <SectionCard title="Người chơi">
              <PlayerManager />
            </SectionCard>
          </div>

          {/* Right Main Area - Matches & Fees */}
          <div className="lg:col-span-8 space-y-4 sm:space-y-6">
            {/* Match Management Section */}
            <SectionCard title="Trận đấu">
              <MatchList />
            </SectionCard>

            {/* Fee Calculator Section */}
            <SectionCard title="Bảng phí">
              <FeeTable />
            </SectionCard>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-8 sm:mt-12 flex justify-center">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-slate-200/60 p-4 sm:p-6">
            <ResetButton />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
