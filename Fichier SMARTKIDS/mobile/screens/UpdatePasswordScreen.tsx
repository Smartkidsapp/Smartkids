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
import { useUpdatePasswordMutation, useUpdateProfileMutation } from '../src/features/users/store/user.apiSlice';
import { UpdatePasswordDto, UpdatePasswordSchema, UpdateProfileDto, UpdateProfileSchema } from '../src/features/users/store/users.request';
import { zodResolver } from '@hookform/resolvers/zod';
import { handleApiError } from '../src/utils/error.util';
import BaseToast from '../components/BaseToast';
import { useTranslation } from 'react-i18next';

export default function UpdatePasswordScreen({
    navigation,
}: StackScreenProps<StackParamList, 'update-password'>) {

  const { t } = useTranslation();

    const toast = useToast();

    const [udpatePassword, { isLoading }] = useUpdatePasswordMutation();
  
    const {
      control,
      handleSubmit,
      reset,
      formState: { isValid },
    } = useForm<UpdatePasswordDto>({
      resolver: zodResolver(UpdatePasswordSchema),
    });
  
    const onSubmit = (data: UpdatePasswordDto) => {
      udpatePassword(data).then(res => {
        if ('data' in res) {
          toast.show({
            placement: 'top',
            render: () => (
              <BaseToast
                bg="$primary"
                description={res.data?.message ?? t('mot_de_passe_mis_a_jour')}
              />
            ),
          });
          reset();
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
                <ScrollView flex={1} bg="#fff" p={25} pt={50}>
                    <Box flex={1} justifyContent="center" alignItems="center">
                        <VStack space="2xl" w={"100%"} mt={32}>
                            <ControlledTextInput
                              control={control}
                              name="currentPassword"
                              label={t('entrez_ancien_mot_de_passe')}
                              secureTextEntry
                              placeholder="*************"
                              textContentType="password"
                              required
                            />
                            <ControlledTextInput
                              control={control}
                              name="newPassword"
                              label={t('entrez_nouveau_mot_de_passe')}
                              secureTextEntry
                              textContentType="newPassword"
                              placeholder="*************"
                              required
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
                                    {t('modifier')}
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