import React from "react";
import StripePaymentMethods from "./StripePaymentMethods";
import PaypalPaymentMethods from "./PaypalPaymentMethods";
import { VStack } from "@gluestack-ui/themed";
import { PaymentMethodTypeEnum } from "@/src/types/payment-methods.types";
import { StyledText } from "@/components/StyledText";
import THEME from "@/constants/theme";
import { useTranslation } from "react-i18next";

export interface PaymentMethodValue {
  type: PaymentMethodTypeEnum;
  value: string; // method id,
  label: string; // last4 or email.
}

export default function PaymentMethods({
  mode,
  onMethodSelected,
  selectedMethod,
  showPaypalMethods = true,
}: {
  onMethodSelected?: (method: PaymentMethodValue) => void;
  selectedMethod?: string;
  mode?: "select" | "preview";
  showPaypalMethods?: boolean;
}) {

  const { t } = useTranslation();

  return (
    <>
      <VStack space="xs" mb="$4">
        <StyledText size={THEME.font_sizes.TITLE} weight="bold" color="#000">
          {t('methodes_de_paiement')}
        </StyledText>
        <StyledText>
          {t('methodes_de_paiement_text')}
        </StyledText>
      </VStack>

      <VStack space="xl">
        <StripePaymentMethods
          selectedMethod={selectedMethod}
          onMethodSelected={onMethodSelected}
          mode={mode}
        />

        {showPaypalMethods && (
          <PaypalPaymentMethods
            selectedMethod={selectedMethod}
            onMethodSelected={onMethodSelected}
            mode={mode}
          />
        )}
      </VStack>
    </>
  );
}
