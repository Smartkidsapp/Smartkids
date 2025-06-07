import { Box, Button, HStack, VStack } from '@gluestack-ui/themed';
import React, { ComponentProps } from 'react';
import { StyleSheet } from 'react-native';
import { StyledText } from './StyledText';
import ControlledTextInput from './ControlledTextInput';
import { Ionicons } from '@expo/vector-icons';
import CheckBoxInput from './CheckBoxInput';

interface StepperProps {
    next: () => void;
    control?: any;
    isDelivery: boolean;
    setIsDelivery: (value: boolean) => void;
}

export default function SignupStep0({
    next,
    control,
    isDelivery,
    setIsDelivery
}: StepperProps) {
    return (
        <Box paddingHorizontal={25}>
            <Box flex={1} justifyContent="center" alignItems="center" mb={15}>
                <StyledText color={"#1E1E1E"} weight='semi-bold' size={14} style={{ marginBottom: 5, marginTop: 32 }}>Complétez vos informations</StyledText>

                <StyledText color={"#1E1E1E"} center size={12}>
                    Boostez vos ventes avec Eatiles ! Inscrivez-vous pour des commandes rapides et une meilleure visibilité !
                </StyledText>
            </Box>


            <VStack space="lg" w={"100%"} mt={16}>
                <ControlledTextInput
                    name="nom"
                    control={control}
                    required
                    icon={<Ionicons name='bag' size={24} />}
                    label="Nom de l’entreprise (Raison sociale) *"
                    placeholder="Entrez le nom de votre entreprise"
                    textContentType="name"
                />
                <ControlledTextInput
                    name="siren"
                    control={control}
                    required
                    label="Numéro de votre entreprise (SIREN) *"
                    placeholder="Entrer le numéro de votre entreprise"
                    textContentType="name"
                />
                <ControlledTextInput
                    name="numero"
                    control={control}
                    required
                    label="Numéro de votre registre de commerce (RCS ou RM) *"
                    placeholder="Entrer le numéro de votre entreprise"
                    textContentType="name"
                />
                <ControlledTextInput
                    name="rib"
                    control={control}
                    required
                    label="RIB *"
                    placeholder="Entrez votre RIB"
                    textContentType="name"
                />

                <StyledText size={13} weight='semi-bold' style={{ marginTop: 10 }}>Faites-vous la livraison de vos produit ? *</StyledText>
                <StyledText size={12}>Le lorem ipsum est, en imprimerie, une suite de mots sans signification utilisée à titre provisoire pour calibre</StyledText>
                <Box
                    flexDirection='row'
                    alignItems='center'
                    justifyContent='flex-start'
                    gap={60}
                >
                    <CheckBoxInput label='Non' isChecked={!isDelivery} onChange={(value) => setIsDelivery(!value)} />
                    <CheckBoxInput label='Oui' isChecked={isDelivery} onChange={(value) => setIsDelivery(value)} />
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
