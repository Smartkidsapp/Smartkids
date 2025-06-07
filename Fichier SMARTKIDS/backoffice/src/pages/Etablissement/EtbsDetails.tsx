import { useParams, useSearchParams } from "react-router-dom";
import AppBreadCrumb from "../Layouts/DashboardLayout/AppBreadCrumb";
import UserEtablissement from "../UserDetails/UserEtablissement";
import Etablissement from "./Etablissement";
// import RideDetailsLoader from "./RideDetailsLoader";
// import RideComponent from "./RideComponent";

export default function EtbsDetails() {
    const { id } = useParams<{ id: string; name: string }>();
    const [params] = useSearchParams();

    return (
        <>
            <AppBreadCrumb
                paths={[
                    { path: "/", label: "Tableau de bord" },
                    { path: "/etablissements", label: "Etablissements" },
                    { current: true, label: params.get("name") ?? "" },
                ]}
            />

            <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
                <Etablissement id={id!} />
            </div>
        </>
    );
}
