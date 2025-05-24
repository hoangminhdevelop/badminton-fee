import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
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
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CostForm>({
    resolver: zodResolver(costSchema),
    defaultValues,
  });

  const onSubmit = (data: CostForm) => {
    saveCosts(data);
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
          <Input
            type="number"
            {...register("rent", { valueAsNumber: true })}
            min={1000}
            step={1000}
            className="bg-white border-slate-300 focus:ring-emerald-500 focus:border-emerald-500 text-sm sm:text-base h-10 sm:h-11"
          />
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
          <Input
            type="number"
            {...register("shuttlecock", { valueAsNumber: true })}
            min={1000}
            step={1000}
            className="bg-white border-slate-300 focus:ring-amber-500 focus:border-amber-500 text-sm sm:text-base h-10 sm:h-11"
          />
          {errors.shuttlecock && (
            <span className="text-red-500 text-xs sm:text-sm mt-1 block">
              {errors.shuttlecock.message}
            </span>
          )}
        </div>

        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-medium py-2 sm:py-2.5 rounded-lg sm:rounded-xl shadow-sm transition-all duration-200 text-sm sm:text-base h-10 sm:h-11"
        >
          Save Settings
        </Button>
      </form>
    </div>
  );
}
