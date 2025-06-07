import React from "react";
import Stripe from "stripe";
import { PayPalSubscription } from "@/src/features/subscriptions/store/subscription.request";
import { format, fromUnixTime } from "date-fns";
import { HStack, VStack } from "@gluestack-ui/themed";
import { fr } from "date-fns/locale";
import { formatSubscriptionReccurence } from "@/src/features/subscriptions/utils/subscription.util";
import CancelSubscriptionCancelationBtn from "./CancelSubscriptionCancelationBtn";
import { Badge } from "@gluestack-ui/themed";
import { BadgeText } from "@gluestack-ui/themed";
import { Subscription } from "@/src/types/subscription.types";
import { SubscriptionPlan } from "@/src/types/subscription-plan.types";
import THEME from "@/constants/theme";
import { StyledText } from "@/components/StyledText";
import { formatCurrency } from "@/src/lib";
import { useTranslation } from "react-i18next";

const STATUS_LABELS: Record<Stripe.Subscription["status"], string> = {
  active: "Actif",
  past_due: "En retard de paiement",
  canceled: "Annulé",
  incomplete: "Incomplet",
  incomplete_expired: "Incomplet expiré",
  trialing: "En période d'essai",
  unpaid: "Impayé",
  paused: "En pause",
};

export default function SubscriptionStatus({
  data,
}: {
  data?: {
    subscription: Subscription;
    providerSubscription?: Stripe.Subscription | PayPalSubscription;
  };
}) {

  const { t } = useTranslation();

  if (!data || !data.providerSubscription) {
    return null;
  }
  const { subscription, providerSubscription } = data;
  // For now we only support Stripe.
  const { current_period_end, status, cancel_at_period_end } =
    providerSubscription as Stripe.Subscription;

  const formatDate = (timestamp: number) =>
    format(fromUnixTime(timestamp), "dd MMM, yyyy", { locale: fr });

  const getStatusColor = () => {
    switch (status) {
      case "active":
        return "#4CAF50";
      case "past_due":
        return "#FFC107";
      case "canceled":
        return "#F44336";
      default:
        return "#9E9E9E";
    }
  };

  const statusColor = getStatusColor();
  const plan = subscription.plan as SubscriptionPlan;
  return (
    <VStack
      space="xs"
      bg={THEME.colors.WHITE}
      borderWidth={1}
      borderColor={THEME.colors.PRIMARY}
      borderRadius="$lg"
      p="$3"
    >
      <HStack justifyContent="space-between" alignItems="center">
        <StyledText weight="semi-bold">{t('statut_de_l_abonnement')}</StyledText>
        <Badge size="sm" bg={statusColor} variant="solid" borderRadius="$lg">
          <BadgeText
            fontFamily={THEME.font_familly.semiBold}
            color={THEME.colors.WHITE}
          >
            {STATUS_LABELS[status]}
          </BadgeText>
        </Badge>
      </HStack>

      <HStack justifyContent="space-between" alignItems="center">
        <StyledText weight="semi-bold">{t('plan_actuel')}</StyledText>
        <StyledText>
          {plan.name} (
          <StyledText>
            {formatCurrency(plan.price)} /{" "}
            {formatSubscriptionReccurence(
              plan.interval_unit,
              plan.interval_count
            )}
          </StyledText>
          )
        </StyledText>
      </HStack>
      <HStack justifyContent="space-between" alignItems="center">
        <StyledText weight="semi-bold">{t('actif_jusqu_au')} </StyledText>
        <StyledText>{formatDate(current_period_end)}</StyledText>
      </HStack>

      {cancel_at_period_end && (
        <VStack mt={THEME.spacing.HORIZ} flex={1} space="md">
          <StyledText
            color={THEME.colors.DANGER}
            weight="semi-bold"
            style={{ flex: 1 }}
          >
            {t('votre_abonnement_sera_annule')} (
            {formatDate(current_period_end)}).
          </StyledText>
          <CancelSubscriptionCancelationBtn id={subscription.id} />
        </VStack>
      )}
    </VStack>
  );
}
