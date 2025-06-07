import { Box, Button, HStack, Image, Pressable, VStack } from '@gluestack-ui/themed';
import React, { ComponentProps } from 'react';
import { StyleSheet } from 'react-native';
import { StyledText } from './StyledText';
import ControlledTextInput from './ControlledTextInput';
import { Ionicons } from '@expo/vector-icons';
import CheckBoxInput from './CheckBoxInput';
import WorkingHourItem, { DAYS_LABELS, WeekDay } from './WorkingHourItem';

interface StepperProps {
    next: () => void;
}

export default function SignupStep3({
    next,
}: StepperProps) {
    return (
        <Box paddingHorizontal={25}>
            <Box flex={1} justifyContent="center" alignItems="center" mb={15}>
                <StyledText color={"#1E1E1E"} weight='semi-bold' size={14} style={{ marginBottom: 5, marginTop: 32 }}>Horaires d'ouverture</StyledText>

                <StyledText color={"#1E1E1E"} center size={12}>
                    Heures d'ouverture pendant lesquelles les commandes sont acceptées et les plats sont disponibles pour la livraison.
                </StyledText>
            </Box>


            <VStack space="lg" w={"100%"}>

                <Box alignItems='flex-start'>
                    {
                        DAYS_LABELS.map((day, key) => {
                            return (
                                <WorkingHourItem
                                    key={key}
                                    day={key as WeekDay}
                                    value={{
                                        from: "09h00",
                                        to: "00h00",
                                        day: key,
                                        available: true
                                    }}
                                    //onChange={onChange}
                                />
                            );
                        })
                    }
                </Box>

                <VStack space="xl" flex={1} justifyContent="flex-end" pb={34} mt={32} width={"100%"}>

                    <Button
                        elevation="$3"
                        shadowColor="rgba(0, 0, 0, 0.5)"
                        rounded="$full"
                        bg="$primary"
                        size="xl"
                        h={50}
                        mb={5}
                        onPress={next}>
                        <StyledText color="#fff" size={14} weight="medium">
                            Suivant
                        </StyledText>
                    </Button>
                </VStack>

            </VStack>
        </Box>
    );
}

const styles = StyleSheet.create({
});
