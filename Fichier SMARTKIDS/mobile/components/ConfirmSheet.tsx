import { Button, VStack } from "@gluestack-ui/themed";
import React from "react";
import ActionSheet, {
    SheetManager,
    SheetProps,
} from "react-native-actions-sheet";
import SheetHeader from "./SheetHeader";
import DangerIcon from "@/assets/icons/danger.svg";
import THEME from "../constants/theme";
import { StyledText } from "./StyledText";

export default function ConfirmSheet({
    sheetId,
    payload,
}: SheetProps<"confirm-sheet">) {
    const { description, title } = payload!;

    return (
        <ActionSheet id={sheetId}>
            <SheetHeader sheetId={sheetId} title={title} />

            <VStack space="xl" px={THEME.spacing.HORIZ} pb={THEME.spacing.BOTTOM}>
                <VStack space="md">
                    <VStack space="xs" alignItems="center">
                        <DangerIcon width={THEME.icon.xl} height={THEME.icon.xl} />
                        <StyledText center size={THEME.font_sizes.TITLE} weight="bold">
                            Attention
                        </StyledText>
                    </VStack>

                    <StyledText center color={THEME.colors.BLACK_MUTED}>
                        {description}
                    </StyledText>
                </VStack>

                <Button
                    bgColor="$primary"
                    onPress={() => SheetManager.hide(sheetId, { payload: true })}
                >
                    <StyledText size={14} color={'black'} weight='semi-bold'>Confirmer</StyledText>
                </Button>
            </VStack>
        </ActionSheet>
    );
}
