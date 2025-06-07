import React from "react";
import { Pressable, useToast } from "@gluestack-ui/themed";
import { useCancelSubscriptionCancelationMutation } from "@/src/features/subscriptions/store/subscription.apiSlice";
import { handleApiError } from "@/src/utils/error.util";
import { ActivityIndicator } from "react-native";
import THEME from "@/constants/theme";
import { StyledText } from "@/components/StyledText";
import { SheetManager } from "react-native-actions-sheet";
import BaseToast from "@/components/BaseToast";
import Colors from "@/constants/Colors";

export default function CancelSubscriptionCancelationBtn({
  id,
}: {
  id: string;
}) {
  const [cancel, { isLoading }] = useCancelSubscriptionCancelationMutation();
  const toast = useToast();
  const handleCancelSubscription = async () => {
    const confirm = await SheetManager.show("confirm-sheet", {
      payload: {
        title: "Annuler l'annulation de l'abonnement",
        description:
          "Êtes-vous sûr de vouloir annuler l'annulation de votre abonnement ?",
      },
    });
    if (!confirm) return;

    cancel(id).then((res) => {
      if ("data" in res && res.data) {
        toast.show({
          placement: "top",
          render: () => (
            <BaseToast
              description="Annulation de l'abonnement annulée."
              bgColor={THEME.colors.SUCCESS}
            />
          ),
        });
      } else if ("error" in res) {
        handleApiError({
          error: res.error,
          toast,
        });
      }
    });
  };

  return (
    <Pressable onPress={handleCancelSubscription} disabled={isLoading}>
      {isLoading ? (
        <ActivityIndicator color={THEME.colors.PRIMARY} size="small" />
      ) : (
        <StyledText color={Colors.light.textPrimary} weight="bold">
          Annuler l'annulation de l'abonnement
        </StyledText>
      )}
    </Pressable>
  );
}
