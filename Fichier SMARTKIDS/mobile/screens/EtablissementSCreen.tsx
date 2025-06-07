import { Avatar, AvatarImage, Box, Button, ChevronLeftIcon, ChevronsLeftIcon, CloseCircleIcon, HStack, KeyboardAvoidingView, Pressable, ScrollView, VStack } from '@gluestack-ui/themed';
import { StackScreenProps } from '@react-navigation/stack';
import React, { Fragment, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Image, ImageBackground, ImageSourcePropType, Keyboard, Linking, Platform, StyleSheet, TouchableWithoutFeedback, useWindowDimensions } from 'react-native';
import { StackParamList } from '../navigation';
import { StyledText } from '../components/StyledText';
import { Ionicons } from '@expo/vector-icons';
import { MenuItem, MenuItemProps } from '../components/MenuItem';
import Colors from '../constants/Colors';
import CustomBottomSheet from '../components/CustomBottomSheet';
import { useCanUserRateQuery, useFavoriteMutation, useGetEtablissementQuery, useGetEtablissementRattingsQuery, useIsFavoriteQuery, useLazyCanUserRateQuery, useLazyGetEtablissementRattingsQuery, useLazyIsFavoriteQuery } from '@/src/features/etablissement/etablissement.apiSlice';
import ImageSlider from '@/components/ImageSlider';
import { Media, Rating } from '@/src/types';
import ImageView from "react-native-image-viewing";
import EtablissementStatus from '@/components/EtablissementStatus';
import DetailLoader from '@/components/DetailLoader';
import RateEtablissement from '@/components/RateEtablissement';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@/src/store';
import { selectUser } from '@/src/features/auth/auth.slice';

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

export default function EtablissementScreen({
    navigation,
    route
}: StackScreenProps<StackParamList, 'etbs'>) {

    const user = useAppSelector(selectUser);

    const { t, i18n } = useTranslation();

    const { id, distance } = route.params;


    const { data: etablissement, error, isLoading, isError } = useGetEtablissementQuery({ id });

    const { data: canUserRate } = useCanUserRateQuery({ etablissementId: id });

    const { data: ratingData } = useGetEtablissementRattingsQuery({ id });

    const [updateRatingState, setUpdateRatingState] = useState(false);

    const [requestFavorite, { isLoading: isFavoriteLoading }] = useFavoriteMutation();

    const [requestIsFavorite] = useLazyIsFavoriteQuery();

    const [getCanUserRate] = useLazyCanUserRateQuery();

    const [getEtablissementRattings] = useLazyGetEtablissementRattingsQuery();

    const [isBottomSheetOpen, setBottomSheetOpen] = useState(false);
    const [isRateBottomSheetOpen, setRateBottomSheetOpen] = useState(false);
    const [headerVisible, setHeaderVisible] = useState(false);

    const [isFavorite, setIsFavorite] = useState(false);
    const [visible, setVisible] = useState(false);
    const [index, setIndex] = useState(0);
    const [photos, setPhotos] = useState<any[]>([]);
    const [rating, setRating] = useState<Rating[]>([]);

    useEffect(() => {
        if (etablissement?.data) {
            requestIsFavorite({ id: etablissement.data.id }).then((res) => {
                if (res.data) {
                    setIsFavorite(res.data?.data)
                }
            });
        }
    }, [etablissement, isFavoriteLoading])

    useEffect(() => {
        if (ratingData?.data) {
            setRating(ratingData.data);
        }
    }, [ratingData])

    useEffect(() => {
        if (updateRatingState) {
            getEtablissementRattings({ id }).then((res) => {
                if (res.data?.data) {
                    setRating(res.data.data)
                }
            });
        }
    }, [updateRatingState])

    const toggleBottomSheet = () => {
        setBottomSheetOpen(!isBottomSheetOpen);
    };

    const onCloseBottomSheet = () => {
        setBottomSheetOpen(false);
    };

    const toggleRateBottomSheet = () => {
        setRateBottomSheetOpen(!isBottomSheetOpen);
    };

    const onCloseRateBottomSheet = () => {
        setRateBottomSheetOpen(false);
    };

    const handleScroll = (event: any) => {
        const scrollY = event.nativeEvent.contentOffset.y;
        setHeaderVisible(scrollY > 85);
    };

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: headerVisible,
            headerBackTitleVisible: false,
            title: etablissement?.data && etablissement?.data.nom.length > 20 ? `${etablissement?.data.nom.slice(0, 20)}...` : etablissement?.data.nom,
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
                    <Ionicons name='chevron-back' size={20} color={"#000"} />
                </Pressable>
            ),
            headerRight: () => (
                user && <Pressable
                    justifyContent='center'
                    alignItems='center'
                    onPress={() => etablissement && requestFavorite({ etablissementId: etablissement.data.id })}
                >
                    {
                        isFavoriteLoading ?
                            <ActivityIndicator color={Colors.light.textPrimary} size="small" />
                            :
                            <Ionicons name={isFavorite ? 'heart' : 'heart-outline'} size={28} color={Colors.light.textPrimary} />
                    }
                </Pressable>
            )
        })
    }, [headerVisible, requestFavorite, isFavoriteLoading, isFavorite, etablissement, user]);

    useEffect(() => {
        setPhotos([]);
        if (etablissement?.data && etablissement.data.images.length > 0) {
            setPhotos(etablissement.data.images);
            etablissement.data.images?.map((m) => {
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
                            <Box w="100%" alignItems="center" position='absolute'>
                                <DetailLoader />
                            </Box>
                        )
                    }
                    {
                        photos.length > 0 && (
                            <ImageView
                                images={
                                    etablissement?.data.images?.map((m) => {
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
                            (etablissement?.data && etablissement.data.images.length > 0) ? (
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
                                    <ImageSlider setVisible={setVisible} setIndex={setIndex} images={etablissement.data.images} couverture={etablissement.data.images[0].src || null} />
                                    {
                                        user && (
                                            <Pressable
                                                position='absolute'
                                                mb={32}
                                                mt={50}
                                                rounded="$full"
                                                right={25}
                                                onPress={() => requestFavorite({ etablissementId: etablissement.data.id })}
                                                zIndex={1000}
                                            >
                                                {
                                                    isFavoriteLoading ?
                                                        <ActivityIndicator color={Colors.light.textPrimary} size="small" />
                                                        :
                                                        <Ionicons name={isFavorite ? 'heart' : 'heart-outline'} size={32} color={Colors.light.textPrimary} />
                                                }
                                            </Pressable>
                                        )
                                    }
                                </Box>
                            )
                                :
                                <Box w={"100%"} h={350} backgroundColor='$light300'>
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
                                </Box>
                        }
                        {
                            etablissement?.data && (
                                <Box p={25}>
                                    <HStack justifyContent='space-between' alignItems='flex-start'>
                                        <StyledText size={18} weight='semi-bold' style={{ marginBottom: 16 }}>{etablissement?.data.nom}</StyledText>
                                        {
                                            distance && (
                                                <StyledText size={14} weight='semi-bold' color={Colors.light.gray}>{t('a')} {distance.toFixed(0)} km</StyledText>
                                            )
                                        }
                                    </HStack>
                                    <HStack justifyContent='space-between' alignItems='center'>
                                        <StyledText size={14} weight='semi-bold' color={Colors.light.gray}>{i18n.language == 'fr' ? etablissement.data.category.titre : etablissement.data.category.titre_en}</StyledText>
                                    </HStack>
                                    <Pressable onPress={toggleBottomSheet}>
                                        <HStack space='xs' alignItems='center' mt={16}>
                                            <Ionicons size={20} name='location-outline' color={Colors.light.textPrimary} />
                                            <StyledText size={14} weight='semi-bold' color={Colors.light.textPrimary}>
                                                {etablissement.data.adresse}
                                            </StyledText>
                                        </HStack>
                                    </Pressable>
                                    <EtablissementStatus dailyOpeningHours={etablissement.data.dailyOpeningHours} />
                                    <HStack space='xs' alignItems='center' mt={16}>
                                        <Ionicons size={20} name='id-card-outline' color="#000" />
                                        <StyledText size={14} weight='semi-bold'>
                                            {t('age_autorise')} :
                                        </StyledText>
                                        <StyledText size={14}>
                                            {etablissement.data.min_age} an(s) - {etablissement.data.max_age} an(s)
                                        </StyledText>
                                    </HStack>
                                    <Box h={1.2} w='$full' my={32} bgColor='$light300' />
                                    <StyledText size={16} weight='semi-bold' style={{ marginBottom: 16 }}>Description</StyledText>
                                    <StyledText size={14} color={Colors.light.text} style={{ lineHeight: 22 }}>{etablissement.data.description}</StyledText>
                                    <Box h={1.2} w='$full' my={32} bgColor='$light300' />
                                    {
                                        (etablissement.data.code_promo && etablissement.data.code_promo != "undefined") && (
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
                                                        {etablissement.data.code_promo}
                                                    </StyledText>
                                                </Box>
                                                <Box h={1.2} w='$full' my={32} bgColor='$light300' />
                                            </>
                                        )
                                    }
                                    {
                                        etablissement.data.options.length > 0 && (
                                            <>
                                                <StyledText size={16} weight='semi-bold' style={{ marginBottom: 16 }}>{t('etablissement_propose')}</StyledText>
                                                {
                                                    [...etablissement.data.options].sort((a, b) => i18n.language == 'fr' ? a.titre.localeCompare(b.titre) : a.titre_en?.localeCompare(b.titre_en)).map((option, key) => (
                                                        <HStack space='md' alignItems='center' mt={16}>
                                                            <StyledText size={14} weight='semi-bold'>{i18n.language == 'fr' ? option.titre : option.titre_en}</StyledText>
                                                        </HStack>
                                                    ))
                                                }
                                                {(etablissement.data.code_promo && etablissement.data.code_promo != "undefined") && <Box h={1.2} w='$full' my={32} bgColor='$light300' />}
                                            </>
                                        )
                                    }
                                    {
                                        (etablissement.data.services! && etablissement.data.services?.length > 0) && (
                                            <>
                                                {(etablissement.data.options.length > 0 && (!etablissement.data.code_promo || etablissement.data.code_promo == "undefined")) && <Box h={1.2} w='$full' my={32} bgColor='$light300' />}
                                                <StyledText size={16} weight='semi-bold' style={{ marginBottom: 16 }}>{t('nos_services')}</StyledText>
                                                {
                                                    etablissement.data.services?.map((service, key) => (
                                                        <>
                                                            <HStack paddingBottom={8} borderBottomWidth={(etablissement.data.services?.length! - 1) == key ? 0 : 1} borderColor='$light300' space='md' justifyContent='space-between' alignItems='center' mt={16}>
                                                                <StyledText size={14} weight='semi-bold'>{formatTitle(service.title)}</StyledText>
                                                                <StyledText size={14} weight='semi-bold'>{service.price}</StyledText>
                                                            </HStack>
                                                        </>
                                                    ))
                                                }
                                            </>
                                        )
                                    }
                                    {(etablissement.data.services && etablissement.data.services?.length > 0) && <Box h={1.2} w='$full' my={32} bgColor='$light300' />}
                                    <StyledText size={16} weight='semi-bold' style={{ marginBottom: 16 }}>{t('avis_recents')}</StyledText>
                                    {
                                        (rating && rating.length > 0) ?
                                            <>
                                                {
                                                    rating.map((rate, key) => (
                                                        <HStack key={key} space='md' justifyContent='flex-start' alignItems='flex-start' mt={16}>
                                                            <Avatar size="md" bg="$primary">
                                                                <AvatarImage
                                                                    alt={rate.author.name}
                                                                    source={
                                                                        rate.author.avatar
                                                                            ? rate.author.avatar
                                                                            : require('../assets/images/avatar.png')
                                                                    }
                                                                />
                                                            </Avatar>
                                                            <VStack space='md'>
                                                                <HStack space='sm'>
                                                                    {
                                                                        (Array.from({ length: rate.mark })).map((item, key) => (
                                                                            <Ionicons key={key} name='star' color={"#EECE27"} size={20} />
                                                                        ))
                                                                    }
                                                                </HStack>
                                                                <StyledText size={14} weight='semi-bold'>{rate.author.name}</StyledText>
                                                                <StyledText size={14}>{rate.comment}</StyledText>
                                                            </VStack>
                                                        </HStack>
                                                    ))
                                                }
                                            </>
                                            :
                                            <StyledText size={14} style={{ marginTop: 16 }}>{t('aucun_avis')}</StyledText>
                                    }
                                    {
                                        (canUserRate?.data && !updateRatingState) && (
                                            <Button
                                                mt={32}
                                                elevation="$3"
                                                shadowColor="rgba(0, 0, 0, 0.5)"
                                                borderRadius={10}
                                                bg="$primary"
                                                size="xl"
                                                h={50}
                                                maxWidth={'50%'}
                                                mb={5}
                                                flexDirection='row'
                                                alignItems='center'
                                                justifyContent='center'
                                                gap={5}
                                                onPress={toggleRateBottomSheet}
                                            >
                                                <Ionicons size={16} name='add' color={'#000'} />
                                                <StyledText size={14} weight="semi-bold">
                                                    {t('laissez_votre_avis')}
                                                </StyledText>
                                            </Button>
                                        )
                                    }
                                </Box>
                            )
                        }
                    </ScrollView>


                    {
                        etablissement?.data && (
                            <HStack borderTopWidth={1} borderTopColor='$light300' backgroundColor='$light' justifyContent='space-between' paddingHorizontal={25} pt={8} pb={30}>
                                <Button
                                    elevation="$3"
                                    shadowColor="rgba(0, 0, 0, 0.5)"
                                    borderRadius={10}
                                    bg="$primary"
                                    size="xl"
                                    h={50}
                                    w={'45%'}
                                    mb={5}
                                    flexDirection='row'
                                    alignItems='center'
                                    justifyContent='center'
                                    gap={5}
                                    onPress={() => Linking.openURL(`tel:${etablissement.data.phone}`)}
                                >
                                    <Ionicons name='call' size={16} />
                                    <StyledText size={14} weight="semi-bold">
                                        {t('appeler')}
                                    </StyledText>
                                </Button>
                                <Button
                                    elevation="$3"
                                    shadowColor="rgba(0, 0, 0, 0.5)"
                                    borderRadius={10}
                                    bg="#27CDFB"
                                    size="xl"
                                    h={50}
                                    w={'45%'}
                                    mb={5}
                                    flexDirection='row'
                                    alignItems='center'
                                    justifyContent='center'
                                    gap={5}
                                    onPress={toggleBottomSheet}
                                >
                                    <Ionicons name='navigate' size={16} />
                                    <StyledText size={14} weight="semi-bold">
                                        {t('allez_y')}
                                    </StyledText>
                                </Button>
                            </HStack>
                        )
                    }
                    {
                        etablissement?.data && (
                            <CustomBottomSheet isOpen={isBottomSheetOpen} onClose={onCloseBottomSheet} title={t('selectionner_une_action')}>
                                <LinkModalContent onClose={onCloseBottomSheet} long={etablissement.data.longitude} lat={etablissement.data.latitude} />
                            </CustomBottomSheet>
                        )
                    }
                    {
                        etablissement?.data && (
                            <CustomBottomSheet customSnapPoints={['100%', '100%']} isOpen={isRateBottomSheetOpen} onClose={onCloseRateBottomSheet} title={t('votre_avis')}>
                                <RateEtablissement setUpdateRatingState={setUpdateRatingState} onClose={onCloseRateBottomSheet} etablissement={etablissement.data} />
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