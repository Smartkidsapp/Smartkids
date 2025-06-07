import AppBreadCrumb from "../Layouts/DashboardLayout/AppBreadCrumb";
import RideStats from "./RideStats";

export default function DashboardPage() {
  return (
    <div className="px-4 flex flex-col gap-4">
      <AppBreadCrumb paths={[{ current: true, label: "Tableau de bord" }]} />

      <RideStats />
    </div>
  );
}
