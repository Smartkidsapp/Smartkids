import React, { useEffect } from "react";
import { Image, VStack } from "@gluestack-ui/themed";
import { HStack } from "@gluestack-ui/themed";
import { Pressable } from "@gluestack-ui/themed";
import { PaymentMethodValue } from ".";
import { ActivityIndicator, StyleSheet } from "react-native";
import { PaypalPaymentMethodResponse } from "../store/payment.dto";
import { Center } from "@gluestack-ui/themed";
import { Box } from "@gluestack-ui/themed";
import DeletePaymentMethodBtn from "./DeletePaymentMethodBtn";
import { useLazyListPaypalPaymentMethodsQuery } from "../store/payment.apiSlice";
import { SheetManager } from "react-native-actions-sheet";
import { PaymentMethodTypeEnum } from "@/src/types/payment-methods.types";
import { StyledText } from "@/components/StyledText";
import THEME from "@/constants/theme";
import PaypalIcon from "@/assets/icons/paypal.svg";
import PaypalIcon1 from "@/assets/icons/paypal-1.svg";
import PlusIcon from "@/assets/icons/plus.svg";

export default function PaypalPaymentMethods({
  onMethodSelected,
  selectedMethod,
  mode,
}: {
  onMethodSelected?: (method: PaymentMethodValue) => void;
  mode?: "select" | "preview";
  selectedMethod?: string;
}) {
  const [list, { data, isFetching, error }] =
    useLazyListPaypalPaymentMethodsQuery();

  useEffect(() => {
    const id = setTimeout(() => {
      list();
    }, 300);

    return () => {
      clearTimeout(id);
    };
  }, [list]);

  return (
    <VStack space="md">
      <HStack space="sm" alignItems="center">
        <PaypalIcon height={24} width={24} />
        <StyledText weight="semi-bold" size={THEME.font_sizes.TITLE}>
          Comptes Paypal
        </StyledText>

        {data?.data && data?.data?.length === 2 ? null : (
          <HStack flex={1} justifyContent="flex-end">
            <Pressable
              onPress={() => SheetManager.show("paypal-payment-methods-sheet")}
            >
              <PlusIcon height={25} width={25} />
            </Pressable>
          </HStack>
        )}
      </HStack>

      <Box bg={THEME.colors.PRIMARY15} px="$4" rounded="$md">
        {!isFetching && data?.data?.length === 0 ? (
          <Center p="$4">
            <StyledText weight="semi-bold" color={THEME.colors.BLACK30} center>
              Vous n'avez enregistré aucun compte.
            </StyledText>
          </Center>
        ) : null}

        {!data?.data?.length && isFetching ? (
          <Center p="$4">
            <ActivityIndicator size="small" color={THEME.colors.PRIMARY} />
          </Center>
        ) : null}

        {(data?.data as PaypalPaymentMethodResponse[])?.map((method, idx) => (
          <Pressable
            key={method.id}
            onPress={() => {
              onMethodSelected?.({
                label: method.email,
                type: PaymentMethodTypeEnum.PAYPAL,
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
                <PaypalIcon1 height={15} width={15} />
              </HStack>
              <StyledText
                style={styles.text}
                color="rgba(8, 33, 45, 0.5)"
                weight="semi-bold"
              >
                {method.email}
              </StyledText>

              <DeletePaymentMethodBtn id={method.id} type={"paypal"} />
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
