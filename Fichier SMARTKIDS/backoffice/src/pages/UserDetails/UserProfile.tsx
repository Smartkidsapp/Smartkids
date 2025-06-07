import StarWidget from "@/components/StarWidget";
import UserEmail from "@/components/UserEmail";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { initial } from "@/lib/utils";
import { useGetUserQuery } from "@/redux/users/user.apiSlice";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { Separator } from "@radix-ui/react-dropdown-menu";
import avatarImg from "@/assets/images/avatar.png";
import { USER_ROLES_LABELS, UserRoleEnum } from "@/types/user.types";
import UserBalance from "./UserBalance";

export default function UserProfile({ userId }: { userId: string }) {
  const { data, isFetching } = useGetUserQuery(userId);

  if (isFetching || !data) {
    return (
      <Card>
        <CardContent>
          <Skeleton className="h-[500px]" />
        </CardContent>
      </Card>
    );
  }

  const user = data.data;

  return (
    <div className="grid gap-4">
      <Card className="overflow-hidden">
        <CardContent className="p-6 text-sm">
          <div className="flex flex-col items-center justify-center">
            <Avatar className="h-24 w-24">
              <AvatarImage
                className="rounded-full h-24 w-24"
                src={user.avatar ?? avatarImg}
                alt={user.name}
              />
              <AvatarFallback>{initial(user.name.slice(0, 3))}</AvatarFallback>
            </Avatar>

            <div>{user.name}</div>
            <UserEmail user={user} />
            <div className="flex  gap-2 items-center text-sm text-muted-foreground">
              <span>{user.phone}</span>
            </div>
            <div/>
          </div>
          <Separator className="my-2" />
          <ul>
            <li>
              Rôle principal: <strong>{USER_ROLES_LABELS[user.role]}</strong>
            </li>
            <li>
              Rôle actif: <strong>{USER_ROLES_LABELS[user.activeRole]}</strong>
            </li>
          </ul>
        </CardContent>
      </Card>

      {user.role === UserRoleEnum.DRIVER ? (
        <UserBalance userId={user.id} />
      ) : null}
    </div>
  );
}
