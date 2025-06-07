import React from "react";
import { Box, HStack, VStack } from "@gluestack-ui/themed";
import { getSubscriptionPlanPriceBreakdown } from "@/src/features/subscriptions/utils/subscription.util";
import { SubscriptionPlan } from "@/src/types/subscription-plan.types";
import { StyledText } from "@/components/StyledText";
import THEME from "@/constants/theme";
import { formatCurrency } from "@/src/lib";
import { useTranslation } from "react-i18next";

export default function SubscriptionPriceBreakdown({
  plan,
}: {
  plan: SubscriptionPlan;
}) {

  const { t } = useTranslation();

  const { price, taxAmount, totalPrice } =
    getSubscriptionPlanPriceBreakdown(plan);

  return (
    <VStack space="xl">
      <VStack space="xs">
        <StyledText size={THEME.font_sizes.TITLE} weight="bold">
          {t('prix_d_abonnement')}
        </StyledText>
        {/*<StyledText>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Impedit eos
          voluptate culpa?
        </StyledText>*/}
      </VStack>

      <Box>
        <HStack
          py={THEME.spacing.HORIZ / 3}
          justifyContent="space-between"
          alignItems="center"
          borderBottomWidth={1}
          borderStyle="dashed"
          borderColor={THEME.colors.BLACK30}
        >
          <StyledText weight="bold">{t('prix')}</StyledText>
          <StyledText>{formatCurrency(price)}</StyledText>
        </HStack>

        <HStack
          py={THEME.spacing.HORIZ / 3}
          justifyContent="space-between"
          alignItems="center"
          borderBottomWidth={1}
          borderStyle="dashed"
          borderColor={THEME.colors.BLACK30}
        >
          <StyledText weight="bold">{t('tva')}</StyledText>
          <StyledText>{formatCurrency(0)}</StyledText>
        </HStack>

        <HStack
          py={THEME.spacing.HORIZ / 3}
          justifyContent="space-between"
          alignItems="center"
          borderBottomWidth={1}
          borderStyle="dashed"
          borderColor={THEME.colors.BLACK30}
        >
          <StyledText weight="bold">{t('total')}</StyledText>
          <StyledText>{formatCurrency(price)}</StyledText>
        </HStack>
      </Box>
    </VStack>
  );
}
