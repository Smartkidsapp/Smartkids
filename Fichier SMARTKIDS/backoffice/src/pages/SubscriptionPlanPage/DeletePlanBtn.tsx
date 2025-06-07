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
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useDeleteSubscriptionPlanMutation } from "@/redux/subscriptionPlan/subscriptionPlan.apiSlice";

export default function DeletePlanBtn({ planId }: { planId: string }) {
  const [eraseRideMutation, { isLoading }] =
    useDeleteSubscriptionPlanMutation();

  const handlePress = useCallback(() => {
    eraseRideMutation(planId).then((res) => {
      if ("data" in res) {
        toast.success("Plan supprimé avec succès.");
      }
      if ("error" in res) {
        handleApiError({ error: res.error });
      }
    });
  }, [planId, eraseRideMutation]);

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
