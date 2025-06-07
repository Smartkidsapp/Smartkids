import { createBrowserRouter } from "react-router-dom";
import SigninPage from "@/pages/SigninPage";
import SettingsPage from "@/pages/SettingsPage";
import DashboardLayout from "@/pages/Layouts/DashboardLayout";
import UsersPage from "@/pages/UsersPage";
import DashboardPage from "@/pages/DashboardPage";
import ErrorBoundary from "./components/ErrorBoundary";
import UserDetails from "./pages/UserDetails";
import NewUser from "./pages/NewUser";
import SubscriptionsPage from "./pages/SubscriptionsPage";
import EtablissementsPage from "./pages/Etablissement";
import EtbsDetails from "./pages/Etablissement/EtbsDetails";
import CategoriesPage from "./pages/Categoy";
import EditCategory from "./pages/Categoy/EditCategory";
import NewCategory from "./pages/Categoy/NewCategory";
import OptionsPage from "./pages/Option";
import EditOption from "./pages/Option/EditOption";
import NewOption from "./pages/Option/NewOption";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <DashboardLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: "",
        element: <DashboardPage />,
      },
      {
        path: "utilisateurs",
        element: <UsersPage />,
      },
      {
        path: "utilisateurs/ajouter",
        element: <NewUser />,
      },
      {
        path: "utilisateurs/:id",
        element: <UserDetails />,
      },
      {
        path: "etablissements",
        element: <EtablissementsPage />,
      },
      {
        path: "etablissements/:id",
        element: <EtbsDetails />,
      },
      {
        path: "categories",
        element: <CategoriesPage />,
      },
      {
        path: "categories/:id",
        element: <EditCategory />,
      },
      {
        path: "categories/ajouter",
        element: <NewCategory />,
      },
      {
        path: "options",
        element: <OptionsPage />,
      },
      {
        path: "options/:id",
        element: <EditOption />,
      },
      {
        path: "options/ajouter",
        element: <NewOption />,
      },
      {
        path: "abonnements",
        element: <SubscriptionsPage />,
      },
      {
        path: "/parametres",
        element: <SettingsPage />,
      },
    ],
  },
  {
    path: "/connexion",
    element: <SigninPage />,
  },
]);
