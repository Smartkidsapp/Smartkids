import React from "react";
import PaypalPaymentMethodForm from "./PaypalPaymentMethodForm";
import { SheetProps } from "react-native-actions-sheet";
import ActionSheet from "react-native-actions-sheet";
import SheetHeader from "@/components/SheetHeader";
import { VStack } from "@gluestack-ui/themed";
import { Dimensions } from "react-native";
import THEME from "@/constants/theme";

export default function PaypalPaymentMethodsSheet({
  sheetId,
}: SheetProps<"paypal-payment-methods-sheet">) {
  return (
    <ActionSheet id={sheetId} gestureEnabled>
      <SheetHeader title="Ajouter un compte paypal" sheetId={sheetId} />
      <VStack
        pb={THEME.spacing.BOTTOM}
        pt={THEME.spacing.HORIZ}
        space="lg"
        h={Dimensions.get("window").height * 0.8}
      >
        <PaypalPaymentMethodForm />
      </VStack>
    </ActionSheet>
  );
}
