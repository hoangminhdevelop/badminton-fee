import { CheckCircle } from "lucide-react";
import MatchForm from "./components/MatchForm";
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
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <CheckCircle className="w-5 h-5 sm:w-7 sm:h-7" />
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
                Badminton Share
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
              <>
                <MatchForm />
                <MatchList />
              </>
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
