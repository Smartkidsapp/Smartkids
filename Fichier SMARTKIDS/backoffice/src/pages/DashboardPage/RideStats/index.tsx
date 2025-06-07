import { useGetRideStatsQuery } from "@/redux/rides/ride.apiSlice";
import Loader from "./Loader";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useGetStatsQuery } from "@/redux/users/user.apiSlice";

export default function RideStats() {
  const { data, isFetching } = useGetStatsQuery();

  const { users, etablissements, categories, options, subscriptionPlans } = data?.data ?? {};

  if (isFetching) {
    return <Loader />;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-4">

      <Card className="sm:col-span-2 2xl:col-span-1">
        <CardHeader className="pb-2">
          <CardDescription>Utilisateur</CardDescription>
          <CardTitle className="text-4xl">
            {users}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xs text-muted-foreground">
            Inclus toutes les utilisateurs inscrits.
          </div>
        </CardContent>
      </Card>

      <Card className="sm:col-span-2 2xl:col-span-1">
        <CardHeader className="pb-2">
          <CardDescription>Etablissement</CardDescription>
          <CardTitle className="text-4xl">
            {etablissements}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xs text-muted-foreground">
            Inclus toute les établissements créés par les utilisateurs.
          </div>
        </CardContent>
      </Card>

      <Card className="sm:col-span-2 2xl:col-span-1">
        <CardHeader className="pb-2">
          <CardDescription>Catégorie</CardDescription>
          <CardTitle className="text-4xl">
            {categories}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xs text-muted-foreground">
            Inclus toutes les catégories
          </div>
        </CardContent>
      </Card>

      <Card className="sm:col-span-2 2xl:col-span-1">
        <CardHeader className="pb-2">
          <CardDescription>Options</CardDescription>
          <CardTitle className="text-4xl">
            {options}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xs text-muted-foreground">
            Inclus toutes les options.
          </div>
        </CardContent>
      </Card>

      <Card className="sm:col-span-2 2xl:col-span-1">
        <CardHeader className="pb-2">
          <CardDescription>Plan d'abonnement</CardDescription>
          <CardTitle className="text-4xl">
            {subscriptionPlans}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xs text-muted-foreground">
            Inclus toutes les plans d'abonnements créé par vous.
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
