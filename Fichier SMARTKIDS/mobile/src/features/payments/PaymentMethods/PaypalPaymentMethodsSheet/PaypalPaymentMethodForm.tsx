import { Center, useToast } from "@gluestack-ui/themed";
import React, { useCallback } from "react";
import { ActivityIndicator } from "react-native";
import {
  useLazyListPaypalPaymentMethodsQuery,
  useLazyListStripePaymentMethodsQuery,
} from "../../store/payment.apiSlice";
import WebView, { WebViewMessageEvent } from "react-native-webview";
import appConfig from "@/src/config";
import { SheetManager } from "react-native-actions-sheet";
import useGetAuthCreds from "@/hooks/useGetAuthCreds";
import BaseToast from "@/components/BaseToast";

export default function PaypalPaymentMethodForm() {
  const { accessToken } = useGetAuthCreds();
  const [resetList] = useLazyListPaypalPaymentMethodsQuery();
  const toast = useToast();

  const handleMessage = useCallback(
    (event: WebViewMessageEvent) => {
      const msg = event.nativeEvent.data;
      const {
        message,
        status,
      }: { status: "FAILURE" | "SUCCESS" | "ERROR"; message: string } =
        JSON.parse(msg);

      if (status === "ERROR") {
        console.error({ message });
        return;
      }

      toast.show({
        placement: "top",
        render: () => (
          <BaseToast
            bg={status === "SUCCESS" ? "$primary" : "$danger"}
            description={message}
          />
        ),
      });

      if (status === "SUCCESS") {
        resetList(undefined, false);
        SheetManager.hide("paypal-payment-methods-sheet");
      }
    },
    [toast, resetList]
  );

  return (
    <>
      {accessToken ? (
        <WebView
          javaScriptEnabled
          originWhitelist={["*"]}
          source={{
            uri: appConfig.paymentGatewayURL + `/paypal?token=${accessToken}`,
          }}
          renderLoading={() => (
            <Center flex={1}>
              <ActivityIndicator color="rgba(8, 33, 45, 0.5)" size="large" />
            </Center>
          )}
          useWebView2
          onMessage={handleMessage}
          injectedJavaScriptObject={{
            accessToken,
          }}
        />
      ) : null}
    </>
  );
}
