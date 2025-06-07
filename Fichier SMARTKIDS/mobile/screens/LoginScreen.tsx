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
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@gluestack-ui/themed';
import { SigninRequest, SigninSchema } from '../src/features/auth/auth.request';
import { useSigninMutation } from '../src/features/auth/auth.apiSlice';
import { handleApiError } from '../src/utils/error.util';
import BaseToast from '../components/BaseToast';
import { SuccessResponseEnum } from '../src/store/apiSlice';
import KeyboardAwareAnimatedFooter from '../components/KeyboardAwareAnimatedFooter';
import { useTranslation } from 'react-i18next';

export default function LoginScreen({
    navigation,
}: StackScreenProps<StackParamList, 'login'>) {

    const { t } = useTranslation();

    const toast = useToast();
    const [signin, { isLoading }] = useSigninMutation();
    const {
        control,
        reset,
        handleSubmit,
        setError,
        formState: { isValid },
    } = useForm<SigninRequest>({
        resolver: zodResolver(SigninSchema),
    });

    const onSubmit = (data: SigninRequest) => {
        signin({ ...data, rememberMe: true }).then(res => {
            if ('data' in res && res.data) {
                if (
                    res.data.status === SuccessResponseEnum.EMAIL_VERIFICATION_PENDING
                ) {
                    toast.show({
                        duration: 10000,
                        placement: 'top',
                        render: () => (
                            <BaseToast bg="$danger" description={res.data.message!} />
                        ),
                    });
                    navigation.reset({
                        routes: [
                            {
                                name: 'verify-email',
                                params: {
                                    email: data.email,
                                    token: res.data.data!.access_token!,
                                },
                            },
                        ],
                    });
                } else {
                    navigation.reset({
                        routes: [
                            {
                                name: 'tab-navigator'
                            },
                        ],
                    });
                }

                return;
            }

            if ('error' in res && res.error) {
                handleApiError({
                    error: res.error,
                    toast,
                    setFormError: setError,
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

                        <StyledText color={Colors.light.text} weight='semi-bold' size={26} style={{ marginBottom: 16 }}>{t('connectez_vous')}</StyledText>

                        <StyledText size={14}>
                            {t('informations_de_connexion')}
                        </StyledText>


                        <VStack space="md" w={"100%"} mt={32}>
                            <ControlledTextInput
                                name="email"
                                control={control}
                                required
                                label={t('adresse_email')}
                                placeholder={t('entrez_email')}
                                textContentType="name"
                                autoCapitalize='none'
                            />
                            <ControlledTextInput
                                name="password"
                                control={control}
                                label={t('mot_de_passe')}
                                secureTextEntry
                                textContentType="password"
                                placeholder={t('entrez_password')}
                                required
                                includeFontPadding={false}
                            />
                        </VStack>

                        <Pressable onPress={() => navigation.navigate('forgetten-password')} mt={32} alignSelf='flex-end'>
                            <StyledText color={Colors.light.textPrimary} weight='semi-bold' size={14}>{t('mot_de_passe_oublie')}</StyledText>
                        </Pressable>
                    </Box>

                    <KeyboardAwareAnimatedFooter>
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
                                        {t('se_connecter')}
                                    </StyledText>
                                )}
                            </Button>

                            <HStack
                                justifyContent='center'
                            >
                                <StyledText size={14} weight='semi-bold'>{t('not_register')}{' '}</StyledText>
                                <Pressable onPress={() => navigation.navigate('register')}>
                                    <StyledText weight='semi-bold' color={Colors.light.textPrimary} size={14}>
                                        {t('inscrivez_vous_ici')}
                                    </StyledText>
                                </Pressable>
                            </HStack>

                            <HStack
                                justifyContent='center'
                                mt={32}
                            >
                                <Pressable
                                    onPress={() => {
                                        navigation.reset({
                                            routes: [
                                                {
                                                    name: 'tab-navigator'
                                                },
                                            ],
                                        });
                                    }}
                                    flexDirection='row'
                                    alignItems='center'
                                    justifyContent='center'
                                    gap={4}
                                >
                                    <StyledText weight='semi-bold' color={Colors.light.textPrimary} size={16}>
                                        {t('continue_without_login')}
                                    </StyledText>
                                    <Ionicons name='chevron-forward' size={16} color={Colors.light.textPrimary} style={{ marginTop: 2 }} />
                                </Pressable>
                            </HStack>
                        </VStack>
                    </KeyboardAwareAnimatedFooter>
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