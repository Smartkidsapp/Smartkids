import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  HStack,
  ScrollView,
  useToast,
  VStack,
} from "@gluestack-ui/themed";
import { Pressable } from "@gluestack-ui/themed";
import { StackScreenProps } from "@react-navigation/stack";
import { ActivityIndicator, StyleSheet } from "react-native";
import {
  useGetSubscriptionStatusQuery,
  useListPlansQuery,
  usePaySubscriptionMutation,
} from "@/src/features/subscriptions/store/subscription.apiSlice";
import PlanList from "./PlanList";
import SubscriptionPriceBreakdown from "./SubscriptionPriceBreakdown";
import SubscriptionStatus from "./SubscriptionStatus";
import Stripe from "stripe";
import { PayPalSubscription } from "@/src/features/subscriptions/store/subscription.request";
import { handleApiError } from "@/src/utils/error.util";
import { StackParamList } from "@/navigation";
import LoaderScreen from "@/components/LoaderScreen";
import { SubscriptionPlan } from "@/src/types/subscription-plan.types";
import { Subscription } from "@/src/types/subscription.types";
import BaseToast from "@/components/BaseToast";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import THEME from "@/constants/theme";
import { StyledText } from "@/components/StyledText";
import PaymentMethods, { PaymentMethodValue } from "@/src/features/payments/PaymentMethods";
import CancelSubscriptionBtn from "./CancelSubscriptionBtn";
import { useTranslation } from "react-i18next";

export default function SubscriptionScreen(
  props: StackScreenProps<StackParamList, "subscription">
) {
  const { data, isLoading } = useGetSubscriptionStatusQuery(undefined, {
    refetchOnFocus: true,
  });

  if (isLoading) {
    return <LoaderScreen />;
  }

  return <Screen {...props} subscriptionData={data?.data} />;
}

function Screen({
  navigation,
  subscriptionData,
}: StackScreenProps<StackParamList, "subscription"> & {
  subscriptionData?: {
    subscription: Subscription;
    providerSubscription?: Stripe.Subscription | PayPalSubscription;
  };
}) {

  const { t } = useTranslation();

  const { data } = useListPlansQuery();
  const plans = data?.data ?? [];
  const currentPlanId =
    typeof subscriptionData?.subscription?.plan === "string"
      ? subscriptionData?.subscription?.plan
      : subscriptionData?.subscription?.plan?.id;

  const [selectedPlan, setSelectedPlan] = useState<
    SubscriptionPlan | undefined
  >(() => {
    if (currentPlanId) {
      const plan = plans.find((plan) => plan.id === currentPlanId);
      return plan;
    }
  });

  const [paymentMethod, setPaymentMethod] = useState<
    PaymentMethodValue | undefined
  >();

  const [request, { isLoading }] = usePaySubscriptionMutation();
  const planChanged = !currentPlanId || selectedPlan?.id !== currentPlanId;
  const toast = useToast();

  const subscribe = () => {
    if (!selectedPlan || !paymentMethod) {
      return;
    }

    request({
      paymentMethod: paymentMethod?.value,
      paymentMethodType: paymentMethod?.type,
      planId: selectedPlan?.id,
      changePlan: planChanged,
      subscriptionId: subscriptionData?.subscription?.id,
    }).then((res) => {
      if ("data" in res && res.data) {
        toast.show({
          placement: "top",
          render: () => (
            <BaseToast
              bg={THEME.colors.SUCCESS}
              description={res.data.message}
            />
          ),
        });

        navigation.replace('tab-navigator');
      }

      if ("error" in res) {
        handleApiError({
          error: res.error,
          toast,
        });
      }
    });
  };

  useEffect(() => {
    if (plans.length > 0 && !currentPlanId) {
      setSelectedPlan(plans[0]);
    }
  }, [plans, currentPlanId]);

  return (
    <VStack
      space="xl"
      bg="$white"
      flex={1}
    >
      <Box flex={1}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollViewContent}
          pt={44}
        >
          <VStack space="xl">
            <VStack space="xs">
              <StyledText size={20} weight="bold">
                {t('abonnement')}
              </StyledText>
              <StyledText>
                {t('abonnez_vous')}
              </StyledText>
            </VStack>

            <SubscriptionStatus data={subscriptionData} />

            <PlanList
              onSelectPlan={(plan) => {
                setSelectedPlan(plan);
              }}
              plans={plans}
              selectedPlan={selectedPlan}
            />

            <PaymentMethods
              mode="select"
              onMethodSelected={(method) => {
                setPaymentMethod(method);
              }}
              showPaypalMethods={false}
              selectedMethod={paymentMethod?.value}
            />

            {!!selectedPlan && (
              <SubscriptionPriceBreakdown plan={selectedPlan} />
            )}

            <Button
              elevation="$3"
              shadowColor="rgba(0, 0, 0, 0.5)"
              bg={!planChanged || !selectedPlan || !paymentMethod || isLoading ? '$light200' : '$primary'}
              size="xl"
              w={'100%'}
              h={50}
              mb={32}
              borderRadius={10}
              disabled={
                !planChanged || !selectedPlan || !paymentMethod || isLoading
              }
              onPress={subscribe}
            >
              {
                isLoading ?
                <ActivityIndicator size="small" color={"#000"} />
                :
                <StyledText size={14} weight='semi-bold' color={!planChanged || !selectedPlan || !paymentMethod || isLoading ? Colors.light.gray : '#000'}>{planChanged ? t('changer_de_plan') : t('s_abonner')}</StyledText>
              }
            </Button>
            {subscriptionData?.providerSubscription &&
              isCancelable(
                subscriptionData.providerSubscription as Stripe.Subscription
              ) && (
                <CancelSubscriptionBtn id={subscriptionData.subscription.id} />
              )}
          </VStack>
          <Box height={88} />
        </ScrollView>
      </Box>
    </VStack>
  );
}

function isCancelable(subscription: Stripe.Subscription) {
  return (
    ["active", "trialing"].includes(subscription.status) &&
    !subscription.cancel_at_period_end
  );
}

const styles = StyleSheet.create({
  scrollViewContent: {
    paddingHorizontal: THEME.spacing.HORIZ,
    paddingBottom: THEME.spacing.BOTTOM,
  },
});
