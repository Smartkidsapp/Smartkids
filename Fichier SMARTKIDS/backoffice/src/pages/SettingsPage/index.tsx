import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AppBreadCrumb from "../Layouts/DashboardLayout/AppBreadCrumb";
import UpdatePassword from "./UpdatePassword";
import PricesConfigPage from "./PricesConfigPage";
import SubscriptionPlanPage from "../SubscriptionPlanPage";

export default function SettingsPage() {
  return (
    <>
      <AppBreadCrumb
        paths={[
          { path: "/", label: "Tableau de bord" },
          { current: true, label: "Paramètres" },
        ]}
      />

      <div className="grid flex-1 items-start gap-4 sm:gap-6 p-4 sm:px-6 sm:py-0 ">
        <Tabs defaultValue="password">
          <TabsList>
            <TabsTrigger value="password">Mot de passe</TabsTrigger>
            {/*<TabsTrigger value="prices-config">
              Configuration des prix
            </TabsTrigger>*/}
            <TabsTrigger value="subscription-plans">
              Formules d'abonnement
            </TabsTrigger>
          </TabsList>
          <TabsContent value="password">
            <UpdatePassword />
          </TabsContent>
          <TabsContent value="prices-config">
            <PricesConfigPage />
          </TabsContent>
          <TabsContent value="subscription-plans">
            <SubscriptionPlanPage />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
