import { ArrowRightIcon, Box, Button, ChevronLeftIcon, ChevronsLeftIcon, HStack, KeyboardAvoidingView, Pressable, ScrollView, useToast, VStack } from '@gluestack-ui/themed';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Image, Keyboard, Platform, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, useWindowDimensions } from 'react-native';
import { StackParamList } from '../navigation';
import { StyledText } from '../components/StyledText';
import AppInput from '@/components/AppInput';
import DatePicker from 'react-native-date-picker';
import PaymentMethods, { PaymentMethodValue } from '@/src/features/payments/PaymentMethods';
import Colors from '@/constants/Colors';
import { locale } from 'moment';
import { usePayBoostageMutation } from '@/src/features/subscriptions/store/subscription.apiSlice';
import BaseToast from '@/components/BaseToast';
import THEME from '@/constants/theme';
import { handleApiError } from '@/src/utils/error.util';
import { useTranslation } from 'react-i18next';

export default function BoostageScreen({
    navigation,
    route
}: StackScreenProps<StackParamList, 'boostage'>) {

    const { t } = useTranslation();

    const { id } = route.params;

    const [paymentMethod, setPaymentMethod] = useState<
        PaymentMethodValue | undefined
    >();

    const currentDate = new Date();
    const tomorrow = new Date().setDate(currentDate.getDate() + 1);

    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date(tomorrow));
    const [totalCost, setTotalCost] = useState(0);
    const [openStartDatePicker, setOpenStartDatePicker] = useState(false);
    const [openEndDatePicker, setOpenEndDatePicker] = useState(false);
    const [request, { isLoading }] = usePayBoostageMutation();
    const toast = useToast();

    const onSubmit = () => {
        if (!paymentMethod) {
            return;
        }
        request({
            paymentMethod: paymentMethod?.value,
            etablissement: id,
            date_debut: startDate,
            date_fin: endDate
        }).then((res) => {
            if ("data" in res && res.data) {
                toast.show({
                    placement: "top",
                    render: () => (
                        <BaseToast
                            bg={THEME.colors.SUCCESS}
                            description={res.data.message}
                        />
                    ),
                });

                navigation.replace('tab-navigator');
            }

            if ("error" in res) {
                handleApiError({
                    error: res.error,
                    toast,
                });
            }
        });
    };

    const calculateCost = () => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        //@ts-ignore
        const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24))
        console.log(days);
        setTotalCost(days * 1); // 1€ par jour
    };

    useEffect(() => {
        if (startDate && endDate) {
            calculateCost();
        }
    }, [endDate, startDate])
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
                        {t('promote')}
                    </StyledText>

                    <HStack
                        alignItems='center'
                        gap={16}
                    >
                        <Box
                            my={32}
                            flex={1}
                        >
                            <AppInput
                                label={t('date_de_début')}
                                value={startDate.toLocaleDateString('fr')}
                                readOnly
                                editable={false}
                                onPress={() => setOpenStartDatePicker(true)}
                            />
                        </Box>

                        <Box
                            flex={1}
                        >
                            <AppInput
                                label={t('date_de_fin')}
                                value={endDate.toLocaleDateString('fr')}
                                readOnly
                                editable={false}
                                onPress={() => setOpenEndDatePicker(true)}
                            />
                        </Box>
                    </HStack>

                    <Box
                        style={{ marginBottom: 32 }}
                    >
                        <AppInput
                            width={"47%"}
                            label={t('cout_total')}
                            value={`${totalCost} €`}
                            readOnly
                            editable={false}
                        />
                    </Box>

                    <PaymentMethods
                        mode="select"
                        onMethodSelected={(method) => {
                            setPaymentMethod(method);
                        }}
                        showPaypalMethods={false}
                        selectedMethod={paymentMethod?.value}
                    />

                    <DatePicker
                        modal
                        open={openStartDatePicker}
                        date={startDate}
                        onConfirm={(date) => {
                            setOpenStartDatePicker(false);
                            setStartDate(date);
                        }}
                        onCancel={() => setOpenStartDatePicker(false)}
                        mode="date"
                        locale='fr'
                    />

                    <DatePicker
                        modal
                        open={openEndDatePicker}
                        date={endDate}
                        onConfirm={(date) => {
                            setOpenEndDatePicker(false);
                            setEndDate(date);
                        }}
                        onCancel={() => setOpenEndDatePicker(false)}
                        mode="date"
                        locale='fr'
                    />

                    <Button
                        elevation="$3"
                        shadowColor="rgba(0, 0, 0, 0.5)"
                        bg={!paymentMethod || isLoading ? '$light200' : '$primary'}
                        size="xl"
                        w={'100%'}
                        h={50}
                        my={32}
                        borderRadius={10}
                        disabled={!paymentMethod || isLoading}
                        onPress={onSubmit}
                    >
                        {
                            isLoading ?
                                <ActivityIndicator size="small" color={"#000"} />
                                :
                                <StyledText size={14} weight='semi-bold' color={!paymentMethod || isLoading ? Colors.light.gray : '#000'}>{t('booster')}</StyledText>
                        }
                    </Button>
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