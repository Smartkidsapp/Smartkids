import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { handleApiError } from "@/lib/error.utils";
import {
  FormItem,
  FormLabel,
  FormField,
  FormControl,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useEffect } from "react";
import { SubscriptionPlan } from "@/types/susbcription-plan.types";
import {
  CreateSubscriptionPlanDTO,
  createSubscriptionPlanSchema,
} from "@/redux/subscriptionPlan/subscription-plan.request";
import { useCreateOrUpdateSubscriptionPlanMutation } from "@/redux/subscriptionPlan/subscriptionPlan.apiSlice";
import { Textarea } from "@/components/ui/textarea";
import { getIntervalUnitLabel } from ".";
import MultiSelect from "@/components/MultiSelect";

export default function SubscriptionPlanForm({
  subscriptionPlan,
  onSuccess,
}: {
  subscriptionPlan?: SubscriptionPlan;
  onSuccess: () => void;
}) {
  const [signup, { isLoading }] = useCreateOrUpdateSubscriptionPlanMutation();
  const form = useForm<CreateSubscriptionPlanDTO>({
    resolver: zodResolver(createSubscriptionPlanSchema),
  });
  const { control, reset, handleSubmit, setError } = form;

  const onSubmit = (data: CreateSubscriptionPlanDTO) => {
    signup({
      ...data,
      id: subscriptionPlan?.id,
    }).then((res) => {
      if ("data" in res && res.data) {
        toast.success(
          subscriptionPlan ? "Plan mis à jour" : "Plan créé avec succès."
        );

        onSuccess();
        reset();
        return;
      }

      if ("error" in res && res.error) {
        handleApiError({
          error: res.error,
          setFormError: setError,
        });
      }
    });
  };

  useEffect(() => {
    if (subscriptionPlan) {
      reset({
        description: subscriptionPlan.description,
        name: subscriptionPlan.name,
        price: subscriptionPlan.price,
        interval_unit: subscriptionPlan.interval_unit,
        interval_count: subscriptionPlan.interval_count,
        trial_interval_unit: subscriptionPlan.trial_interval_unit,
        trial_interval_count: subscriptionPlan.trial_interval_count,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subscriptionPlan]);

  return (
    <div>
      <Form {...form}>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <FormField
              control={control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom du plan</FormLabel>
                  <FormControl>
                    <Input
                      required
                      type="text"
                      placeholder="Nom du plan"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-2">
            <FormField
              control={control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prix par cycle</FormLabel>
                  <FormControl>
                    <Input
                      required
                      type="number"
                      placeholder="Prix par cycle"
                      {...field}
                      onChange={(e) => {
                        field.onChange(+e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-2">
            <FormField
              control={control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      required
                      rows={4}
                      placeholder="Description"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <fieldset className="border p-4 rounded">
            <legend>Période d'essaie</legend>
            <div className="grid gap-2 mb-2">
              <FormField
                control={control}
                name="trial_interval_unit"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Unité d'intervalle</FormLabel>
                      <FormControl>
                        <MultiSelect
                          value={field.value ? [field.value] : []}
                          items={["day", "week", "month", "year"].map((v) => ({
                            value: v,
                            label: getIntervalUnitLabel(v),
                          }))}
                          onChange={(v) => {
                            field.onChange(v[v.length - 1] ?? null);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>

            <div className="grid gap-2 mb-2">
              <FormField
                control={control}
                name="trial_interval_count"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre d'unité d'intervalle par cycle</FormLabel>
                    <FormControl>
                      <Input
                        required
                        type="number"
                        placeholder="Nombre d'unité d'intervalle par cycle"
                        {...field}
                        onChange={(e) => {
                          field.onChange(+e.target.value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </fieldset>

          <fieldset className="border p-4 rounded">
            <legend>Cycle régulier</legend>

            <div className="grid gap-2">
              <FormField
                control={control}
                name="interval_unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unité d'intervalle</FormLabel>
                    <FormControl>
                      <MultiSelect
                        value={field.value ? [field.value] : []}
                        items={["day", "week", "month", "year"].map((v) => ({
                          value: v,
                          label: getIntervalUnitLabel(v),
                        }))}
                        onChange={(v) => {
                          field.onChange(v[v.length - 1] ?? null);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-2 mb-2">
              <FormField
                control={control}
                name="interval_count"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre d'unité d'intervalle par cycle</FormLabel>
                    <FormControl>
                      <Input
                        required
                        type="number"
                        placeholder="Nombre d'unité d'intervalle par cycle"
                        {...field}
                        onChange={(e) => {
                          field.onChange(+e.target.value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </fieldset>
        </div>
      </Form>
      <Button
        disabled={isLoading}
        className="w-full"
        onClick={handleSubmit(onSubmit)}
      >
        {subscriptionPlan ? "Mettre à jour" : "Ajouter"}
      </Button>
    </div>
  );
}
