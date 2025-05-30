import { ChevronDown, Star } from "lucide-react";
import { useState } from "react";

interface SectionCardProps {
  title: string;
  children: React.ReactNode;
}

const SectionCard = ({ title, children }: SectionCardProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
      <div
        className="bg-gradient-to-r from-emerald-500 to-teal-500 px-4 sm:px-6 py-3 sm:py-4 cursor-pointer hover:from-emerald-600 hover:to-teal-600 transition-all duration-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h2 className="text-lg sm:text-xl font-semibold text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 sm:w-5 sm:h-5" />
            {title}
          </div>
          <ChevronDown
            className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </h2>
      </div>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-0" : "max-h-[2000px]"
        }`}
      >
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">{children}</div>
      </div>
    </div>
  );
};

export default SectionCard;
