import { StyleSheet } from "react-native";
import React, { memo, useEffect, useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { set } from "react-hook-form";
import { Box, HStack, VStack } from "@gluestack-ui/themed";
import { StyledText } from "./StyledText";
import SelectInput from "./SelectInput";
import CheckBoxInput from "./CheckBoxInput";
import { useTranslation } from "react-i18next";

export const DAYS_LABELS = [
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
    "Dimanche",
];

export const DAYS_LABELS_EN = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
];

export type WeekDay = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface DailyOpeningHour {
    from: string;
    to: string;
    day: number;
    available: boolean;
}

interface WorkingHourItemProps {
    day: 0 | 1 | 2 | 3 | 4 | 5 | 6;
    value: DailyOpeningHour;
    onChange?: (value: DailyOpeningHour) => void;
}

const TIMES = new Array(48).fill(0).map((_, i) => {
    const hours = Math.floor(i / 2)
        .toString()
        .padStart(2, "0");
    const minutes = i % 2 ? "30" : "00";
    return `${hours}h${minutes.padStart(2, "0")}`;
});

function WorkingHourItem({ day, onChange, value }: WorkingHourItemProps) {

    const { t, i18n } = useTranslation();

    const [currentValue, setCurrentValue] = useState<DailyOpeningHour>(value);

    useEffect(() => {
        if (
            value.day != currentValue.day ||
            value.available != currentValue.available ||
            value.from != currentValue.from ||
            value.to != currentValue.to
        ) {
            setCurrentValue(value);
        }
    }, [value]);

    const onCurrentChange = (value: Partial<DailyOpeningHour>) => {
        setCurrentValue((prev) => {
            return { ...prev, ...value };
        });
    };

    useEffect(() => {
        onChange?.(currentValue);
    }, [currentValue]);

    return (
        <VStack w="100%" mb={8}>
            <StyledText weight="semi-bold" size={12}>
                { i18n.language == 'fr' ? DAYS_LABELS[day] : DAYS_LABELS_EN[day] }
            </StyledText>
            <HStack space='md' alignItems="center" w={"100%"}>
                <Box w={85}>
                    <CheckBoxInput fontSize={12} label={value.available ? t('ouvert') : t('ferme')} isChecked={value.available} onChange={(val) => onCurrentChange({ available: val })} />
                </Box>
                {value.available ? (
                    <HStack w={"75%"} gap={10} justifyContent="center" alignItems="center">
                        <SelectInput
                            label={""}
                            width={"35%"}
                            data={TIMES.map((time) => ({ value: time, name: time }))}
                            value={value.from}
                            handleChangeText={(item: { value: string; name: string; }) => {
                                onCurrentChange({ from: item.value })
                            }}
                        />

                        <StyledText>{t('a')}</StyledText>

                        <SelectInput
                            label={""}
                            width={"35%"}
                            data={TIMES.map((time) => ({ value: time, name: time }))}
                            value={value.to}
                            handleChangeText={(item: { value: string; name: string; }) => {
                                onCurrentChange({ to: item.value })
                            }}
                        />
                    </HStack>
                ) :
                    <HStack h={50} />
                }
            </HStack>
        </VStack>
    );
}

export default memo(WorkingHourItem, (prev, next) => {
    return (
        prev.day === next.day &&
        prev.value.available === next.value.available &&
        prev.value.from === next.value.from &&
        prev.value.to === next.value.to
    );
});
