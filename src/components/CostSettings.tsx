import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { getCosts, saveCosts } from "../lib/storage";

const costSchema = z.object({
  rent: z.number().min(1000, "Min is 1,000 VND"),
  shuttlecock: z.number().min(1000, "Min is 1,000 VND"),
});

type CostForm = z.infer<typeof costSchema>;

export default function CostSettings({ onSave }: { onSave?: () => void }) {
  const defaultValues = getCosts() || { rent: 1000, shuttlecock: 1000 };
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // State for formatted display values
  const [rentDisplay, setRentDisplay] = useState(
    defaultValues.rent.toLocaleString("vi-VN")
  );
  const [shuttlecockDisplay, setShuttlecockDisplay] = useState(
    defaultValues.shuttlecock.toLocaleString("vi-VN")
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<CostForm>({
    resolver: zodResolver(costSchema),
    defaultValues,
  });

  // Format number to Vietnamese currency format (without currency symbol)
  const formatCurrency = (value: string): string => {
    // Remove all non-digit characters
    const numericValue = value.replace(/\D/g, "");
    if (!numericValue) return "";

    // Convert to number and format with Vietnamese locale
    return parseInt(numericValue).toLocaleString("vi-VN");
  };

  // Parse formatted string back to number
  const parseCurrency = (formatted: string): number => {
    const numericValue = formatted.replace(/\D/g, "");
    return numericValue ? parseInt(numericValue) : 0;
  };

  // Handle rent input change
  const handleRentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCurrency(e.target.value);
    setRentDisplay(formatted);
    const numericValue = parseCurrency(formatted);
    setValue("rent", numericValue);
    setHasChanges(true);
  };

  // Handle shuttlecock input change
  const handleShuttlecockChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCurrency(e.target.value);
    setShuttlecockDisplay(formatted);
    const numericValue = parseCurrency(formatted);
    setValue("shuttlecock", numericValue);
    setHasChanges(true);
  };

  useEffect(() => {
    if (showSaveConfirmation) {
      const timer = setTimeout(() => {
        setShowSaveConfirmation(false);
      }, 3000); // Hide after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [showSaveConfirmation]);

  const onSubmit = (data: CostForm) => {
    saveCosts(data);
    setShowSaveConfirmation(true);
    setHasChanges(false); // Reset changes flag after saving
    if (onSave) onSave();
  };

  return (
    <div>
      <div className="mb-3 sm:mb-4">
        <h3 className="text-base sm:text-lg font-semibold text-slate-800 mb-1 sm:mb-2">
          Cost Configuration
        </h3>
        <p className="text-xs sm:text-sm text-slate-600">
          Set court rent and shuttlecock prices
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-3 sm:space-y-4"
      >
        {/* Hidden inputs to store numeric values for form submission */}
        <input type="hidden" {...register("rent", { valueAsNumber: true })} />
        <input
          type="hidden"
          {...register("shuttlecock", { valueAsNumber: true })}
        />
        <div className="bg-slate-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-slate-200">
          <label className="text-xs sm:text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
            <svg
              className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-500"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
            </svg>
            Court Rent (VND)
          </label>
          <div className="relative">
            <Input
              type="text"
              value={rentDisplay}
              onChange={handleRentChange}
              placeholder="0"
              className="bg-white border-slate-300 focus:ring-emerald-500 focus:border-emerald-500 text-sm sm:text-base h-10 sm:h-11 pr-12"
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 text-sm font-medium">
              VND
            </span>
          </div>
          {errors.rent && (
            <span className="text-red-500 text-xs sm:text-sm mt-1 block">
              {errors.rent.message}
            </span>
          )}
        </div>

        <div className="bg-slate-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-slate-200">
          <label className="text-xs sm:text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
            <svg
              className="w-3 h-3 sm:w-4 sm:h-4 text-amber-500"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            Shuttlecock (VND)
          </label>
          <div className="relative">
            <Input
              type="text"
              value={shuttlecockDisplay}
              onChange={handleShuttlecockChange}
              placeholder="0"
              className="bg-white border-slate-300 focus:ring-amber-500 focus:border-amber-500 text-sm sm:text-base h-10 sm:h-11 pr-12"
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 text-sm font-medium">
              VND
            </span>
          </div>
          {errors.shuttlecock && (
            <span className="text-red-500 text-xs sm:text-sm mt-1 block">
              {errors.shuttlecock.message}
            </span>
          )}
        </div>

        <Button
          type="submit"
          disabled={!hasChanges}
          className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-medium py-2 sm:py-2.5 rounded-lg sm:rounded-xl shadow-sm transition-all duration-200 text-sm sm:text-base h-10 sm:h-11 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-emerald-500 disabled:hover:to-teal-500"
        >
          Save Settings
        </Button>

        {/* Save Confirmation */}
        {showSaveConfirmation && (
          <div className="flex items-center gap-2 justify-center p-3 bg-emerald-50 border border-emerald-200 rounded-lg sm:rounded-xl text-emerald-700 animate-in fade-in duration-300">
            <Check className="w-4 h-4" />
            <span className="text-sm font-medium">
              Settings saved successfully!
            </span>
          </div>
        )}
      </form>
    </div>
  );
}
