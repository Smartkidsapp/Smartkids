import { Button } from "@/components/ui/button";
import { handleApiError } from "@/lib/error.utils";
import { Trash2 } from "lucide-react";
import { useCallback } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import {
  useDeleteAccountMutation,
  useGetCanDeleteAccountQuery,
} from "@/redux/users/user.apiSlice";
import { Card } from "@/components/ui/card";

export default function DeleteUserBtn({ userId }: { userId: string }) {
  const { data } = useGetCanDeleteAccountQuery(userId);

  if (!data || data.status !== "OK") {
    return (
      <Tooltip>
        <TooltipTrigger>
          <Button
            disabled
            size="icon"
            variant="outline"
            className="border-destructive cursor-not-allowed"
          >
            <Trash2 className="h-5 w-5 text-destructive" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <Card className="max-w-[200px] p-3">
            Vous ne pouvez pas supprimer un utilisateur avec un abonnement en cours.
          </Card>
        </TooltipContent>
      </Tooltip>
    );
  }

  return <DeleteUserBtn_ userId={userId} />;
}

function DeleteUserBtn_({ userId }: { userId: string }) {
  const [eraseRideMutation, { isLoading }] = useDeleteAccountMutation();

  const handlePress = useCallback(() => {
    eraseRideMutation(userId).then((res) => {
      if ("data" in res) {
        toast.success(res.data.message);
      }

      if ("error" in res) {
        handleApiError({ error: res.error });
      }
    });
  }, [userId, eraseRideMutation]);

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button size="icon" variant="outline" className="border-destructive">
          <Trash2 className="h-5 w-5 text-destructive" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Etes-vous sûr(e) de vouloir continuer ?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Les informations personnelles de cet utilisateur seront
            définitivement supprimées.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction
            disabled={isLoading}
            onClick={handlePress}
            className=" hover:bg-destructive/90 bg-destructive"
          >
            Supprimer définitement
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
