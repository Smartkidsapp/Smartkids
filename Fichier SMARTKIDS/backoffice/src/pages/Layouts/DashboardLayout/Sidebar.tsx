import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { NavLink, useLocation } from "react-router-dom";
import Logo from "@/assets/images/logo.png";
import { MENU_ITEMS } from "./SidebarMenuItems";

export default function Sidebar() {
  const { pathname } = useLocation();
  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
      <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
        <NavLink
          to="#"
          className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-secondary text-lg font-semibold text-sebg-secondary-foreground md:h-8 md:w-8 md:text-base"
        >
          <img
            className="h-4 w-4 transition-all group-hover:scale-110"
            src={Logo}
          />
          <span className="sr-only">SmartKids</span>
        </NavLink>

        {MENU_ITEMS.map((menu) => (
          <Tooltip key={menu.label}>
            <TooltipTrigger asChild>
              <NavLink
                to={menu.path}
                className={`${
                  (menu.path !== "/" && pathname.includes(menu.path)) ||
                  menu.path === pathname
                    ? "bg-accent "
                    : ""
                } flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8`}
              >
                <menu.icon className="h-5 w-5" />
                <span className="sr-only">{menu.label}</span>
              </NavLink>
            </TooltipTrigger>
            <TooltipContent side="right">{menu.label}</TooltipContent>
          </Tooltip>
        ))}
      </nav>
    </aside>
  );
}
