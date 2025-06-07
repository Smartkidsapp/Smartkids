import React from "react";
import { Center, Image } from "@gluestack-ui/themed";
import { Pressable } from "@gluestack-ui/themed";
import { HStack } from "@gluestack-ui/themed";
import { SheetManager } from "react-native-actions-sheet";
import THEME from "../constants/theme";
import { StyledText } from "./StyledText";

export default function SheetHeader({
  sheetId,
  title,
}: {
  sheetId: string;
  title: string;
}) {
  return (
    <HStack
      h={32}
      mt={THEME.spacing.HORIZ / 2}
      justifyContent="center"
      alignItems="center"
      px={THEME.spacing.HORIZ}
    >
      <Pressable onPress={() => SheetManager.hide(sheetId)} zIndex={900}>
        <Image source={require('@/assets/icons/close.svg')} resizeMode="contain" height={24} width={24} />
      </Pressable>

      <Center flex={1}>
        {title ? (
          <StyledText size={THEME.font_sizes.TITLE} weight="bold">
            {title}
          </StyledText>
        ) : null}
      </Center>
    </HStack>
  );
}
