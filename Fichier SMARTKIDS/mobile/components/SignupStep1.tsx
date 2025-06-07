import { Box, Button, HStack, VStack } from '@gluestack-ui/themed';
import React, { ComponentProps } from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import { StyledText } from './StyledText';
import ControlledTextInput from './ControlledTextInput';
import { Ionicons } from '@expo/vector-icons';
import CheckBoxInput from './CheckBoxInput';

interface StepperProps {
    next: () => void;
    control?: any;
    adresse: string;
    setAdresse: (value: string) => void;
}

export default function SignupStep1({
    next,
    control,
    adresse,
    setAdresse
}: StepperProps) {

    const {height, width} = useWindowDimensions();

    return (
        <Box w={"100%"} flexDirection='column' justifyContent='flex-end' alignItems='flex-end' h={height - 120}>
            <VStack p={25} space="lg" w={"100%"} backgroundColor='$white' borderTopLeftRadius={20} borderTopRightRadius={20}>
                <ControlledTextInput
                    name="adresse"
                    control={control}
                    required
                    icon={<Ionicons name='location' size={24} />}
                    label="Adresse de votre entreprise *"
                    placeholder="Entrer l’adresse de votre entreprise"
                    textContentType="name"
                />

                <VStack space="xl" flex={1} justifyContent="flex-end" pb={34} mt={64} width={"100%"}>

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
