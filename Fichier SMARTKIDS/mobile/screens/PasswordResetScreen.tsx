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
import { useToast } from '@gluestack-ui/themed';
import { useResetPasswordMutation } from '../src/features/auth/auth.apiSlice';
import BaseToast from '../components/BaseToast';
import { handleApiError } from '../src/utils/error.util';
import { t } from 'i18next';
import { useTranslation } from 'react-i18next';

type FormData = {
    password: string;
    passwordConfirmation: string;
};

export default function PasswordResetScreen({
    navigation,
    route,
}: StackScreenProps<StackParamList, 'password-reset'>) {

    const { t } = useTranslation();

    const toast = useToast();
    const { email, navigateBackTo, token } = route.params;

    const [resetPassword, { isLoading }] = useResetPasswordMutation();

    const {
        control,
        handleSubmit,
        formState: { isValid },
    } = useForm<FormData>();

    const onSubmit = (data: FormData) => {
        if (data.password !== data.passwordConfirmation) {
            toast.show({
                placement: 'top',
                render: () => (
                    <BaseToast
                        bg="$danger"
                        description={t('mots_de_passe_ne_correspondent_pas')}
                    />
                ),
            });

            return;
        }

        resetPassword({
            email: email,
            password: data.password,
            token,
        }).then(res => {
            if (res && 'data' in res) {
                toast.show({
                    placement: 'top',
                    render: () => (
                        <BaseToast
                            bg="$primary"
                            description={
                                res.data?.message ??
                                t('mot_de_passe_mis_a_jour')
                            }
                        />
                    ),
                });

                // @ts-ignore
                const navigateToOnSuccess = navigateBackTo ?? 'login';
                navigation.replace(navigateToOnSuccess);
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

                        <StyledText color={Colors.light.text} weight='semi-bold' size={26} style={{ marginBottom: 16 }}>{t('passe_oublier')}</StyledText>

                        <StyledText size={14}>
                            {t('creez_un_nouveau_mot_de_passe')}
                        </StyledText>


                        <VStack space="md" w={"100%"} mt={32}>
                            <ControlledTextInput
                                name="password"
                                control={control}
                                label={t('nouveau_mot_de_passe')}
                                secureTextEntry
                                textContentType="password"
                                placeholder={t('entrez_password')}
                                required
                                includeFontPadding={false}
                            />
                            <ControlledTextInput
                                name="passwordConfirmation"
                                control={control}
                                label={t('confirmer_votre_mot_de_passe')}
                                secureTextEntry
                                textContentType="password"
                                placeholder={t('entrez_password')}
                                required
                                includeFontPadding={false}
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
                                    {t('confirmer')}
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