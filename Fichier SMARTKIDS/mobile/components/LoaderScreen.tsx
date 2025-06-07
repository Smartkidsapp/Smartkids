import React from "react";
import { Box, Image, VStack } from "@gluestack-ui/themed";
import { StyledText } from "./StyledText";
import Colors from "@/constants/Colors";

export default function LoaderScreen({
  title = "Veuillez patienter...",
}: {
  title?: string;
}) {
  return (
    <VStack flex={1} justifyContent="center" alignItems="center" space="lg">
      <Image
        source={require("@/assets/icons/loader.gif")}
        style={{ width: 120, height: 120 }}
        alt="Loading..."
      />

      {title && (
        <StyledText
          size={22}
          color={Colors.light.text}
          weight="semi-bold"
        >
          {title}
        </StyledText>
      )}
    </VStack>
  );
}
