import { ArrowRightIcon, Box, Button, ChevronLeftIcon, ChevronsLeftIcon, HStack, KeyboardAvoidingView, Pressable, ScrollView, useToast, VStack } from '@gluestack-ui/themed';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Image, Keyboard, Platform, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, useWindowDimensions } from 'react-native';
import { StackParamList } from '../navigation';
import { StyledText } from '../components/StyledText';
import AppInput from '@/components/AppInput';
import DatePicker from 'react-native-date-picker';
import Colors from '@/constants/Colors';
import { useListUserBoostagesPaymentsQuery } from '@/src/features/payments/store/payment.apiSlice';
import { PaymentTypeEnum } from '@/src/types';
import { useTranslation } from 'react-i18next';

export default function BoostageHistoriqueScreen({
    navigation,
    route
}: StackScreenProps<StackParamList, 'boostage-historique'>) {

    const { t } = useTranslation();

    const { data, isLoading, isSuccess, isError } = useListUserBoostagesPaymentsQuery(PaymentTypeEnum.RIDE);

    if (isLoading) {
        return <ActivityIndicator size="large" color={Colors.light.primary} />;
    }

    console.log(data);

    return (
        <KeyboardAvoidingView
            flex={1}
            enabled
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <TouchableWithoutFeedback
                onPress={Keyboard.dismiss}
            >
                <ScrollView flex={1} bg="#fff" p={25} pt={32}>
                    <StyledText size={18} weight="semi-bold">
                        {t('historique_de_payements')}
                    </StyledText>
                    <VStack space="md" mt={32}>
                        <HStack justifyContent="space-between" alignItems="center">
                            <StyledText style={{ width: '30%' }} size={14} weight="bold">
                                {t('prix')}
                            </StyledText>
                            <StyledText style={{ width: '35%', textAlign: 'center' }} size={14} weight="bold">
                                {t('du')}
                            </StyledText>
                            <StyledText style={{ width: '35%', textAlign: 'center' }} size={14} weight="bold">
                                {t('au')}
                            </StyledText>
                        </HStack>
                        {isSuccess && data.data.map((payment, index) => (
                            <Box
                                key={payment.id}
                                py={15}
                                px={10}
                                borderWidth={1}
                                borderColor="#E0E0E0"
                                borderRadius={8}
                                overflow="hidden"
                            >
                                <HStack justifyContent="space-between" alignItems="center">
                                    <StyledText style={{ width: '30%' }} size={16} weight="bold">
                                        {`${payment.price.toFixed(2)} €`}
                                    </StyledText>
                                    <StyledText style={{ width: '35%', textAlign: 'center' }} size={14} color="gray.500">
                                        {new Date(payment.ref.date_debut).toLocaleDateString()}
                                    </StyledText>
                                    <StyledText style={{ width: '35%', textAlign: 'right' }} size={14} color="gray.500">
                                        {new Date(payment.ref.date_fin).toLocaleDateString()}
                                    </StyledText>
                                </HStack>
                            </Box>
                        ))}
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