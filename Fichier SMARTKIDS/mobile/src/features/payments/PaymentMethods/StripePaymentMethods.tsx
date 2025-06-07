import React, { useEffect } from "react";
import { Center, Image, Pressable, VStack } from "@gluestack-ui/themed";
import { HStack } from "@gluestack-ui/themed";
import { StyleSheet } from "react-native";
import { ActivityIndicator } from "react-native";
import { Box } from "@gluestack-ui/themed";
import { SheetManager } from "react-native-actions-sheet";
import { PaymentMethodValue } from ".";
import { useLazyListStripePaymentMethodsQuery } from "../store/payment.apiSlice";
import { StripePaymentMethodResponse } from "../store/payment.dto";
import PaymentMethodBrand from "./PaymentMethodBrand";
import DeletePaymentMethodBtn from "./DeletePaymentMethodBtn";
import { PaymentMethodTypeEnum } from "@/src/types/payment-methods.types";
import { StyledText } from "@/components/StyledText";
import THEME from "@/constants/theme";
import CreditCardIcon from "@/assets/icons/credit-card.svg";
import PlusIcon from "@/assets/icons/plus.svg";
import { useTranslation } from "react-i18next";

export default function StripePaymentMethods({
  onMethodSelected,
  mode = "preview",
  selectedMethod,
}: {
  onMethodSelected?: (method: PaymentMethodValue) => void;
  mode?: "select" | "preview";
  selectedMethod?: string;
}) {

  const { t } = useTranslation();

  const [list, { data, isFetching }] = useLazyListStripePaymentMethodsQuery();
  useEffect(() => {
    const id = setTimeout(() => {
      list();
    }, 300);

    return () => {
      clearTimeout(id);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <VStack space="md">
      <HStack space="sm" alignItems="center">
        <CreditCardIcon height={24} width={24} />
        <StyledText weight="semi-bold" size={THEME.font_sizes.TITLE}>
          {t('cartes_de_credit')}
        </StyledText>

        {data?.data && data?.data.length === 2 ? null : (
          <HStack flex={1} justifyContent="flex-end">
            <Pressable
              onPress={() => SheetManager.show("stripe-payment-methods-sheet")}
            >
              <PlusIcon height={25} width={25} />
            </Pressable>
          </HStack>
        )}
      </HStack>

      <Box bg={THEME.colors.PRIMARY15} px="$4" rounded="$md">
        {!isFetching && data?.data?.length === 0 ? (
          <Center p="$4">
            <StyledText center weight="semi-bold" color={THEME.colors.BLACK30}>
              {t('aucune_carte')}
            </StyledText>
          </Center>
        ) : null}

        {!data?.data?.length && isFetching ? (
          <Center p="$4">
            <ActivityIndicator size="small" color={THEME.colors.PRIMARY} />
          </Center>
        ) : null}

        {(data?.data as StripePaymentMethodResponse[])?.map((method, idx) => (
          <Pressable
            key={method.id}
            onPress={() => {
              onMethodSelected?.({
                label: `**** ${method.last_four}`,
                type: PaymentMethodTypeEnum.STRIPE,
                value: method.id,
              });
            }}
          >
            <HStack
              alignItems="center"
              space="sm"
              borderBottomWidth={idx < data!.data.length - 1 ? 1 : 0}
              borderStyle="dashed"
              borderColor="rgba(8, 33, 45, 0.3)"
              py="$4"
            >
              <HStack space="md" alignItems="center">
                {mode === "select" && method.id === selectedMethod && (
                  <Box
                    bg={THEME.colors.PRIMARY}
                    h={15}
                    w={15}
                    rounded="$full"
                  />
                )}

                {mode === "select" && method.id !== selectedMethod && (
                  <Box
                    borderColor={THEME.colors.PRIMARY}
                    borderWidth={2}
                    h={15}
                    w={15}
                    rounded="$full"
                  />
                )}
                <PaymentMethodBrand brand={method.brand} />
              </HStack>
              <StyledText
                style={styles.text}
                color="rgba(8, 33, 45, 0.5)"
                weight="semi-bold"
              >
                **** {method.last_four}
              </StyledText>

              <DeletePaymentMethodBtn id={method.id} type={"stripe"} />
            </HStack>
          </Pressable>
        ))}
      </Box>
    </VStack>
  );
}

const styles = StyleSheet.create({
  text: {
    flex: 1,
  },
});
