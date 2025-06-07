import { Box, Button, ChevronLeftIcon, ChevronsLeftIcon, CloseCircleIcon, HStack, KeyboardAvoidingView, Pressable, ScrollView, VStack } from '@gluestack-ui/themed';
import { StackScreenProps } from '@react-navigation/stack';
import React, { Fragment, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Animated, Image, ImageBackground, ImageSourcePropType, Keyboard, Linking, Platform, StyleSheet, TouchableWithoutFeedback, useWindowDimensions } from 'react-native';
import { StackParamList } from '../navigation';
import { StyledText } from '../components/StyledText';
import { Ionicons } from '@expo/vector-icons';
import { MenuItem, MenuItemProps } from '../components/MenuItem';
import Colors from '../constants/Colors';
import CustomBottomSheet from '../components/CustomBottomSheet';
import { useGetEtablissementQuery, useGetMyEtablissementQuery } from '@/src/features/etablissement/etablissement.apiSlice';
import ImageSlider from '@/components/ImageSlider';
import { Media } from '@/src/types';
import ImageView from "react-native-image-viewing";
import EtablissementStatus from '@/components/EtablissementStatus';
import DetailLoader from '@/components/DetailLoader';
import { useAppSelector } from '@/src/store';
import { selectEtablissement } from '@/src/features/etablissement/etablissement.slice';
import { useTranslation } from 'react-i18next';

const APPLE_LINK = "https://maps.apple.com/?daddr=";
const GMAPS_LINK = "https://maps.google.com/maps?z=12&t=m&q=loc:";
const GMAPS_LINK_IOS = "comgooglemaps://?q=";
const WAZE_LINK = "https://waze.com/ul?ll=";

interface MapsRedirectProps {
    icon?: any,
    title: string,
    action: () => void,
    bg?: string
}

export default function MyEtablissementScreen({
    navigation,
    route
}: StackScreenProps<StackParamList, 'my-etbs'>) {

    const { t, i18n } = useTranslation();

    const { myEtablissement: etablissement } = useAppSelector(selectEtablissement)

    const { data, isLoading, isError, error, isSuccess } = useGetMyEtablissementQuery();

    const [isBottomSheetOpen, setBottomSheetOpen] = useState(false);
    const [headerVisible, setHeaderVisible] = useState(false);

    const [visible, setVisible] = useState(false);
    const [index, setIndex] = useState(0);
    const [photos, setPhotos] = useState<any[]>([]);

    const toggleBottomSheet = () => {
        setBottomSheetOpen(!isBottomSheetOpen);
    };

    const handleScroll = (event: any) => {
        const scrollY = event.nativeEvent.contentOffset.y;
        setHeaderVisible(scrollY > 85);
    };

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: headerVisible,
            headerBackTitleVisible: false,
            title: etablissement && etablissement?.nom.length > 20 ? `${etablissement?.nom.slice(0, 20)}...` : etablissement?.nom,
            headerShadowVisible: false,
            headerLeft: () =>
            (
                <Pressable
                    bg="$primary"
                    w={32}
                    h={32}
                    ml={24}
                    rounded="$full"
                    justifyContent='center'
                    alignItems='center'
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name='chevron-back' size={20} color={"#000"} />
                </Pressable>
            ),
            headerRight: () => (
                <Pressable>
                </Pressable>
            )
        })
    }, [headerVisible, etablissement]);

    useEffect(() => {
        setPhotos([]);
        if (etablissement && etablissement.images.length > 0) {
            setPhotos(etablissement.images);
            etablissement.images?.map((m) => {
                setPhotos((prevState: any) => [
                    ...prevState, { uri: m.src }
                ]);
                return { uri: m.src };
            });
        }
    }, [etablissement]);

    const formatTitle = (title: string) => {

        if (title.length > 30) {
            return title.slice(0, 30) + '...';
        }
        return title;
    };

    return (
        <KeyboardAvoidingView
            flex={1}
            enabled
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <TouchableWithoutFeedback
                onPress={Keyboard.dismiss}
            >
                <Fragment>
                    {
                        isLoading && (
                            <Box w="100%" alignItems="center">
                                <DetailLoader />
                            </Box>
                        )
                    }
                    {
                        photos.length > 0 && (
                            <ImageView
                                images={
                                    etablissement?.images?.map((m) => {
                                        return { uri: m.src };
                                    }) || []
                                }
                                imageIndex={index}
                                visible={visible}
                                onRequestClose={() => setVisible(false)}
                            />
                        )
                    }
                    <ScrollView
                        flex={1}
                        contentContainerStyle={{ paddingBottom: 150 }}
                        onScroll={handleScroll}
                    >

                        {
                            (etablissement && etablissement.images.length > 0) && (
                                <Box
                                    height={350}
                                    width={"100%"}
                                >
                                    <Pressable
                                        position='absolute'
                                        bg="$primary"
                                        w={32}
                                        h={32}
                                        mb={32}
                                        mt={50}
                                        rounded="$full"
                                        justifyContent='center'
                                        alignItems='center'
                                        ml={25}
                                        onPress={() => navigation.goBack()}
                                        zIndex={1000}
                                    >
                                        <Ionicons name='chevron-back' size={20} color={"#000"} />
                                    </Pressable>
                                    <ImageSlider setVisible={setVisible} setIndex={setIndex} images={etablissement.images} couverture={etablissement.images[0].src || null} />
                                </Box>
                            )
                        }
                        {
                            etablissement && (
                                <Box p={25}>
                                    <HStack justifyContent='space-between' alignItems='flex-start'>
                                        <StyledText size={18} weight='semi-bold' style={{ marginBottom: 16 }}>{etablissement.nom}</StyledText>
                                    </HStack>
                                    <HStack justifyContent='space-between' alignItems='center'>
                                        <StyledText size={14} weight='semi-bold' color={Colors.light.gray}>{i18n.language == 'fr' ? etablissement.category.titre : etablissement.category.titre_en}</StyledText>
                                    </HStack>
                                    <Pressable onPress={toggleBottomSheet}>
                                        <HStack space='xs' alignItems='center' mt={16}>
                                            <Ionicons size={20} name='location-outline' color={Colors.light.textPrimary} />
                                            <StyledText size={14} weight='semi-bold' color={Colors.light.textPrimary}>
                                                {etablissement.adresse}
                                            </StyledText>
                                        </HStack>
                                    </Pressable>
                                    <EtablissementStatus dailyOpeningHours={etablissement.dailyOpeningHours} />
                                    <HStack space='xs' alignItems='center' mt={16}>
                                        <Ionicons size={20} name='id-card-outline' color="#000" />
                                        <StyledText size={14} weight='semi-bold'>
                                            {t('age_autorise')} :
                                        </StyledText>
                                        <StyledText size={14}>
                                            {etablissement.min_age} an(s) - {etablissement.max_age} an(s)
                                        </StyledText>
                                    </HStack>
                                    <Box h={1.2} w='$full' my={32} bgColor='$light300' />
                                    <StyledText size={16} weight='semi-bold' style={{ marginBottom: 16 }}>Description</StyledText>
                                    <StyledText size={14} color={Colors.light.text} style={{ lineHeight: 22 }}>{etablissement.description}</StyledText>
                                    <Box h={1.2} w='$full' my={32} bgColor='$light300' />
                                    {
                                        (etablissement.code_promo && etablissement.code_promo != "undefined") && (
                                            <>
                                                <StyledText size={16} weight='semi-bold' style={{ marginBottom: 16 }}>{t('code_promo')}</StyledText>
                                                <StyledText size={12} color={Colors.light.text}>{t('utilisez_ce_code')}</StyledText>
                                                <Box
                                                    w={150}
                                                    h={35}
                                                    mt={16}
                                                    borderRadius={10}
                                                    borderWidth={1}
                                                    justifyContent='center'
                                                    alignItems='center'
                                                    borderStyle='dashed'
                                                >
                                                    <StyledText size={14} weight="semi-bold">
                                                        {etablissement.code_promo}
                                                    </StyledText>
                                                </Box>
                                                <Box h={1.2} w='$full' my={32} bgColor='$light300' />
                                            </>
                                        )
                                    }
                                    {
                                        etablissement.options.length > 0 && (
                                            <>
                                                <StyledText size={16} weight='semi-bold' style={{ marginBottom: 16 }}>{t('etablissement_propose')}</StyledText>
                                                {
                                                    [...etablissement.options].sort((a, b) => i18n.language == 'fr' ? a.titre.localeCompare(b.titre) : a.titre_en?.localeCompare(b.titre_en)).map((option, key) => (
                                                        <HStack space='md' alignItems='center' mt={16}>
                                                            <StyledText size={14} weight='semi-bold'>{i18n.language == 'fr' ? option.titre : option.titre_en}</StyledText>
                                                        </HStack>
                                                    ))
                                                }
                                                <Box h={1.2} w='$full' my={32} bgColor='$light300' />
                                            </>
                                        )
                                    }
                                    {
                                        (etablissement.services! && etablissement.services?.length) > 0 && (
                                            <>
                                                {(etablissement.options.length > 0 && (!etablissement.code_promo || etablissement.code_promo == "undefined")) && <Box h={1.2} w='$full' my={32} bgColor='$light300' />}
                                                <StyledText size={16} weight='semi-bold' style={{ marginBottom: 16 }}>{t('nos_services')}</StyledText>
                                                {
                                                    etablissement.services?.map((service, key) => (
                                                        <>
                                                            <HStack paddingBottom={8} borderBottomWidth={(etablissement.services?.length! - 1) == key ? 0 : 1} borderColor='$light300' space='md' justifyContent='space-between' alignItems='center' mt={16}>
                                                                <StyledText size={14} weight='semi-bold'>{formatTitle(service.title)}</StyledText>
                                                                <StyledText size={14} weight='semi-bold'>{service.price}</StyledText>
                                                            </HStack>
                                                        </>
                                                    ))
                                                }
                                            </>
                                        )
                                    }
                                </Box>
                            )
                        }
                    </ScrollView>


                    {
                        etablissement && (
                            <HStack borderTopWidth={1} borderTopColor='$light300' backgroundColor='$light' justifyContent='space-between' paddingHorizontal={25} pt={8} pb={30}>
                                <Button
                                    elevation="$3"
                                    shadowColor="rgba(0, 0, 0, 0.5)"
                                    borderRadius={10}
                                    bg="$primary"
                                    size="xl"
                                    h={50}
                                    w={'35%'}
                                    mb={5}
                                    flexDirection='row'
                                    alignItems='center'
                                    justifyContent='center'
                                    gap={5}
                                    onPress={() => navigation.navigate('edit-my-etbs')}
                                >
                                    <Ionicons name='create-outline' size={16} />
                                    <StyledText size={14} weight="semi-bold">
                                        {t('modifier')}
                                    </StyledText>
                                </Button>
                                <Button
                                    elevation="$3"
                                    shadowColor="rgba(0, 0, 0, 0.5)"
                                    borderRadius={10}
                                    bg="#27CDFB"
                                    //bg='$light200'
                                    size="xl"
                                    h={50}
                                    w={'55%'}
                                    mb={5}
                                    flexDirection='row'
                                    alignItems='center'
                                    justifyContent='center'
                                    gap={5}
                                    onPress={() => navigation.navigate('boostage', { id: etablissement.id })}
                                >
                                    <Ionicons name='navigate' size={16} color={Colors.light.text} />
                                    <StyledText size={14} color={Colors.light.text} weight="semi-bold">
                                        {t('booster')}
                                    </StyledText>
                                </Button>
                            </HStack>
                        )
                    }
                    {
                        etablissement && (
                            <CustomBottomSheet isOpen={isBottomSheetOpen} onClose={toggleBottomSheet} title='Sélectionner une action'>
                                <LinkModalContent onClose={toggleBottomSheet} long={etablissement.longitude} lat={etablissement.latitude} />
                            </CustomBottomSheet>
                        )
                    }
                </Fragment>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

const LinkMenuItem = ({ icon, title, action, bg }: MapsRedirectProps) => {
    return (
        <Pressable
            w={'100%'}
            justifyContent='space-between'
            alignItems='center'
            shadowColor='$light400'
            borderRadius={5}
            p={12}
            backgroundColor='$white'
            flexDirection='row'
            onPress={action}
            bgColor={bg ? bg : '$white'}
        >
            <HStack space='md' alignItems='center'>
                {icon && icon}
                <StyledText weight='semi-bold' size={14}>{title}</StyledText>
            </HStack>
        </Pressable>
    )
}

const LinkModalContent = ({ long, lat, onClose }: { long: number, lat: number, onClose: () => void }) => {

    const openLink = useCallback(async (url: string) => {
        try {
            if (await Linking.canOpenURL(url)) {
                Linking.openURL(url);
            }
        } catch (err) {
            console.log(err);
        }
    }, []);

    const mapsRedirectLink: MapsRedirectProps[] = [
        {
            icon: <Image source={require('../assets/images/google-maps.png')} style={{ width: 20, height: 24 }} resizeMode='contain' />,
            title: "Ouvrir dans Google maps",
            action: () => {
                if (Platform.OS == "ios") {
                    openLink(`${GMAPS_LINK_IOS}${lat},${long}`);
                    onClose();
                } else {
                    openLink(`${GMAPS_LINK}${lat}+${long}`);
                    onClose();
                }
            },
            bg: Colors.light.primary
        },
        {
            icon: <Image source={require('../assets/images/waze.png')} style={{ width: 20, height: 24 }} resizeMode='contain' />,
            title: "Ouvrir dans Waze",
            action: () => {
                openLink(`${WAZE_LINK}${lat},${long}`);
            },
            bg: Colors.light.primary
        },
        {
            icon: <Ionicons name='navigate' size={20} />,
            title: "Ouvrir dans Plans",
            action: () => {
                if (Platform.OS == "ios") {
                    openLink(`${APPLE_LINK}${lat},${long}`);
                    onClose();
                } else {
                    openLink(`${GMAPS_LINK}${lat}+${long}`);
                    onClose();
                }
            },
            bg: Colors.light.primary
        }
    ];

    return (
        <VStack w="$full" space='xl' justifyContent='center' alignItems='center'>
            {
                mapsRedirectLink.map((item, key) => (
                    <LinkMenuItem bg={item.bg} icon={item.icon} title={item.title} action={item.action} />
                ))
            }
        </VStack>
    )
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