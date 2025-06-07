import { ArrowRightIcon, Box, Button, ChevronLeftIcon, ChevronsLeftIcon, HStack, KeyboardAvoidingView, Pressable, ScrollView, VStack } from '@gluestack-ui/themed';
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
import { RequestOTPDto } from '../src/features/auth/auth.request';
import { useRequestOTPMutation } from '../src/features/auth/auth.apiSlice';
import { useToast } from '@gluestack-ui/themed';
import { OTPType } from '../src/types/user.types';
import { handleApiError } from '../src/utils/error.util';
import { useTranslation } from 'react-i18next';

export default function PasswordForgottenScreen({
    navigation,
    route
}: StackScreenProps<StackParamList, 'forgetten-password'>) {

    const { t } = useTranslation();

    const {
        control,
        reset,
        handleSubmit,
        formState: { isValid },
    } = useForm<RequestOTPDto>();
    const [requestPasswordOTP, { isLoading }] = useRequestOTPMutation();

    const toast = useToast();

    const onSubmit = (data: RequestOTPDto) => {
        requestPasswordOTP({
            email: data.email,
            type: OTPType.RESET_PASSWORD,
        }).then(res => {
            if (res && 'data' in res) {
                reset();
                navigation.replace('password-recovery', {
                    email: data.email,
                    token: res.data?.data!.access_token!,
                    navigateBackTo: route.params?.navigateBackTo,
                });
            }

            if ('error' in res) {
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

                        <StyledText color={Colors.light.text} weight='semi-bold' size={26} style={{ marginBottom: 16 }}>{t('confirmer_votre_compte')}</StyledText>

                        <StyledText size={14}>
                            {t('adresse_email_associee')}
                        </StyledText>


                        <VStack space="md" w={"100%"} mt={32}>
                            <ControlledTextInput
                                name="email"
                                control={control}
                                keyboardType="email-address"
                                required
                                label={t('adresse_email')}
                                placeholder={t('entrez_email')}
                                textContentType="name"
                                autoCapitalize='none'
                            />
                        </VStack>
                    </Box>

                    <VStack pb={44} px={25} mt={32} justifyContent="center" alignItems='center' width={"100%"}>
                        <Button
                            elevation="$3"
                            shadowColor="rgba(0, 0, 0, 0.5)"
                            bg="$primary"
                            size="xl"
                            w={'100%'}
                            h={50}
                            mb={32}
                            borderRadius={10}
                            onPress={handleSubmit(onSubmit)}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="#000" size="small" />
                            ) : (
                                <StyledText size={14} weight="semi-bold">
                                    {t('envoyer')}
                                </StyledText>
                            )}
                        </Button>
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