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

export default function SignupStep4({
    next,
}: StepperProps) {
    return (
        <Box paddingHorizontal={25}>
            <Box flex={1} justifyContent="center" alignItems="center" mb={15}>
                <StyledText color={"#1E1E1E"} weight='semi-bold' size={14} style={{ marginBottom: 5, marginTop: 32 }}>Documents justificatifs</StyledText>

                <StyledText color={"#1E1E1E"} center size={12}>
                    Certification nécessaire pour la vente de produits alimentaires ou pour respecter les réglementations locales en matière de restauration et de livraison de repas.
                </StyledText>
            </Box>


            <VStack space="lg" w={"100%"}>

                <VStack gap={10}>
                    <HStack alignItems='center' space='xs'>
                        <Ionicons name='checkmark-circle' color={'#000'} size={20} />
                        <StyledText size={12} weight='semi-bold'>Veillez ajouter vos photos claire</StyledText>
                    </HStack>
                    <HStack alignItems='center' space='xs'>
                        <Ionicons name='checkmark-circle' color={'#000'} size={20} />
                        <StyledText size={12} weight='semi-bold'>Télécharger le fichier JPEG/PNG/PDF</StyledText>
                    </HStack>
                </VStack>

                <Box alignItems='flex-start'>
                    <StyledText color={"#1E1E1E"} weight='semi-bold' size={12} style={{ marginTop: 16 }}>Carte d’identité ou passeport*(Recto et verso)</StyledText>
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
                        gap={10}
                        onPress={() => { }}
                        borderStyle='dashed'
                    >
                        <Image source={require('../assets/images/download.png')} style={{ width: 50, height: 35 }} />
                        <StyledText size={10}>Télécharger le fichier ici</StyledText>
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
