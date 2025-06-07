import { ArrowRightIcon, Box, Button, ChevronLeftIcon, ChevronsLeftIcon, HStack, KeyboardAvoidingView, Pressable, ScrollView, useToast, VStack } from '@gluestack-ui/themed';
import { StackScreenProps } from '@react-navigation/stack';
import React, { Fragment, useCallback, useRef, useState } from 'react';
import { ActivityIndicator, Image, ImageBackground, ImageSourcePropType, Keyboard, Platform, StyleSheet, TouchableWithoutFeedback, useWindowDimensions } from 'react-native';
import Swiper from 'react-native-swiper';
import { View } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useSignupMutation } from '../auth.apiSlice';
import { StackParamList } from '../../../../navigation';
import { useForm } from 'react-hook-form';
import { SignupDto, SignupSchema } from '../auth.request';
import BaseToast from '../../../../components/BaseToast';
import { handleApiError } from '../../../utils/error.util';
import { Ionicons } from '@expo/vector-icons';
import { StyledText } from '../../../../components/StyledText';
import Colors from '../../../../constants/Colors';
import ControlledTextInput from '../../../../components/ControlledTextInput';
import { useSignupState } from '../../../context/SignupProvider';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { StepComponentProps } from '@/screens/RegisterScreen';

export default function SignupStep0({ setStep }: StepComponentProps) {

  const { t } = useTranslation();

  const toast = useToast();
  const { setEmail, setToken } = useSignupState();
  const [signup, { isLoading }] = useSignupMutation();
  const navigation = useNavigation<NavigationProp<StackParamList>>();

  const {
    control,
    reset,
    handleSubmit,
    setError,
    formState: { isValid },
  } = useForm<SignupDto>({
    resolver: zodResolver(SignupSchema),
  });

  const onSubmit = (data: SignupDto) => {
    console.log({ data });
    signup(data).then(res => {
      if ('data' in res && res.data) {
        if (res.data.message) {
          toast.show({
            placement: 'top',
            render: () => (
              <BaseToast bg="$primary" description={res.data.message} />
            ),
          });
        }
        console.log(res.data);
        setToken(res.data.data.access_token);
        setEmail(data.email);
        reset();
        setStep(1);
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
    <Fragment>
      <Box flex={1} paddingHorizontal={25} justifyContent="center" alignItems="flex-start">

        <StyledText color={Colors.light.text} weight='semi-bold' size={26} style={{ marginBottom: 16 }}>{t('creer_votre_compte')}</StyledText>

        <StyledText size={14}>
          {t('rejoindre_communaute')}
        </StyledText>

        <VStack space="md" w={"100%"} mt={32}>
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
      </Box>

      <VStack pb={44} px={25} mt={64} justifyContent="center" alignItems='center' width={"100%"}>
        <StyledText style={{ marginBottom: 32 }}>{t('register_politique')}</StyledText>
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
              {t('creer_un_compte')}
            </StyledText>
          )}
        </Button>

        <StyledText size={14} color="#000" center weight="semi-bold">
          {t('deja_inscrit')}{' '}
          <StyledText size={14} weight='semi-bold' color={Colors.light.textPrimary} onPress={() => { navigation.navigate('login') }}>
            {t('connectez_vous')}
          </StyledText>
        </StyledText>

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
              {t('continue_without_register')}
            </StyledText>
            <Ionicons name='chevron-forward' size={16} color={Colors.light.textPrimary} style={{ marginTop: 2 }} />
          </Pressable>
        </HStack>
      </VStack>
    </Fragment>
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