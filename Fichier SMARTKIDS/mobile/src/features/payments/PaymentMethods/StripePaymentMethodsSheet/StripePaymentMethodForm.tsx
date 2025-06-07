import { Center, VStack, useToast } from "@gluestack-ui/themed";
import React, { useCallback } from "react";
import { ActivityIndicator, StyleSheet } from "react-native";
import { WebView, WebViewMessageEvent } from "react-native-webview";
import { useLazyListStripePaymentMethodsQuery } from "../../store/payment.apiSlice";
import appConfig from "@/src/config";
import { SheetManager } from "react-native-actions-sheet";
import BaseToast from "@/components/BaseToast";
import THEME from "@/constants/theme";
import useGetAuthCreds from "@/hooks/useGetAuthCreds";

export default function StripePaymentMethodForm() {
  const { accessToken } = useGetAuthCreds();
  const [resetList] = useLazyListStripePaymentMethodsQuery();
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
        SheetManager.hide("stripe-payment-methods-sheet");
      }
    },
    [toast, resetList]
  );
  console.log(appConfig.paypmentGateWayUrl + `/stripe?token=${accessToken}`)
  return (
    <VStack style={styles.contentContainer} space="xl" pt="$4" w="$full">
      {/* <StyledText
        weight="bold"
        style={styles.title}
        size={THEME.font_sizes.TITLE_LG}
      >
        Compte bancaire
      </StyledText> */}

      {accessToken ? (
        <WebView
          javaScriptEnabled
          scrollEnabled
          originWhitelist={["*"]}
          domStorageEnabled
          textInteractionEnabled
          allowFileAccess={true}
          allowUniversalAccessFromFileURLs={true}
          allowFileAccessFromFileURLs={true}
          setJavaScriptEnabled={true}
          mixedContentMode="always"
          source={{
            uri: appConfig.paypmentGateWayUrl + `/stripe?token=${accessToken}`,
          }}
          onMessage={handleMessage}
          renderLoading={() => (
            <Center flex={1}>
              <ActivityIndicator color={THEME.colors.PRIMARY} size="large" />
            </Center>
          )}
        />
      ) : null}
    </VStack>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    width: "100%",
  },
  title: {
    paddingHorizontal: 24,
  },
});
