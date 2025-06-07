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
import { useDeleteEtablissementMutation } from "@/redux/etablissement/etblissement.apiSlice";

export default function DeleteUserBtn({ id }: { id: string }) {
  
  return <DeleteUserBtn_ id={id} />;
}

function DeleteUserBtn_({ id }: { id: string }) {
  const [eraseEtablissementMutation, { isLoading }] = useDeleteEtablissementMutation();

  const handlePress = useCallback(() => {
    eraseEtablissementMutation(id).then((res) => {
      if ("data" in res) {
        toast.success(res.data.message);
      }

      if ("error" in res) {
        handleApiError({ error: res.error });
      }
    });
  }, [id, eraseEtablissementMutation]);

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
            Cette établissement sera définitivement supprimées.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction
            disabled={isLoading}
            onClick={handlePress}
            className=" hover:bg-destructive/90 bg-destructive text-white"
          >
            Supprimer définitement
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
