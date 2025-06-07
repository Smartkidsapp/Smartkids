import { Box, KeyboardAvoidingView, VStack } from '@gluestack-ui/themed';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { Pressable } from '@gluestack-ui/themed';
import { Ionicons } from '@expo/vector-icons';
import SignupStep0 from '../src/features/auth/SignupForm/SignupStep0';
import SignupStep1 from '../src/features/auth/SignupForm/SignupStep1';
import { SignupProvider } from '../src/context/SignupProvider';
import { Keyboard, Platform, TouchableWithoutFeedback } from 'react-native';
import { ScrollView } from '@gluestack-ui/themed';
import { StackScreenProps } from '@react-navigation/stack';
import { StackParamList } from '../navigation';

export interface StepComponentProps {
    setStep: Dispatch<SetStateAction<0 | 1>>;
}

export default function RegisterScreen({
    navigation,
}: StackScreenProps<StackParamList, 'register'>) {
    const [step, setStep] = useState<0 | 1>(0);
    const stepComponents = {
        0: <SignupStep0 setStep={setStep} />,
        1: <SignupStep1 />,
    };

    return (
        <SignupProvider>
            <KeyboardAvoidingView
                flex={1}
                enabled
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <TouchableWithoutFeedback
                    onPress={Keyboard.dismiss}
                >
                    <ScrollView flex={1} bg="#fff" pt={50}>
                        {step === 0 ? (
                            <Pressable
                                bg="$primary"
                                w={32}
                                h={32}
                                mb={32}
                                mt={21}
                                rounded="$full"
                                justifyContent='center'
                                alignItems='center'
                                ml={25}
                                onPress={() => navigation.goBack()}
                            >
                                <Ionicons name='chevron-back' size={20} color={"#000"} />
                            </Pressable>
                        ) : (
                            <Pressable
                                bg="$primary"
                                w={32}
                                h={32}
                                mb={32}
                                mt={21}
                                rounded="$full"
                                justifyContent='center'
                                alignItems='center'
                                ml={25}
                                onPress={() => setStep(0)}
                            >
                                <Ionicons name='chevron-back' size={20} color={"#000"} />
                            </Pressable>
                        )}

                        {stepComponents[step]}
                    </ScrollView>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SignupProvider>
    );
}
