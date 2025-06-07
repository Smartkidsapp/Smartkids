import { User } from "@/types/user.types";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import { AvatarImage } from "./ui/avatar";
import avatarImg from "@/assets/images/avatar.png";
import { initial } from "@/lib/utils";
import UserEmail from "./UserEmail";
import StarWidget from "./StarWidget";
import { Link } from "react-router-dom";

export default function UserPreview({ user }: { user: User }) {
  return (
    <Link to={`/utilisateurs/${user.id}?name=${user.name}`}>
      <div className="flex items-center gap-2">
        <Avatar>
          <AvatarImage
            className="rounded-full h-10 w-10"
            src={user.avatar ?? avatarImg}
            alt={user.name}
          />
          <AvatarFallback>{initial(user.name.slice(0, 3))}</AvatarFallback>
        </Avatar>
        <div>
          <div>{user.name}</div>
          <UserEmail user={user} />
          <StarWidget rating={user?.rating} />
        </div>
      </div>
    </Link>
  );
}
