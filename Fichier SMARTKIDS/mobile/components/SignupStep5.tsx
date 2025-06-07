import { Box, Button, HStack, Image, Pressable, VStack } from '@gluestack-ui/themed';
import React, { ComponentProps } from 'react';
import { StyleSheet } from 'react-native';
import { StyledText } from './StyledText';
import ControlledTextInput from './ControlledTextInput';
import { Ionicons } from '@expo/vector-icons';
import CheckBoxInput from './CheckBoxInput';
import { Category } from '../screens/SignupStepScreen';

interface StepperProps {
    next: () => void;
    categories: Category[],
    selectedCategories: Category[],
    toogleCategory: (cat: Category) => void
}

export default function SignupStep5({
    next,
    categories,
    selectedCategories,
    toogleCategory
}: StepperProps) {
    return (
        <Box paddingHorizontal={25}>
            <Box flex={1} justifyContent="center" alignItems="center" mb={15}>
                <StyledText color={"#1E1E1E"} weight='semi-bold' size={14} style={{ marginBottom: 5, marginTop: 32 }}>Catégorie de votre établissement</StyledText>

                <StyledText color={"#1E1E1E"} center size={12}>
                    Le lorem ipsum est, en imprimerie, une suite de mots sans signification utilisée à titre provisoire pour calibrer une mise e
                </StyledText>
            </Box>
            <VStack space="lg" w={"100%"}>
                <HStack gap={10} flexWrap='wrap'>
                    {
                        categories.map((category, key) => (
                            <Pressable onPress={() => toogleCategory(category)} key={key} mt={5} alignItems='center' justifyContent='center' bg={selectedCategories.some((cat) => cat.id === category.id) ? '$primary' : 'white' } py={8} px={10} borderRadius={30}>
                                <StyledText size={12} weight='semi-bold' color={selectedCategories.some((cat) => cat.id === category.id) ? 'white' : 'black' }>{category.name}</StyledText>
                            </Pressable>
                        ))
                    }
                </HStack>

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
