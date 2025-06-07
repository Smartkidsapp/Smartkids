import React from "react";
import { Center, Pressable, useToast } from "@gluestack-ui/themed";
import { useCancelSubscriptionMutation } from "@/src/features/subscriptions/store/subscription.apiSlice";
import { handleApiError } from "@/src/utils/error.util";
import { ActivityIndicator } from "react-native";
import { SheetManager } from "react-native-actions-sheet";
import THEME from "@/constants/theme";
import BaseToast from "@/components/BaseToast";
import { StyledText } from "@/components/StyledText";
import { useTranslation } from "react-i18next";

export default function CancelSubscriptionBtn({ id }: { id: string }) {

  const { t } = useTranslation();

  const [cancel, { isLoading }] = useCancelSubscriptionMutation();
  const toast = useToast();
  const handleCancelSubscription = async () => {
    const confirm = await SheetManager.show("confirm-sheet", {
      payload: {
        title: t('annuler_l_abonnement'),
        description: t('vouloir_annuler_votre_abonnement'),
      },
    });
    if (!confirm) return;

    cancel(id).then((res) => {
      if ("data" in res && res.data) {
        toast.show({
          placement: "top",
          render: () => (
            <BaseToast
              title={t('abonnement_annule')}
              description={t('abonnement_annule_avec_succes')}
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
    <Center>
      <Pressable onPress={handleCancelSubscription} disabled={isLoading}>
        {isLoading ? (
          <ActivityIndicator color={THEME.colors.DANGER} size="small" />
        ) : (
          <StyledText color={THEME.colors.DANGER} weight="semi-bold">
            {t('annuler_l_abonnement')}
          </StyledText>
        )}
      </Pressable>
    </Center>
  );
}
