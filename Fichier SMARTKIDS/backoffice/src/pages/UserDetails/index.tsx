import { useParams, useSearchParams } from "react-router-dom";
import AppBreadCrumb from "../Layouts/DashboardLayout/AppBreadCrumb";
// import RideDetailsLoader from "./RideDetailsLoader";
// import RideComponent from "./RideComponent";
import UserStats from "./UserStats";
import UserProfile from "./UserProfile";
import UserOffers from "./UserOffers";
import UserEtablissement from "./UserEtablissement";

export default function UserDetails() {
  const { id } = useParams<{ id: string; name: string }>();
  const [params] = useSearchParams();

  return (
    <>
      <AppBreadCrumb
        paths={[
          { path: "/", label: "Tableau de bord" },
          { path: "/utilisateurs", label: "Utilisateurs" },
          { current: true, label: params.get("name") ?? "" },
        ]}
      />

      <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
        <UserProfile userId={id!} />

        <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
          <UserEtablissement userId={id!} />
        </div>
      </div>
    </>
  );
}
