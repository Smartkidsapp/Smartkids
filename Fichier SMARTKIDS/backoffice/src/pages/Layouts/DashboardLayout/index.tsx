import { Outlet } from "react-router-dom";
import Sidebar from "@/pages/Layouts/DashboardLayout/Sidebar";
import MobileSidebar from "@/pages/Layouts/DashboardLayout/MobileSidebar";
import AuthGuard from "@/components/AuthGuard";
import UserMenu from "./UserMenu";

export default function DashboardLayout() {
  return (
    <AuthGuard>
      <div className="flex min-h-screen flex-col bg-muted/40">
        <Sidebar />
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            <MobileSidebar />
            <div className="relative ml-auto flex-1 md:grow-0">
              <UserMenu />
            </div>
          </header>
          <main>
            <Outlet />
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
