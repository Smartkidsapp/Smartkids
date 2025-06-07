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
import { useDeleteOptionMutation } from "@/redux/options/options.apiSlice";

export default function DeleteOptionBtn({ id }: { id: string }) {
  
  return <DeleteOptionBtn_ id={id} />;
}

function DeleteOptionBtn_({ id }: { id: string }) {
  const [eraseOptionMutation, { isLoading }] = useDeleteOptionMutation();

  const handlePress = useCallback(() => {
    eraseOptionMutation(id).then((res) => {
      if ("data" in res) {
        toast.success(res.data.message);
      }

      if ("error" in res) {
        handleApiError({ error: res.error });
      }
    });
  }, [id, eraseOptionMutation]);

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
            Cette option sera définitivement supprimées.
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
