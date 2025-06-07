import { StackScreenProps } from '@react-navigation/stack';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StackParamList } from '../../navigation';
import { Box, FlatList, HStack, Image, KeyboardAvoidingView, View, VStack } from '@gluestack-ui/themed';
import { Keyboard, Platform, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { StackTabParamList } from '../../navigation/TabNavigation';
import { Pressable } from '@gluestack-ui/themed';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { ShopItem, ShopItemProps } from '../../components/ShopItem';
import mapStyles from '@/src/utils/mapStyles';
import * as Location from 'expo-location';
import { useGetCategoriesQuery, useGetEtablissementsQuery, useGetOptionsQuery, useLazyGetEtablissementsQuery } from '@/src/features/etablissement/etablissement.apiSlice';
import Colors from '@/constants/Colors';
import { Callout, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import config from '@/src/config';
import { StyledText } from '@/components/StyledText';
import { useAppDispatch, useAppSelector } from '@/src/store';
import { selectEtablissement, setMapEtablissements } from '@/src/features/etablissement/etablissement.slice';
import CustomBottomSheet from '@/components/CustomBottomSheet';
import FilterModalContent from '@/components/Home/FilterModalContent';
import { Category, GoogleMapsAdresse } from '@/src/types';
import AdresseSearchModalContent from '@/components/AdresseSearchModalContent';
import { useTranslation } from 'react-i18next';
import MapView, { AnimatedMapView } from 'react-native-maps/lib/MapView';

export default function MapsScreen({
    navigation,
}: StackScreenProps<StackTabParamList, 'maps'>) {

    const { t } = useTranslation();

    const mapViewRef = useRef<MapView>(null);

    const { mapEtablissements } = useAppSelector(selectEtablissement);

    const dispatch = useAppDispatch();

    const [location, setLocation] = useState<Location.LocationObject | null>(null);

    const [longitude, setLongitude] = useState<number>();
    const [latitude, setLatitude] = useState<number>();

    const [isLocatisLocationLoading, setLocatisLocationLoading] = useState(false);

    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

    const [distance, setDistance] = useState(0);

    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

    const [values, setValues] = useState([0, 99]);

    const [adresse, setAdresse] = useState("");

    const { data: categories } = useGetCategoriesQuery();
    const { data: options } = useGetOptionsQuery({});

    const [getEtablissements, { isFetching, isError }] = useLazyGetEtablissementsQuery();

    const { data, error, isLoading, isSuccess } = useGetEtablissementsQuery({
        longitude: location?.coords.longitude || null,
        latitude: location?.coords.latitude || null,
        distance: 0,
        min_age: 0,
        max_age: 99,
    });

    const [isBottomSheetOpen, setBottomSheetOpen] = useState(false);

    const [isAdresseBottomSheetOpen, setAdresseBottomSheetOpen] = useState(false);

    const toggleBottomSheet = () => {
        setBottomSheetOpen(!isBottomSheetOpen);
    };

    const toggleAdresseBottomSheet = () => {
        setAdresseBottomSheetOpen(!isAdresseBottomSheetOpen);
    };

    const onCloseAdresseBottomSheet = () => {
        setAdresseBottomSheetOpen(false);
    }

    const onCloseBottomSheet = () => {
        setBottomSheetOpen(false);
    }

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                return;
            } else {
                setLocatisLocationLoading(true);
            }

            Location.getCurrentPositionAsync({}).then((location) => {
                setLocation(location);
                setLongitude(location.coords.longitude);
                setLatitude(location.coords.latitude);
                setLocatisLocationLoading(false);
            }).catch(() => setLocatisLocationLoading(false));
        })();
    }, []);

    useEffect(() => {
        if (data?.data) {
            dispatch(setMapEtablissements(data.data));
        }
    }, [data])

    useEffect(() => {
        if (longitude && latitude) {
            mapViewRef.current?.setCamera({
                center: {
                    latitude: latitude,
                    longitude: longitude,
                },
                zoom: 16,
                heading: 0,
                pitch: 0,
            })
            getEtablissements({
                longitude: longitude || null,
                latitude: latitude || null,
                category: selectedCategory ? selectedCategory.id : undefined,
                distance,
                min_age: values[0],
                max_age: values[1],
                options: selectedOptions
            }).then((res) => {
                if (res.data?.data) {
                    dispatch(setMapEtablissements(res.data.data))
                }
            });
        }
    }, [longitude, latitude]);

    const renderItem = useMemo(() => ({ item, index }: { item: any, index: number }) => {
        return (
            //@ts-ignore
            <ShopItem key={index} width={270} onPress={() => navigation.navigate('etbs', { id: item.id, distance: item.distance })} etablissement={item} />
        )
    }, [mapEtablissements]);

    const handleDeleteFilter = () => {
        setSelectedCategory(null);
        setDistance(200)
        setValues([1, 99])
        setSelectedOptions([]);
        getEtablissements({
            longitude: location?.coords.longitude || null,
            latitude: location?.coords.latitude || null,
            distance
        }).then((res) => {
            if (res.data?.data) {
                dispatch(setMapEtablissements(res.data.data))
            }
        });
        toggleBottomSheet();
    }

    const handleSubmitFilter = ({ distance, category, options, ages }: { category?: string | null, distance?: number, options: any[], ages: number[] }) => {
        setDistance(distance || 200);
        setSelectedOptions(options);
        setValues(ages);
        let hisSelectedCategory: Category | null = null;
        if (categories?.data && category) {
            let selectedCategories = categories.data.filter((cat) => cat.id == category);
            if (selectedCategories.length > 0) {
                hisSelectedCategory = selectedCategories[0]
                setSelectedCategory(selectedCategories[0]);
            }
        }
        getEtablissements({
            longitude: longitude || null,
            latitude: latitude || null,
            category: hisSelectedCategory ? hisSelectedCategory.id : undefined,
            distance,
            min_age: ages[0],
            max_age: ages[1],
            options: options
        }).then((res) => {
            if (res.data?.data) {
                dispatch(setMapEtablissements(res.data.data))
            }
        });
        toggleBottomSheet();
    }

    const handleSearch = (adresse: GoogleMapsAdresse) => {
        setLongitude(adresse.lng);
        setLatitude(adresse.lat);
        setAdresse(adresse.formatted_address);
    }

    return (
        <KeyboardAvoidingView
            flex={1}
            enabled
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <TouchableWithoutFeedback
                onPress={Keyboard.dismiss}
            >
                <Box flex={1} bg='$light100' pt={Platform.OS == 'ios' ? 50 : 0} position='relative'>
                    <AnimatedMapView
                        showsUserLocation={false}
                        showsMyLocationButton={false}
                        userLocationPriority="high"
                        userLocationAnnotationTitle="Ceci est votre position actuelle"
                        userLocationCalloutEnabled
                        userLocationFastestInterval={30000}
                        showsCompass
                        ref={mapViewRef}
                        tintColor={Colors.light.primary}
                        provider={PROVIDER_GOOGLE}
                        style={styles.map}
                        initialCamera={
                            latitude && longitude
                                ? {
                                    center: {
                                        latitude: latitude,
                                        longitude: longitude,
                                    },
                                    zoom: 16,
                                    heading: 0,
                                    pitch: 0,
                                }
                                : undefined
                        }
                        customMapStyle={mapStyles}
                    >
                        {
                            (latitude && longitude) && (
                                <Marker
                                    coordinate={{
                                        longitude: longitude!,
                                        latitude: latitude!
                                    }}
                                >
                                    <View style={styles.customUserLocationMarker}>
                                        <View style={styles.innerCircle} />
                                    </View>
                                </Marker>
                            )
                        }
                        {mapEtablissements && mapEtablissements.map((etablissement, index) => (
                            <Marker
                                key={index}
                                coordinate={{
                                    latitude: etablissement.latitude,
                                    longitude: etablissement.longitude,
                                }}
                                title={etablissement.nom} // Customize as needed
                                description={etablissement.description} // Customize as needed
                            >
                                <Box alignItems='center'>
                                    <Box
                                        backgroundColor='#231F20'
                                        padding={5}
                                        rounded='$full'
                                    >
                                        {
                                            etablissement.images.length > 0 ?
                                                <Image
                                                    source={{ uri: `${config.apiURL}/etablissements/${etablissement.images[0].src}` }}
                                                    style={{ width: 28, height: 28 }}
                                                    resizeMode="cover"
                                                    rounded='$full'
                                                    alt='image'
                                                />
                                                :
                                                <Box w={28} h={28} backgroundColor='$light300' />
                                        }
                                    </Box>
                                    <Box
                                        width={0}
                                        height={0}
                                        borderLeftWidth={12}
                                        borderRightWidth={12}
                                        borderTopWidth={12}
                                        borderLeftColor={'transparent'}
                                        borderRightColor={'transparent'}
                                        borderTopColor={'#231F20'}
                                        mt={-4.5}
                                    />
                                </Box>
                                <Callout
                                    tooltip
                                    //@ts-ignore
                                    onPress={() => navigation.navigate('etbs', { id: etablissement.id, distance: etablissement.distance })}
                                >
                                    <Box
                                        backgroundColor="#fff"
                                        padding={10}
                                        borderRadius={8}
                                        shadowColor="#000"
                                        shadowOffset={{ width: 0, height: 2 }}
                                        shadowOpacity={0.3}
                                        shadowRadius={4}
                                        elevation={5}
                                        width={180}
                                    >
                                        <VStack gap={8}>
                                            {
                                                etablissement.images.length > 0 ?
                                                    <Image borderRadius={15} w={"100%"} h={110} source={{ uri: `${config.apiURL}/etablissements/${etablissement.images[0].src}` }} alt='boostage' />
                                                    :
                                                    <Box borderRadius={15} w={"100%"} h={110} backgroundColor='$light300' />
                                            }
                                            <StyledText size={14} weight='semi-bold'>{etablissement.nom}</StyledText>
                                            <StyledText size={12} weight='semi-bold' color={Colors.light.gray}>{t('a')} {etablissement.distance?.toFixed(0) || '-'} km</StyledText>
                                            <StyledText size={12} weight='semi-bold' color={Colors.light.gray}>{etablissement.category.titre}</StyledText>
                                        </VStack>
                                    </Box>
                                </Callout>
                            </Marker>
                        ))}
                    </AnimatedMapView>
                    <Box position="absolute" zIndex={50} top={44} width="$full">
                        <HStack justifyContent='space-between' mt={21} px={25} alignItems='center'>
                            <Pressable
                                bg="$primary"
                                w={32}
                                h={32}
                                rounded="$full"
                                justifyContent='center'
                                alignItems='center'
                                onPress={() => navigation.goBack()}
                            >
                                <Ionicons name='chevron-down' size={20} color={"#000"} />
                            </Pressable>
                            <Pressable
                                bg='$white'
                                w='60%'
                                justifyContent='center'
                                alignItems='center'
                                shadowColor="rgba(30, 30, 30, 0.3)"
                                shadowOffset={{ width: 0, height: 3 }}
                                shadowOpacity={0.27}
                                shadowRadius={4.65}
                                elevation={6}
                                height={50}
                                flexDirection='row'
                                gap={5}
                                rounded='$full'
                                onPress={toggleAdresseBottomSheet}
                            >
                                <Ionicons name='search' size={18} color={Colors.light.text} />
                                <StyledText size={14}>{adresse.length > 25 ? adresse.slice(0, 23) + '...' : adresse || t('entrez_une_adresse')}</StyledText>
                            </Pressable>
                            <Pressable
                                bg="$primary"
                                w={32}
                                h={32}
                                rounded="$full"
                                justifyContent='center'
                                alignItems='center'
                                onPress={toggleBottomSheet}
                            >
                                <FontAwesome name='sliders' size={16} color={"#000"} />
                            </Pressable>
                        </HStack>
                    </Box>

                    <FlatList
                        position='absolute'
                        bottom={40}
                        pl={25}
                        horizontal
                        data={mapEtablissements}
                        renderItem={renderItem}
                        ItemSeparatorComponent={() => <Box w={15} />}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingRight: 50 }}
                    />
                    <CustomBottomSheet customSnapPoints={['100%', '100%']} isOpen={isBottomSheetOpen} onClose={onCloseBottomSheet} title={t('filtre')}>
                        <FilterModalContent
                            handleFilter={handleSubmitFilter}
                            selectedCategory={selectedCategory}
                            distance={distance}
                            categories={categories?.data || []}
                            chosenOptions={selectedOptions}
                            options={options?.data || []}
                            minAge={values[0]}
                            maxAge={values[1]}
                            handleDeleteFilter={() => { handleDeleteFilter(); onCloseBottomSheet() }}
                        />
                    </CustomBottomSheet>
                    <CustomBottomSheet customSnapPoints={['100%', '100%']} isOpen={isAdresseBottomSheetOpen} onClose={onCloseAdresseBottomSheet} title={t('adresse')}>
                        <AdresseSearchModalContent
                            handleFilter={handleSearch}
                            onClose={onCloseAdresseBottomSheet}
                        />
                    </CustomBottomSheet>
                </Box>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}
const styles = StyleSheet.create({
    contenaire: {

    },
    map: {
        ...StyleSheet.absoluteFillObject,
        bottom: -30,
    },
    container: {
        flex: 1,
        position: 'relative',
    },
    customUserLocationMarker: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: 'rgba(0, 122, 255, 0.3)', // Light blue with some transparency for outer circle
        alignItems: 'center',
        justifyContent: 'center',
    },
    innerCircle: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#007AFF', // Blue color for inner circle
    },
});