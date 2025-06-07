import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { LineChart, PanelLeft } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import Logo from "@/assets/images/logo.png";
import { MENU_ITEMS } from "./SidebarMenuItems";

export default function MobileSidebar() {
  const { pathname } = useLocation();
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline" className="sm:hidden">
          <PanelLeft className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="sm:max-w-xs">
        <nav className="grid gap-6 text-lg font-medium">
          <NavLink
            to="/"
            className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-secondary text-lg font-semibold text-secondary-foreground md:text-base"
          >
            <img
              className="h-5 w-5 transition-all group-hover:scale-110"
              src={Logo}
            />
            <span className="sr-only">SmartKids</span>
          </NavLink>

          {MENU_ITEMS.map((menu) => (
            <NavLink
              key={menu.label}
              to={menu.path}
              className={`${
                (menu.path !== "/" && pathname.includes(menu.path)) ||
                menu.path === pathname
                  ? "bg-accent "
                  : ""
              } flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground`}
            >
              <menu.icon className="h-5 w-5" />
              {menu.label}
            </NavLink>
          ))}

          <NavLink
            to="/parametres"
            className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
          >
            <LineChart className="h-5 w-5" />
            Paramètres
          </NavLink>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
