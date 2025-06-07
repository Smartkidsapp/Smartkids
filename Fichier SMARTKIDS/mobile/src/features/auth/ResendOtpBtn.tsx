import React from 'react';
import { StyledText } from '../../../components/StyledText';
import { Pressable, useToast } from '@gluestack-ui/themed';
import { VStack } from '@gluestack-ui/themed';
import { OTPType } from '../../types/user.types';
import { useRequestOTPMutation } from './auth.apiSlice';
import BaseToast from '../../../components/BaseToast';
import { ActivityIndicator } from 'react-native';
import Colors from '../../../constants/Colors';

export default function ResendOtpBtn({
  email,
  type,
  disabled,
}: {
  email: string;
  type: OTPType;
  disabled?: boolean;
}) {
  const toast = useToast();
  const [requestPasswordOTP, { isLoading }] = useRequestOTPMutation();
  const onSubmit = () => {
    requestPasswordOTP({
      email: email,
      type,
    }).then(res => {
      if ('data' in res) {
        toast.show({
          placement: 'top',
          render: () => (
            <BaseToast
              bg="$primary"
              description={'Code de vérification envoyé.'}
            />
          ),
        });
      }

      if ('error' in res) {
        toast.show({
          placement: 'top',
          render: () => (
            <BaseToast
              bg="$danger"
              description={
                "Un problème est survenue. Si le problème persiste, n'hésitez pas à nous contacter."
              }
            />
          ),
        });
      }
    });
  };

  return (
    <VStack space="md" justifyContent="center">
      <StyledText size={14} center weight="semi-bold">
        Vous n'avez pas reçu le code ?
      </StyledText>
      <Pressable disabled={isLoading || disabled} onPress={onSubmit}>
        {isLoading ? (
          <ActivityIndicator size="small" color={Colors.light.textPrimary} />
        ) : (
          <StyledText center weight='semi-bold' size={14} color={Colors.light.textPrimary}>
            Renvoyer
          </StyledText>
        )}
      </Pressable>
    </VStack>
  );
}
