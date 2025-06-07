import React from "react";
import StripePaymentMethodForm from "./StripePaymentMethodForm";
import { SheetProps } from "react-native-actions-sheet";
import ActionSheet from "react-native-actions-sheet";
import SheetHeader from "@/components/SheetHeader";
import { VStack } from "@gluestack-ui/themed";
import THEME from "@/constants/theme";

export default function StripePaymentMethodsSheet({
  sheetId,
}: SheetProps<"stripe-payment-methods-sheet">) {
  return (
    <ActionSheet id={sheetId} gestureEnabled>
      <SheetHeader title="Ajouter une carte de crédit" sheetId={sheetId} />
      <VStack
        pb={THEME.spacing.BOTTOM}
        pt={THEME.spacing.HORIZ}
        space="lg"
        minHeight={500}
      >
        <StripePaymentMethodForm />
      </VStack>
    </ActionSheet>
  );
}
