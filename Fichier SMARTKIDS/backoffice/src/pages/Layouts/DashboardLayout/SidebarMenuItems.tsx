import {
  CalendarClockIcon,
  Car,
  CarTaxiFront,
  FileQuestion,
  HandCoins,
  Home,
  List,
  LucideCoins,
  LucideIcon,
  Settings,
  Store,
  Tag,
  Users2,
} from "lucide-react";

export const MENU_ITEMS: {
  label: string;
  path: string;
  icon: LucideIcon;
}[] = [
  {
    label: "Tableau de bord",
    path: "/",
    icon: Home,
  },
  {
    label: "Utilisateurs",
    path: "/utilisateurs",
    icon: Users2,
  },
  {
    label: "Etablissements",
    path: "/etablissements",
    icon: Store,
  },
  {
    label: "Categories",
    path: "/categories",
    icon: Tag,
  },
  {
    label: "Options",
    path: "/options",
    icon: List,
  },
  {
    label: "Paramètres",
    path: "/parametres",
    icon: Settings,
  },
];
