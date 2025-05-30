import { Button } from "@/components/ui/button";
import { CurrencyInput } from "@/components/CurrencyInput";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAppContext } from "@/hooks/useAppContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as zod from "zod";

const costSettingsSchema = zod.object({
  stage: zod.coerce
    .number({ invalid_type_error: "Court rent must be a number" })
    .min(1000, "Stage rent must be at least 1000 VND"),
  shuttlecock: zod.coerce
    .number({ invalid_type_error: "Shuttlecock price must be a number" })
    .min(1000, "Shuttlecock price must be at least 1000 VND"),
});

type CostSettingsForm = zod.infer<typeof costSettingsSchema>;

export default function CostSettings() {
  const { cost, updateCost } = useAppContext();

  const form = useForm<CostSettingsForm>({
    resolver: zodResolver(costSettingsSchema),
    defaultValues: cost || {
      stage: 1000,
      shuttlecock: 1000,
    },
  });

  const onSubmit = (data: CostSettingsForm) => {
    updateCost(data);
  };

  return (
    <div>
      <Form {...form}>
        <form
          className="space-y-3 sm:space-y-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="stage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Giá thuê sân (theo giờ)</FormLabel>
                <FormControl>
                  <CurrencyInput
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="1.000"
                    formatAsNumber={true}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="shuttlecock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Giá cầu (theo quả)</FormLabel>
                <FormControl>
                  <CurrencyInput
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="1.000"
                    formatAsNumber={true}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-medium py-2 sm:py-2.5 rounded-lg sm:rounded-xl shadow-sm transition-all duration-200 text-sm sm:text-base h-10 sm:h-11 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-emerald-500 disabled:hover:to-teal-500"
          >
            Save Settings
          </Button>
        </form>
      </Form>
    </div>
  );
}
