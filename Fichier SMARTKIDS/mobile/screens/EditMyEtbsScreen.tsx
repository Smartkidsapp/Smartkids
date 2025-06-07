import { StackScreenProps } from '@react-navigation/stack';
import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, useWindowDimensions } from 'react-native';
import { StackParamList } from '../navigation';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Box } from '@gluestack-ui/themed';
import Step1 from './become-owner-step/Step1';
import { Pressable } from '@gluestack-ui/themed';
import { StyledText } from '../components/StyledText';
import Step0 from './become-owner-step/Step0';
import { ScrollView } from 'react-native-gesture-handler';
import EditStep1 from './edit-my-etablissement/EditStep1';
import EditStep2 from './edit-my-etablissement/EditStep2';
import EditStep3 from './edit-my-etablissement/EditStep3';
import EditStep4 from './edit-my-etablissement/EditStep4';
import EditStep5 from './edit-my-etablissement/EditStep5';
import EditStep6 from './edit-my-etablissement/EditStep6';
import { useGetMyEtablissementQuery } from '@/src/features/etablissement/etablissement.apiSlice';
import Colors from '@/constants/Colors';
import { useAppDispatch, useAppSelector } from '@/src/store';
import { selectEtablissement, setCreateEtablissement, setEditEtablissement } from '@/src/features/etablissement/etablissement.slice';
import { useTranslation } from 'react-i18next';


export default function EditMyEtbsScreen({
    navigation,
}: StackScreenProps<StackParamList, 'edit-my-etbs'>) {

    const { t } = useTranslation();

    const dispatch = useAppDispatch();
    const { width } = useWindowDimensions();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [scrollable, setScrollable] = useState(false);
    const scrollRef = useRef<ScrollView>(null);
    const inset = useSafeAreaInsets();
    const { data: etablissement, isLoading, isError, error, isSuccess } = useGetMyEtablissementQuery();
    const { createEtablissement, editEtablissement } = useAppSelector(selectEtablissement);

    useEffect(() => {
        if (etablissement?.data) {
            const option = etablissement.data.options.map((opt) => opt.id);
            dispatch(setEditEtablissement(etablissement.data));
            dispatch(setCreateEtablissement({
                category: etablissement.data?.category.id, 
                nom: etablissement.data?.nom, 
                description: etablissement.data?.description, 
                code_promo: etablissement.data?.code_promo, 
                phone: etablissement.data?.phone,
                dailyOpeningHours: etablissement.data.dailyOpeningHours,
                services: etablissement.data.services || [],
                options: option,
                adresse: etablissement.data.adresse,
                longitude: etablissement.data.longitude,
                latitude: etablissement.data.latitude,
                images: []
            }))
        }
    }, [etablissement])

    const handlPress = async () => {
        if (currentIndex < 6) {
            const index = currentIndex + 1;
            setCurrentIndex(index)
            /*
            setScrollable(true);
            scrollRef.current?.scrollTo({
                x: index * width,
                y: 0,
                animated: true,
            })
            setScrollable(false);
            */
        }
    }

    const handleBack = () => {
        if (currentIndex == 0) {
            navigation.goBack()
        } else {
            const index = currentIndex - 1;
            setCurrentIndex(index);
            /*
            setScrollable(true);
            scrollRef.current?.scrollTo({
                x: index * width,
                y: 0,
                animated: true,
            })
            setScrollable(false);
            */
        }
    }

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerBackTitleVisible: false,
            title: '',
            headerShadowVisible: false,
            headerLeft: () =>
            (
                <Pressable
                    bg="$primary"
                    w={32}
                    h={32}
                    rounded="$full"
                    justifyContent='center'
                    alignItems='center'
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name='close' size={20} color={"#000"} />
                </Pressable>
            ),
            headerRight: () => (
                <Pressable>
                    <StyledText size={14} weight='semi-bold'>Besoin d’aide ?</StyledText>
                </Pressable>
            )
        })
    }, [currentIndex]);

    const Step = useMemo(() => {
        switch (currentIndex) {
            case 0:
                return <EditStep1 onChangeIndex={handlPress} />
            case 1:
                return <EditStep2 onChangeIndex={handlPress} handleBack={handleBack} />;
            case 2:
                return <EditStep3 onChangeIndex={handlPress} handleBack={handleBack} />;
            case 3:
                return <EditStep4 onChangeIndex={handlPress} handleBack={handleBack} />;
            case 4:
                return <EditStep5 onChangeIndex={handlPress} handleBack={handleBack} />;
            case 5:
                return <EditStep6 onChangeIndex={handlPress} handleBack={handleBack} />;
            default:
                return null;
        }
    }, [currentIndex, handlPress, handleBack]);

    return (
        <Box paddingBottom={inset.bottom} bgColor='$white' flex={1}>
            <Box style={{ flexDirection: 'row', marginVertical: 32 }}>
                {[0, 1, 2, 3, 4, 5].map((item, index) => <Box key={item} bgColor={currentIndex >= index ? '$primary' : '$light300'} style={{ flex: 1, height: 5 }} />)}
            </Box>
            {
                isLoading && (
                    <ActivityIndicator size={'large'} color={Colors.light.primary} />
                )
            }
            {
                editEtablissement && (Step)
            }
            {/*
                editEtablissement && (
                    <ScrollView
                        horizontal
                        ref={scrollRef}
                        scrollEnabled={scrollable}
                        showsHorizontalScrollIndicator={false}
                        disableScrollViewPanResponder={false}
                    >
                        <EditStep1 onChangeIndex={handlPress} />
                        <EditStep2 onChangeIndex={handlPress} handleBack={handleBack} />
                        <EditStep3 onChangeIndex={handlPress} handleBack={handleBack} />
                        <EditStep4 onChangeIndex={handlPress} handleBack={handleBack} />
                        <EditStep5 onChangeIndex={handlPress} handleBack={handleBack} />
                        <EditStep6 onChangeIndex={handlPress} handleBack={handleBack} />
                    </ScrollView>
                )
            */}
        </Box>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
