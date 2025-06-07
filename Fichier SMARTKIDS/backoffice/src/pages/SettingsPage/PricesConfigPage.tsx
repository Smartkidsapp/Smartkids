import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import {
  useGetPricesConfigQuery,
  useUpdatePricesConfigMutation,
} from "@/redux/rides/ride.apiSlice";
import { UpdatePricesConfigDto } from "@/redux/rides/ride.request";
import { useEffect } from "react";

export default function PricesConfigPage() {
  const [signup, { isLoading }] = useUpdatePricesConfigMutation();
  const form = useForm<UpdatePricesConfigDto>({
    // resolver: zodResolver(updatePricesConfigSchema),
  });
  const { control, reset, handleSubmit, setError } = form;

  const onSubmit = (data: UpdatePricesConfigDto) => {
    signup(data).then((res) => {
      if ("data" in res && res.data) {
        toast.success("Configuration mise à jour avec succès.");

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

  const { data } = useGetPricesConfigQuery();

  useEffect(() => {
    if (data?.data) {
      const prices = data.data;
      reset({
        animalPriceDay: prices.supplements.day.animal,
        animalPriceNight: prices.supplements.night.animal,

        luggagePriceDay: prices.supplements.day.luggage,
        luggagePriceNight: prices.supplements.night.luggage,

        personPriceDay: prices.supplements.day.person,
        personPriceNight: prices.supplements.night.person,

        basePrice: prices.base_price,

        pricePerKmDay: prices.price_per_km.day,
        pricePerKmNight: prices.price_per_km.night,

        pricePerMinutesNight: prices.price_per_minute.night,
        pricePerMinutesDay: prices.price_per_minute.day,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <div className="grid w-full lg:w-[650px] lg:gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Mise à jour des tarifs (en Euros)</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <div className="grid lg:grid-cols-2 gap-4">
              <div className="grid gap-2 col-span-2">
                <FormField
                  control={control}
                  name="basePrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prix de base</FormLabel>
                      <FormControl>
                        <Input
                          required
                          type="number"
                          placeholder="Prix de base"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <fieldset className="border p-4 rounded">
                <legend>Prix par kilomètre</legend>
                <div className="grid gap-2 mb-2">
                  <FormField
                    control={control}
                    name="pricePerKmDay"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prix journalier</FormLabel>
                        <FormControl>
                          <Input
                            required
                            type="number"
                            placeholder="Prix journalier"
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
                    name="pricePerKmNight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prix nocturne</FormLabel>
                        <FormControl>
                          <Input
                            required
                            type="number"
                            placeholder="Prix nocturne"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </fieldset>

              <fieldset className="border p-4 rounded">
                <legend>Prix par minute</legend>
                <div className="grid gap-2 mb-2">
                  <FormField
                    control={control}
                    name="pricePerMinutesDay"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prix journalier</FormLabel>
                        <FormControl>
                          <Input
                            required
                            type="number"
                            placeholder="Prix journalier"
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
                    name="pricePerMinutesNight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prix nocturne</FormLabel>
                        <FormControl>
                          <Input
                            required
                            type="number"
                            placeholder="Prix nocturne"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </fieldset>

              <fieldset className="border p-4 rounded">
                <legend>Prix par Bagage</legend>
                <div className="grid gap-2 mb-2">
                  <FormField
                    control={control}
                    name="luggagePriceDay"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prix journalier</FormLabel>
                        <FormControl>
                          <Input
                            required
                            type="number"
                            placeholder="Prix journalier"
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
                    name="luggagePriceNight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prix nocturne</FormLabel>
                        <FormControl>
                          <Input
                            required
                            type="number"
                            placeholder="Prix nocturne"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </fieldset>

              <fieldset className="border p-4 rounded">
                <legend>Prix par animal</legend>
                <div className="grid gap-2 mb-2">
                  <FormField
                    control={control}
                    name="animalPriceDay"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prix journalier</FormLabel>
                        <FormControl>
                          <Input
                            required
                            type="number"
                            placeholder="Prix journalier"
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
                    name="animalPriceNight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prix nocturne</FormLabel>
                        <FormControl>
                          <Input
                            required
                            type="number"
                            placeholder="Prix nocturne"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </fieldset>

              <fieldset className="border p-4 rounded">
                <legend>Prix par personne</legend>
                <div className="grid gap-2 mb-2">
                  <FormField
                    control={control}
                    name="personPriceDay"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prix journalier</FormLabel>
                        <FormControl>
                          <Input
                            required
                            type="number"
                            placeholder="Prix journalier"
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
                    name="personPriceNight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prix nocturne</FormLabel>
                        <FormControl>
                          <Input
                            required
                            type="number"
                            placeholder="Prix nocturne"
                            {...field}
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
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full"
            onClick={handleSubmit(onSubmit)}
          >
            Mettre à jour
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
