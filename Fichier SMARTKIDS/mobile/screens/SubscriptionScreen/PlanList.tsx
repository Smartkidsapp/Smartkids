import React from "react";
import { Box, HStack, Pressable, VStack } from "@gluestack-ui/themed";
import { formatSubscriptionReccurence } from "@/src/features/subscriptions/utils/subscription.util";
import { SubscriptionPlan } from "@/src/types/subscription-plan.types";
import THEME from "@/constants/theme";
import { StyledText } from "@/components/StyledText";
import { formatCurrency } from "@/src/lib";

export interface PlanListProps {
  selectedPlan?: SubscriptionPlan;
  onSelectPlan: (plan: SubscriptionPlan) => void;
  plans: SubscriptionPlan[];
}

export default function PlanList({
  selectedPlan,
  onSelectPlan,
  plans,
}: PlanListProps) {
  return (
    <VStack space="xl">
      {plans.map((plan) => {
        const selected = selectedPlan?.id === plan.id;

        return (
          <Pressable onPress={() => onSelectPlan(plan)} key={plan.id}>
            <HStack
              bg={selected ? THEME.colors.FIFTH : THEME.colors.WHITE}
              elevation={1}
              shadowColor="rgba(0, 0, 0, 0.1)"
              p={THEME.spacing.HORIZ / 2}
              rounded={15}
              borderWidth={0.5}
              borderColor={THEME.colors.BLACK30}
              space="md"
              alignItems="flex-start"
            >
              <Box
                h={24}
                rounded="$full"
                w={24}
                borderWidth={2}
                borderColor={
                  selected ? '$primary' : THEME.colors.BLACK
                }
                bg={selected ? '$primary' : THEME.colors.WHITE}
              />

              <VStack space="sm" flex={1}>
                <StyledText weight="bold" size={THEME.font_sizes.TITLE}>
                  {plan.name}
                </StyledText>
                <StyledText>{plan.description}</StyledText>
                <StyledText weight="semi-bold">
                  {formatCurrency(plan.price)} 
                  {/*/{" "}
                  {formatSubscriptionReccurence(
                    plan.interval_unit,
                    plan.interval_count
                  )}*/}
                </StyledText>
              </VStack>
            </HStack>
          </Pressable>
        );
      })}
    </VStack>
  );
}
