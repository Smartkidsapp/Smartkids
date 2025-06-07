import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppSelector } from "@/redux/store";
import { selectUser } from "@/redux/auth/auth.slice";
import { useMemo } from "react";
import { initial } from "@/lib/utils";
import { Link } from "react-router-dom";
import LogoutBtn from "@/pages/Layouts/DashboardLayout/LogoutBtn";
import avatarImg from "@/assets/images/avatar.png";

export default function UserMenu() {
  const user = useAppSelector(selectUser);
  const nameInitials = useMemo(() => initial(user?.name ?? ""), [user?.name]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="overflow-hidden rounded-full"
        >
          <Avatar>
            <AvatarImage
              src={user?.avatar ?? avatarImg}
              alt={user?.name ?? "Photo de profil."}
            />
            <AvatarFallback>{nameInitials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="font-medium">{user?.name}</div>
          <div className="text-sm text-muted-foreground">{user?.email}</div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link to="/parametres">Paramètres</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LogoutBtn />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
