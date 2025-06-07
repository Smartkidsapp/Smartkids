import { Box, Button, HStack, Image, Pressable, VStack } from '@gluestack-ui/themed';
import React, { ComponentProps } from 'react';
import { StyleSheet } from 'react-native';
import { StyledText } from './StyledText';
import ControlledTextInput from './ControlledTextInput';
import { Ionicons } from '@expo/vector-icons';
import CheckBoxInput from './CheckBoxInput';

interface StepperProps {
    next: () => void;
}

export default function SignupStep2({
    next,
}: StepperProps) {
    return (
        <Box paddingHorizontal={25}>
            <Box flex={1} justifyContent="center" alignItems="center" mb={15}>
                <StyledText color={"#1E1E1E"} weight='semi-bold' size={14} style={{ marginBottom: 5, marginTop: 32 }}>Complétez vos informations</StyledText>

                <StyledText color={"#1E1E1E"} center size={12}>
                    Boostez vos ventes avec Eatiles ! Inscrivez-vous pour des commandes rapides et une meilleure visibilité !
                </StyledText>
            </Box>


            <VStack space="lg" w={"100%"}>

                <Box alignItems='center'>
                    <StyledText color={"#1E1E1E"} weight='semi-bold' size={12} style={{ marginBottom: 5, marginTop: 16 }}>Ajouter le logo de votre entreprise *</StyledText>
                    <Pressable
                        w={100}
                        h={100}
                        borderRadius={100}
                        borderColor='$light400'
                        borderWidth={0.5}
                        mt={16}
                        flexDirection='column'
                        alignItems='center'
                        justifyContent='center'
                        gap={5}
                        onPress={() => { }}
                        borderStyle='dashed'
                    >
                        <Image source={require('../assets/images/download.png')} style={{ width: 35, height: 25 }} />
                        <StyledText size={8}>Veillez cliquez ici</StyledText>
                    </Pressable>
                </Box>

                <Box alignItems='flex-start'>
                    <StyledText color={"#1E1E1E"} weight='semi-bold' size={12} style={{ marginBottom: 5, marginTop: 16 }}>Ajouter l’image de couverture de votre entreprise *</StyledText>
                    <Pressable
                        w={"100%"}
                        h={150}
                        borderRadius={10}
                        borderColor='$light400'
                        borderWidth={0.5}
                        mt={16}
                        flexDirection='column'
                        alignItems='center'
                        justifyContent='center'
                        gap={5}
                        onPress={() => { }}
                        borderStyle='dashed'
                    >
                        <Image source={require('../assets/images/download.png')} style={{ width: 50, height: 35 }} />
                        <StyledText size={10}>Veillez cliquez ici</StyledText>
                    </Pressable>
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
