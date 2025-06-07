import { ArrowRightIcon, Box, Button, ChevronLeftIcon, ChevronsLeftIcon, HStack, KeyboardAvoidingView, Pressable, ScrollView, VStack } from '@gluestack-ui/themed';
import { StackScreenProps } from '@react-navigation/stack';
import React, { Fragment, useCallback, useRef, useState } from 'react';
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
import ConfirmationCodeInput from '../components/ConfirmationCodeInput';
import { useSignupState } from '../src/context/SignupProvider';
import { useToast } from '@gluestack-ui/themed';
import { NavigationProp, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useVerifyEmailMutation } from '../src/features/auth/auth.apiSlice';
import { useAppSelector } from '../src/store';
import BaseToast from '../components/BaseToast';
import { OTPType } from '../src/types/user.types';
import { handleApiError } from '../src/utils/error.util';
import { useTranslation } from 'react-i18next';

export default function VerifyEmailScreen({
    email,
    token,
}: {
    email: string;
    token?: string;
}) {

    const { t } = useTranslation();

    //const { email, token } = useSignupState();
    const toast = useToast();
    const [otp, setCode] = useState<string | null>(null);
    const navigation = useNavigation<NavigationProp<StackParamList, 'verify-email'>>();
    const route = useRoute<RouteProp<StackParamList, 'verify-email'>>();
    const [verifyEmail, { isLoading }] = useVerifyEmailMutation();
    const otpToken = route.params?.token ?? token;
    const otpEmail = route.params?.email ?? email;

    const handleVerifyCode = () => {
        if (!otp) {
            return;
        }

        verifyEmail({
            //@ts-ignore
            email: otpEmail,
            otp,
            type: OTPType.EMAIL_VERIFICATION,
            token: otpToken,
        }).then(res => {
            if ('data' in res && res.data) {
                toast.show({
                    placement: 'top',
                    render: () => (
                        <BaseToast bg="$primary" description={res.data.message} />
                    ),
                });

                navigation.reset({
                    routes: [
                        {
                            name: 'tab-navigator'
                        },
                    ],
                });

                return;
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
        <Fragment>
            <Box flex={1} paddingHorizontal={25} justifyContent="center" alignItems="flex-start">

                <StyledText color={Colors.light.text} weight='semi-bold' size={26} style={{ marginBottom: 16 }}>Confirmation</StyledText>

                <StyledText size={14}>
                    {t('confirme_code_texte')}
                </StyledText>

                <VStack space="md" w={"100%"} mt={32}>
                    <ConfirmationCodeInput value={otp ?? ''} setValue={setCode} />
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
                    onPress={handleVerifyCode}
                >
                    {isLoading ? (
                        <ActivityIndicator color="#fff" size="small" />
                    ) : (
                        <StyledText size={14} weight="semi-bold">
                            {t('Confirmer')}
                        </StyledText>
                    )}
                </Button>

                <StyledText size={14} color="#000" center weight="semi-bold">
                    {t('deja_inscrit')}{' '}
                    <StyledText size={14} weight='semi-bold' color={Colors.light.textPrimary} onPress={() => { navigation.navigate('login') }}>
                        {t('connectez_vous')}
                    </StyledText>
                </StyledText>
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