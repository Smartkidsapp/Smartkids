import { ArrowRightIcon, Box, Button, HStack, Image, Pressable, VStack } from '@gluestack-ui/themed';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, ImageBackground, ImageSourcePropType, Platform, StyleSheet, useWindowDimensions } from 'react-native';
import { StackParamList } from '../navigation';
import { StyledText } from '../components/StyledText';
import Swiper from 'react-native-swiper';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import useAppInit from '../hooks/useAppInit';
import { useAppSelector } from '../src/store';
import { useLazyGetProfileQuery } from '../src/features/users/store/user.apiSlice';
import * as SplashScreen from 'expo-splash-screen';
import { selectUser } from '../src/features/auth/auth.slice';
import { useTranslation } from 'react-i18next';

interface OBItem {
    image: ImageSourcePropType;
    icon: ImageSourcePropType;
    title: string;
    isBackButton: boolean;
    id: number;
}

export default function OnboardingScreen({
    navigation,
}: StackScreenProps<StackParamList, 'onboarding'>) {

    const { t } = useTranslation();

    const OB_ITEMS: OBItem[] = [
        {
            id: 0,
            title: t('onboardata.title1'),
            image: require('../assets/images/ob1.jpg'),
            icon: require('../assets/images/event.png'),
            isBackButton: false
        },
        {
            id: 1,
            title: t('onboardata.title2'),
            image: require('../assets/images/ob2.jpg'),
            icon: require('../assets/images/ecole.png'),
            isBackButton: true
        },
        {
            id: 2,
            title: t('onboardata.title3'),
            image: require('../assets/images/ob3.jpg'),
            icon: require('../assets/images/app.png'),
            isBackButton: true
        },
    ];

    const swiperRef = useRef<Swiper>(null);

    const { height } = useWindowDimensions();

    const [index, setIndex] = useState(0);

    const [isAppReady, setAppReady] = useState(false);

    const user = useAppSelector(selectUser);

    const [getProfile] = useLazyGetProfileQuery();

    useEffect(() => {
        // Prevent the splash screen from auto-hiding
        SplashScreen.preventAutoHideAsync();

        getProfile()
            .catch(async (initError) => {
                console.error(initError);
                if (user) {
                    navigation.reset({
                        index: 0,
                        routes: [{ name: "tab-navigator" } as never], // Replace 'Home' with your actual home route name
                    });
                }
                setAppReady(true);
                await SplashScreen.hideAsync();
            })
            .then(async res => {
                if ('data' in res! && res.data) {
                    navigation.reset({
                        index: 0,
                        routes: [{ name: "tab-navigator" } as never], // Replace 'Home' with your actual home route name
                    });
                }
                setAppReady(true);
                await SplashScreen.hideAsync();

            })
            .finally(async () => {
                setAppReady(true);
                await SplashScreen.hideAsync();
            });
    }, []);

    const onChangeIndex = () => {
        console.log(index);
    }

    const goToNextSlide = () => {
        if (swiperRef.current && swiperRef.current.scrollBy) {
            // @ts-ignore
            const currentIndex = swiperRef.current.state.index;
            // @ts-ignore
            const totalSlides = swiperRef.current.state.total;

            if (currentIndex === totalSlides - 1) {
                navigation.replace('register');
            } else {
                swiperRef.current.scrollBy(1, true);
            }
        }
    };

    const goToPreviousSlide = () => {
        if (swiperRef.current && swiperRef.current.scrollBy) {
            // @ts-ignore
            const currentIndex = swiperRef.current.state.index;
            // @ts-ignore
            const totalSlides = swiperRef.current.state.total;

            swiperRef.current.scrollBy(-1, true);
        }
    };

    if (!isAppReady) {
        return (
            <Box flex={1} bg="#fff" justifyContent="center" alignItems="center">
                <ActivityIndicator color={Colors.light.primary} size='large' />
            </Box>
        )
    }

    return (
        <Box flex={1} bg="#fff" justifyContent="center" alignItems="center">
            <Box mt={Platform.OS == 'ios' ? 44 : 0} mb={167}>
                <Swiper
                    ref={swiperRef}
                    dot={<View style={{ backgroundColor: 'rgba(30, 30, 30, 0.3)', width: 8, height: 8, borderRadius: 4, marginLeft: 3, marginRight: 3 }} />}
                    activeDot={<View style={{ backgroundColor: 'rgba(229, 215, 197, 1)', width: 22, height: 8, borderRadius: 4, marginLeft: 3, marginRight: 3 }} />}
                >
                    {OB_ITEMS.map((item) => (
                        <Box key={item.id} paddingHorizontal={24} justifyContent='flex-end' alignItems='flex-start'>
                            {
                                item.isBackButton ?
                                    <Pressable
                                        bg="$primary"
                                        w={32}
                                        h={32}
                                        mb={32}
                                        rounded="$full"
                                        justifyContent='center'
                                        alignItems='center'
                                        onPress={goToPreviousSlide}
                                    >
                                        <Ionicons name='chevron-back' size={20} color={"#000"} />
                                    </Pressable>
                                    :
                                    <Box h={32} mb={32} />
                            }
                            <Pressable
                                bg="$primary"
                                borderRadius={10}
                                w={48}
                                h={48}
                                mb={32}
                                justifyContent='center'
                                alignItems='center'
                            >
                                <Image
                                    source={item.icon}
                                    style={{ width: 20, height: 16 }}
                                    resizeMode='contain'
                                />
                            </Pressable>
                            <StyledText size={19} weight='semi-bold' style={{ marginBottom: 30, marginRight: 10 }}>{item.title}</StyledText>
                            <Image
                                source={item.image}
                                style={{ width: 250, height: 250, marginLeft: -24 }}
                                resizeMode='cover'
                                rounded='$full'
                            />
                        </Box>
                    ))}
                </Swiper>
            </Box>

            <VStack
                paddingBottom={44}
                w={"100%"}
                paddingHorizontal={24}
                position='absolute'
                bottom={0}
            >
                <Button
                    bg="$primary"
                    style={styles.button}
                    borderRadius={10}
                    onPress={goToNextSlide}
                >
                    <StyledText size={14} weight='bold'>{t('next')}</StyledText>
                </Button>
                <HStack
                    mt={32}
                    justifyContent='center'
                >
                    <StyledText size={14} weight='semi-bold'>{t('deja_inscrit')} </StyledText>
                    <Pressable onPress={() => navigation.replace('login')}>
                        <StyledText weight='semi-bold' color={Colors.light.textPrimary} size={14}>
                            {t('connectez_vous')}
                        </StyledText>
                    </Pressable>
                </HStack>
            </VStack>
        </Box>
    );
}

const styles = StyleSheet.create({
    image: {
        width: 180,
        height: 85
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
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        width: "100%",
        height: 55,
    },
    carouselContainer: {
        flex: 1 / 2,
        flexDirection: 'row',
        position: 'relative',
    },
});