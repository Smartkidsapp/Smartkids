import { ArrowRightIcon, Box, Button, ChevronLeftIcon, ChevronsLeftIcon, HStack, KeyboardAvoidingView, Pressable, ScrollView, useToast, VStack } from '@gluestack-ui/themed';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useCallback, useRef, useState } from 'react';
import { ActivityIndicator, Image, Keyboard, Platform, StyleSheet, TouchableWithoutFeedback, useWindowDimensions } from 'react-native';
import { StackParamList } from '../navigation';
import { StyledText } from '../components/StyledText';
import ControlledTextInput from '../components/ControlledTextInput';
import { useForm } from 'react-hook-form';
import { Ionicons } from '@expo/vector-icons';
import { useAppSelector } from '../src/store';
import { selectUser } from '../src/features/auth/auth.slice';
import { useUpdateProfileMutation } from '../src/features/users/store/user.apiSlice';
import { UpdateProfileDto, UpdateProfileSchema } from '../src/features/users/store/users.request';
import { zodResolver } from '@hookform/resolvers/zod';
import { handleApiError } from '../src/utils/error.util';
import BaseToast from '../components/BaseToast';
import { useTranslation } from 'react-i18next';

export default function InformationScreen({
    navigation,
}: StackScreenProps<StackParamList, 'edit-info'>) {

    const { t } = useTranslation();

    const user = useAppSelector(selectUser);
    const toast = useToast();
    const [udpateProfile, { isLoading }] = useUpdateProfileMutation();
    const {
        control,
        handleSubmit,
        formState: { isValid },
        setError,
    } = useForm<UpdateProfileDto>({
        resolver: zodResolver(UpdateProfileSchema),
        defaultValues: {
            email: user?.email,
            name: user?.name,
            phone: user?.phone,
        },
    });

    const onSubmit = (data: UpdateProfileDto) => {
        udpateProfile(data).then(res => {
            if ('data' in res && res.data) {
                toast.show({
                    placement: 'top',
                    render: () => (
                        <BaseToast bg="$primary" description={res.data.message} />
                    ),
                });
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
                <ScrollView flex={1} bg="#fff" p={25} pt={50}>
                    <Box flex={1} justifyContent="center" alignItems="center">
                        <VStack space="2xl" w={"100%"} mt={32}>
                            <ControlledTextInput
                                name="name"
                                control={control}
                                required
                                label={t('nom')}
                                placeholder={t('entrez_nom')}
                                textContentType="name"
                            />
                            <ControlledTextInput
                                name="email"
                                control={control}
                                required
                                editable={false}
                                label={t('adresse_email')}
                                placeholder={t('entrez_email')}
                                textContentType="name"
                                autoCapitalize='none'
                            />
                            <ControlledTextInput
                                name="phone"
                                control={control}
                                required
                                label={t('numero_telephone')}
                                placeholder={t('entrer_numero_telephone')}
                                textContentType="telephoneNumber"
                                autoCapitalize='none'
                                keyboardType='phone-pad'
                            />
                        </VStack>
                    </Box>

                    <VStack pb={44} mt={64} justifyContent="center" alignItems='center' width={"100%"}>
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
                                    {t('sauvegarder')}
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