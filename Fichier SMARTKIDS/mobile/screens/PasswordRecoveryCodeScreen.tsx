import { ArrowRightIcon, Box, Button, ChevronLeftIcon, ChevronsLeftIcon, HStack, KeyboardAvoidingView, Pressable, ScrollView, useToast, VStack } from '@gluestack-ui/themed';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useCallback, useRef, useState } from 'react';
import { ActivityIndicator, Image, ImageBackground, ImageSourcePropType, Keyboard, Platform, StyleSheet, TouchableWithoutFeedback, useWindowDimensions } from 'react-native';
import { StackParamList } from '../navigation';
import { StyledText } from '../components/StyledText';
import Swiper from 'react-native-swiper';
import { View } from 'react-native';
import ControlledTextInput from '../components/ControlledTextInput';
import { useForm } from 'react-hook-form';
import { Ionicons } from '@expo/vector-icons';
import SelectInput from '../components/SelectInput';
import Colors from '../constants/Colors';
import { useVerifyPasswordOTPMutation } from '../src/features/auth/auth.apiSlice';
import { handleApiError } from '../src/utils/error.util';
import ResendOtpBtn from '../src/features/auth/ResendOtpBtn';
import { OTPType } from '../src/types/user.types';
import ConfirmationCodeInput from '../components/ConfirmationCodeInput';
import { maskEmail } from '../src/utils/string.utils';
import { t } from 'i18next';
import { useTranslation } from 'react-i18next';

export default function PasswordRecoveryCodeScreen({
    navigation,
    route
}: StackScreenProps<StackParamList, 'password-recovery'>) {

    const { t } = useTranslation();

    const toast = useToast();
    const [code, setCode] = useState<string | null>(null);
    const [verifyPaswordOtp, { isLoading }] = useVerifyPasswordOTPMutation();

    const onSubmit = () => {
        if (!code || code.length !== 6) {
            return;
        }

        verifyPaswordOtp({
            email: route.params.email,
            otp: code,
            token: route.params.token,
        }).then(res => {
            if ('data' in res && res.data) {
                navigation.replace('password-reset', {
                    email: route.params.email,
                    navigateBackTo: route.params.navigateBackTo,
                    token: res.data.data.access_token,
                });
            }

            if ('error' in res && res.error) {
                handleApiError({
                    error: res.error,
                    toast,
                });
            }
        });
    };


    return (
        <KeyboardAvoidingView
            flex={1}
            enabled
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <TouchableWithoutFeedback
                onPress={Keyboard.dismiss}
            >
                <ScrollView flex={1} bg="#fff" pt={50}>
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
                    <Box flex={1} paddingHorizontal={25} justifyContent="center" alignItems="flex-start">

                        <StyledText color={Colors.light.text} weight='semi-bold' size={26} style={{ marginBottom: 16 }}>{t('verifiez_le_code')}</StyledText>

                        <StyledText size={14}>
                            {t('saisir_le_code')}{' '}{maskEmail(route.params.email)} {t('assurer_securite')}
                        </StyledText>

                        <VStack space="md" w={"100%"} mt={32}>
                            <ConfirmationCodeInput value={code ?? ''} setValue={setCode} />
                        </VStack>
                    </Box>

                    <VStack pb={44} px={25} mt={64} justifyContent="center" alignItems='center' width={"100%"}>
                        <Button
                            elevation="$3"
                            shadowColor="rgba(0, 0, 0, 0.5)"
                            bg="$primary"
                            size="xl"
                            w={'100%'}
                            h={50}
                            mb={32}
                            borderRadius={10}
                            onPress={onSubmit}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="#000" size="small" />
                            ) : (
                                <StyledText size={14} weight="semi-bold">
                                    {t('confirmer')}
                                </StyledText>
                            )}
                        </Button>

                        <ResendOtpBtn
                            disabled={isLoading}
                            type={OTPType.RESET_PASSWORD}
                            email={route.params.email}
                        />
                    </VStack>
                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    image: {
        width: 114,
        height: 64
    },
    imageContainer: {
        backgroundColor: 'rgba(246, 246, 246, 1)',
        borderBottomStartRadius: 30,
        borderBottomEndRadius: 30,
        overflow: 'hidden',
        flex: 1 / 2,
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    },
    roundedBtn: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 50,
        height: 50,
    },
    carouselContainer: {
        flex: 1 / 2,
        flexDirection: 'row',
        position: 'relative',
    },
});