import { StackScreenProps } from '@react-navigation/stack';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Box, Center, FlatList, HStack, ScrollView, SelectContent, SelectDragIndicator, SelectIcon, SelectInput, SelectItem, SelectPortal, Slider, SliderFilledTrack, View, VStack } from '@gluestack-ui/themed';
import { ActivityIndicator, Keyboard, Platform, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { StackTabParamList } from '../../navigation/TabNavigation';
import { Ionicons } from '@expo/vector-icons';
import { StyledText } from '../../components/StyledText';
import Colors from '../../constants/Colors';
import { Image } from '@gluestack-ui/themed';
import { Pressable } from '@gluestack-ui/themed';
import { useGetBoostedEtablissementsQuery, useGetCategoriesQuery, useGetEtablissementsQuery, useGetOptionsQuery, useLazyGetBoostedEtablissementsQuery, useLazyGetEtablissementsQuery, useLazyPaginateEtablissementsQuery } from '@/src/features/etablissement/etablissement.apiSlice';
import { Category, Etablissement } from '@/src/types';
import config from '@/src/config';
import * as Location from 'expo-location';
import { KeyboardAvoidingView } from '@gluestack-ui/themed';
import { useAppDispatch, useAppSelector } from '@/src/store';
import { selectEtablissement, setEtablissements, setEtbsNextPage } from '@/src/features/etablissement/etablissement.slice';
import { SearchEtablissementDto } from '@/src/features/etablissement/etablissement.request';
import { RefreshControl } from 'react-native-gesture-handler';
import CustomHomeHeader from '@/components/Home/CustomHomeHeader';
import VScrollLoader from '@/components/VScrollLoader';
import { calculateDistance } from '@/src/utils/distance';
import { useTranslation } from 'react-i18next';
import { FlashList, ListRenderItem } from "@shopify/flash-list";

export default function HomeScreen({
    navigation,
}: StackScreenProps<StackTabParamList, 'home'>) {

    const { t, i18n } = useTranslation();

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(20);
    const [hasMore, setHasMore] = useState(true);

    const [paginate, { isError, error, isFetching, isLoading }] = useLazyPaginateEtablissementsQuery();

    const [etablissements, setEtablissements] = useState<Etablissement[]>([]);

    const dispatch = useAppDispatch();

    const [location, setLocation] = useState<Location.LocationObject | null>(null);

    const [isLocatisLocationLoading, setLocatisLocationLoading] = useState(false);

    const [query, setQuery] = useState('');

    const [isRefresh, setIsRefresh] = useState(false);

    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
    const [distance, setDistance] = useState(0);
    const [values, setValues] = useState([0, 99]);
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);

    const { data: categories } = useGetCategoriesQuery();
    const { data: options } = useGetOptionsQuery({ category: selectedCategory?.id });

    const [getBoostedEtablissements, { isSuccess }] = useLazyGetBoostedEtablissementsQuery();

    const [boostedEtablissements, setBoostedEtablissements] = useState<Etablissement[]>([]);

    const { data: dataBoostedEtablissements, isLoading: isBoostLoading } = useGetBoostedEtablissementsQuery({
        longitude: location?.coords.longitude || null,
        latitude: location?.coords.latitude || null,
        distance
    });


    useEffect(() => {
        if (isError) {
            console.log(error);
        }
    }, [isError])

    useEffect(() => {
        if (dataBoostedEtablissements?.data) {
            setBoostedEtablissements(dataBoostedEtablissements?.data);
        }
    }, [dataBoostedEtablissements])

    useEffect(() => {
        dispatch(setEtbsNextPage(1));
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
            setKeyboardVisible(true);
        });
        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
            setKeyboardVisible(false);
        });

        return () => {
            keyboardDidHideListener.remove();
            keyboardDidShowListener.remove();
        };
    }, []);

    const toogleCategory = (category: Category) => {
        setSelectedCategory(category)
    }

    const handleDeleteFilter = () => {
        dispatch(setEtbsNextPage(1));
        setPage(1);
        setLimit(20);
        setSelectedCategory(null);
        setDistance(0)
        setValues([0, 99])
        setSelectedOptions([]);
        paginate({
            longitude: location?.coords.longitude || null,
            latitude: location?.coords.latitude || null,
            distance: 0,
            min_age: 0,
            max_age: 99,
            page: 1,
            limit: 20
        }).then((res) => {
            if ("data" in res && res.data) {
                setPage(+res.data.data.page);
                setHasMore(
                    res.data.data.totalPages > 0 && res.data.data.page <= res.data.data.totalPages - 1
                );
                setEtablissements(res.data.data.items);
            }
        });
    }

    const handleFilter = ({ distance, category, options, ages }: { category?: string | null, distance?: number, options: any[], ages: number[] }) => {
        dispatch(setEtbsNextPage(1));
        setPage(1);
        setLimit(20);
        setDistance(distance || 0);
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
        paginate({
            longitude: location?.coords.longitude || null,
            latitude: location?.coords.latitude || null,
            category: hisSelectedCategory ? hisSelectedCategory.id : undefined,
            distance: distance,
            min_age: ages[0],
            max_age: ages[1],
            options: options,
            page: 1,
            limit: 20
        }).then((res) => {
            if ("data" in res && res.data) {
                setPage(+res.data.data.page);
                setHasMore(
                    res.data.data.totalPages > 0 && res.data.data.page <= res.data.data.totalPages - 1
                );
                setEtablissements(res.data.data.items);
            }
        });
    }

    const refetch = () => {
        dispatch(setEtbsNextPage(1));
        setIsRefresh(true);
        setPage(1);
        setLimit(20);
        const params: SearchEtablissementDto = { page: 1, limit: 20, distance, min_age: values[0], max_age: values[1] };

        if (selectedCategory) {
            params.category = selectedCategory.id;
        }

        if (selectedOptions.length > 0) {
            params.options = selectedOptions;
        }

        if (location?.coords) {
            params.longitude = location?.coords.longitude;
            params.latitude = location?.coords.latitude;
        }

        paginate({
            ...params,
            page: 1,
            limit: 20
        }).then((res) => {
            setIsRefresh(false)
            if ("data" in res && res.data) {
                setPage(+res.data.data.page);
                setHasMore(
                    res.data.data.totalPages > 0 && res.data.data.page <= res.data.data.totalPages - 1
                );
                setEtablissements(res.data.data.items);
            }
        }).catch(() => setIsRefresh(false));

        getBoostedEtablissements({
            longitude: location?.coords.longitude || null,
            latitude: location?.coords.latitude || null,
        }).then((res) => {
            setBoostedEtablissements(res.data?.data || [])
        })
    }

    const handleSearch = (text: string) => {
        dispatch(setEtbsNextPage(1));
        if (text.length > 2) {
            paginate({
                category: selectedCategory ? selectedCategory.id : undefined,
                nom: text,
                longitude: location?.coords.longitude || null,
                latitude: location?.coords.latitude || null,
                distance,
                min_age: values[0],
                max_age: values[1],
                options: selectedOptions,
                page: 1,
                limit: 20
            }).then((res) => {
                if ("data" in res && res.data) {
                    setPage(+res.data.data.page);
                    setHasMore(
                        res.data.data.totalPages > 0 && res.data.data.page <= res.data.data.totalPages - 1
                    );
                    setEtablissements(res.data.data.items);
                }
            });
        } else {
            paginate({
                longitude: location?.coords.longitude || null,
                latitude: location?.coords.latitude || null,
                distance,
                min_age: values[0],
                max_age: values[1],
                options: selectedOptions,
                page: 1,
                limit: 20
            }).then((res) => {
                if ("data" in res && res.data) {
                    setPage(+res.data.data.page);
                    setHasMore(
                        res.data.data.totalPages > 0 && res.data.data.page <= res.data.data.totalPages - 1
                    );
                    setEtablissements(res.data.data.items);
                }
            });
        }
    }

    useEffect(() => {
        dispatch(setEtbsNextPage(1));
        setQuery("");
        if (selectedCategory) {
            paginate({
                category: selectedCategory.id,
                longitude: location?.coords.longitude || null,
                latitude: location?.coords.latitude || null,
                distance,
                min_age: values[0],
                max_age: values[1],
                options: selectedOptions,
                page: 1,
                limit: 20
            }).then((res) => {
                if ("data" in res && res.data) {
                    setPage(+res.data.data.page);
                    setHasMore(
                        res.data.data.totalPages > 0 && res.data.data.page <= res.data.data.totalPages - 1
                    );
                    setEtablissements(res.data.data.items);
                }
            });
        } else {
            paginate({
                longitude: location?.coords.longitude || null,
                latitude: location?.coords.latitude || null,
                distance,
                min_age: values[0],
                max_age: values[1],
                page: 1,
                limit: 20
            }).then((res) => {
                if ("data" in res && res.data) {
                    setPage(+res.data.data.page);
                    setHasMore(
                        res.data.data.totalPages > 0 && res.data.data.page <= res.data.data.totalPages - 1
                    );
                    setEtablissements(res.data.data.items);
                }
            });
        }
    }, [selectedCategory])

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
                setLocatisLocationLoading(false);
                paginate({
                    longitude: location?.coords.longitude || null,
                    latitude: location?.coords.latitude || null,
                    distance: 0,
                    min_age: 0,
                    max_age: 99,
                    page: 1,
                    limit: 20
                }).then((res) => {
                    if ("data" in res && res.data) {
                        setPage(+res.data.data.page);
                        setHasMore(
                            res.data.data.totalPages > 0 && res.data.data.page <= res.data.data.totalPages - 1
                        );
                        setEtablissements(res.data.data.items);
                    }
                });
            }).catch(() => setLocatisLocationLoading(false));
        })();
    }, []);

    const loadMore = useCallback(() => {
        if (hasMore) {
            paginate({
                category: selectedCategory ? selectedCategory.id : undefined,
                nom: query.length > 2 ? query : "",
                longitude: location?.coords.longitude || null,
                latitude: location?.coords.latitude || null,
                distance,
                min_age: values[0],
                max_age: values[1],
                options: selectedOptions,
                page: page + 1,
                limit: 20
            }).then((res) => {
                if ("data" in res && res.data) {
                    setPage(+res.data.data.page);
                    setHasMore(
                        res.data.data.totalPages > 0 && res.data.data.page <= res.data.data.totalPages - 1
                    );
                    if (res.data.data?.items) {
                        console.log(res.data.data.items.length);
                        //@ts-ignore
                        setEtablissements(prevState => [...prevState, ...res.data.data.items]);
                    }
                }
            });
        }
    }, [page, hasMore, query, selectedCategory, location]);

    const renderitem: ListRenderItem<Etablissement> = useCallback(
        ({ item, index }) => (
            <Pressable
                key={index}
                flex={1}
                //@ts-ignore
                onPress={() => navigation.navigate('etbs', { id: item.id, distance: item.distance })}
                style={{ marginHorizontal: 8, marginBottom: 8 }}
            >
                <VStack gap={8}>
                    {
                        item.images.length > 0 ?
                            <Image borderRadius={15} w={"100%"} h={190} source={{ uri: `${config.apiURL}/etablissements/${item.images[0].src}` }} alt='boostage' />
                            :
                            <Box borderRadius={15} w={"100%"} h={190} backgroundColor='$light300' />
                    }
                    <StyledText size={12} weight='semi-bold'>{item.nom}</StyledText>
                    <StyledText size={12} weight='semi-bold' color={Colors.light.gray}>{t('a')} {item.distance?.toFixed(0) || '-'} km</StyledText>
                    <StyledText size={12} weight='semi-bold' color={Colors.light.gray}>{i18n.language == 'fr' ? item.category.titre : item.category.titre_en}</StyledText>
                </VStack>
            </Pressable>
        ),
        [refetch]
    );

    const header = useMemo(() => {
        return (
            <>
                {
                    boostedEtablissements && boostedEtablissements.length > 0 && (
                        <Pressable
                            mb={32}
                            //@ts-ignore
                            onPress={() => navigation.navigate('etbs', { id: boostedEtablissements[0]._id, distance: location?.coords ? calculateDistance(boostedEtablissements[0].latitude, boostedEtablissements[0].longitude, location?.coords.latitude, location?.coords.longitude) : null })}
                        >
                            <VStack gap={8}>
                                <Image borderRadius={15} w={"100%"} h={160} source={{ uri: `${config.apiURL}/etablissements/${boostedEtablissements[0].images[0].src}` }} alt='boostage' />
                                <HStack justifyContent='space-between' alignItems='center'>
                                    <StyledText size={12} weight='semi-bold'>{boostedEtablissements[0].nom}</StyledText>
                                    {
                                        location?.coords && (
                                            <StyledText size={12} weight='semi-bold' color={Colors.light.gray}>{t('a')} {calculateDistance(boostedEtablissements[0].latitude, boostedEtablissements[0].longitude, location?.coords.latitude, location?.coords.longitude).toFixed(0)} km</StyledText>
                                        )
                                    }
                                </HStack>
                                <HStack justifyContent='space-between' alignItems='center'>
                                    <StyledText size={12} weight='semi-bold' color={Colors.light.gray}>{t('sponsorise')}</StyledText>
                                    <StyledText size={12} weight='semi-bold' color={Colors.light.gray}>{i18n.language == "fr" ? boostedEtablissements[0].category.titre : boostedEtablissements[0].category.titre_en}</StyledText>
                                </HStack>
                            </VStack>
                        </Pressable>
                    )
                }
                <HStack pb={8} pl={8}>
                    <StyledText size={14} weight='semi-bold'>{t('plus_proche')} {distance > 0 ? `(${distance} km)` : ''}</StyledText>
                    {
                        isFetching && (
                            <ActivityIndicator size='small' color={Colors.light.primary} />
                        )
                    }
                </HStack>
                {
                    isLoading || isLocatisLocationLoading && (
                        <VScrollLoader count={4} />
                    )
                }
                {
                    (!isLoading || !isFetching || !isLocatisLocationLoading) && etablissements?.length == 0 && (
                        <HStack
                            justifyContent='center'
                            alignItems='center'
                            mt={64}
                        >
                            <StyledText size={14}>{t('aucun_resultat')}</StyledText>
                        </HStack>
                    )
                }
            </>
        );
    }, [isLoading, etablissements]);

    const footer = useMemo(() => {
        //@ts-ignore
        if (!isLoading || etablissements.length > 0) {
            return null;
        }

        return (
            <Center>
                <ActivityIndicator size="small" color={Colors.light.primary} />
            </Center>
        );
    }, [isLoading, etablissements]);

    return (
        <KeyboardAvoidingView
            flex={1}
            enabled
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <TouchableWithoutFeedback
                onPress={Keyboard.dismiss}
            >
                <Box flex={1}>
                    <CustomHomeHeader
                        handleFilter={handleFilter}
                        selectedCategory={selectedCategory}
                        distance={distance}
                        handleDeleteFilter={handleDeleteFilter}
                        query={query}
                        categories={categories?.data || []}
                        options={options?.data || []}
                        chosenOptions={selectedOptions}
                        minAge={values[0]}
                        maxAge={values[1]}
                        setQuery={setQuery} handleSearch={handleSearch}
                    />
                    <Box>
                        <ScrollView bgColor="$white" pl={24}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            maxHeight={70}
                        >
                            <View style={styles.container}>
                                <Pressable
                                    style={styles.itemContainer}
                                    onPress={() => setSelectedCategory(null)}
                                >
                                    <Ionicons
                                        name="storefront-outline"
                                        size={24}
                                        color={!selectedCategory ? Colors.light.text : 'rgba(30, 30, 30, 0.6)'}
                                    />
                                    <StyledText
                                        style={styles.label}
                                        color={!selectedCategory ? Colors.light.text : 'rgba(30, 30, 30, 0.6)'}
                                        size={12}
                                        weight='semi-bold'
                                    >
                                        {t('tout')}
                                    </StyledText>
                                    {!selectedCategory && <View style={styles.activeUnderline} />}
                                </Pressable>
                                {[...categories?.data ?? []].sort((a, b) => i18n.language == 'fr' ? a.titre.localeCompare(b.titre) : a.titre_en?.localeCompare(b.titre_en)).map((categorie, index) => (
                                    <Pressable
                                        key={index}
                                        style={styles.itemContainer}
                                        onPress={() => toogleCategory(categorie)}
                                    >
                                        <Image source={{ uri: categorie.icon?.src }} style={{ height: 24, width: 24 }} alt="category" />
                                        <StyledText
                                            style={styles.label}
                                            color={selectedCategory && selectedCategory?.id == categorie.id ? Colors.light.text : 'rgba(30, 30, 30, 0.6)'}
                                            size={12}
                                            weight='semi-bold'
                                        >
                                            {i18n.language == "fr" ? categorie.titre : categorie.titre_en}
                                        </StyledText>
                                        {selectedCategory && selectedCategory?.id == categorie.id && <View style={styles.activeUnderline} />}
                                    </Pressable>
                                ))}
                            </View>
                        </ScrollView>
                    </Box>
                    <Pressable
                        minHeight={"100%"}
                    >
                        <HStack px={16} justifyContent='space-between' flexWrap='wrap'>

                            <FlashList
                                showsVerticalScrollIndicator={false}
                                data={etablissements}
                                numColumns={2}
                                onRefresh={refetch}
                                refreshing={false}
                                onEndReached={loadMore}
                                onEndReachedThreshold={0.4}
                                contentContainerStyle={{ paddingBottom: 350, paddingVertical: 16 }}
                                ListHeaderComponent={header}
                                ListFooterComponent={footer}
                                renderItem={renderitem}
                                keyExtractor={({ id }) => id}
                                estimatedItemSize={164}
                            />
                        </HStack>
                    </Pressable>
                    {isKeyboardVisible && (
                        <Box
                            position='absolute'
                            top={111}
                            left={0}
                            bottom={0}
                            right={0}
                            zIndex={1000}
                            backgroundColor={'rgba(255, 255, 255, 0.9)'}
                        />
                    )}
                </Box>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        height: 70,
        maxHeight: 70,
        marginRight: 32
    },
    itemContainer: {
        alignItems: 'center',
        width: 'auto',
        marginRight: 16
    },
    label: {
        marginTop: 8,
    },
    activeUnderline: {
        marginTop: 8,
        height: 2,
        width: '100%',
        backgroundColor: Colors.light.text, // Use theme.colors.primary if you want to match the theme
    },
});