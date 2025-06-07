import { User } from "@/types/user.types";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import { MailCheck, MailX } from "lucide-react";
import { Card } from "./ui/card";

export default function UserEmail({ user }: { user: User }) {
  return (
    <div>
      <Tooltip>
        <TooltipTrigger>
          <div className="flex  gap-2 items-center text-sm text-muted-foreground">
            <span>{user.email}</span>
            <span
              className={`${
                user.emailVerified ? "text-green-400" : "text-red-400"
              }`}
            >
              {user.emailVerified ? (
                <MailCheck className="h-4 w-4" />
              ) : (
                <MailX className="h-4 w-4" />
              )}
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent align="end">
          <Card className="p-3">
            {user.emailVerified ? "Email vérifiée" : "Email non vérifiée"}
          </Card>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
