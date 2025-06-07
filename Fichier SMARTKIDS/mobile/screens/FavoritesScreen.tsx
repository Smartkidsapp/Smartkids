import { StackScreenProps } from '@react-navigation/stack';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Box, HStack, ScrollView, SelectContent, SelectDragIndicator, SelectIcon, SelectInput, SelectItem, SelectPortal, Slider, SliderFilledTrack, View, VStack } from '@gluestack-ui/themed';
import { ActivityIndicator, Keyboard, Platform, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { StackTabParamList } from '../navigation/TabNavigation';
import { Ionicons } from '@expo/vector-icons';
import { StyledText } from '../components/StyledText';
import Colors from '../constants/Colors';
import { Image } from '@gluestack-ui/themed';
import { Pressable } from '@gluestack-ui/themed';
import { useFavoriteMutation, useGetBoostedEtablissementsQuery, useGetCategoriesQuery, useGetEtablissementsQuery, useGetUserFavoritesQuery, useLazyGetBoostedEtablissementsQuery, useLazyGetEtablissementsQuery, useLazyGetUserFavoritesQuery } from '@/src/features/etablissement/etablissement.apiSlice';
import { Category, Etablissement, Favorite } from '@/src/types';
import config from '@/src/config';
import * as Location from 'expo-location';
import { KeyboardAvoidingView } from '@gluestack-ui/themed';
import { useAppDispatch, useAppSelector } from '@/src/store';
import { selectEtablissement, setEtbsNextPage } from '@/src/features/etablissement/etablissement.slice';
import { SearchEtablissementDto } from '@/src/features/etablissement/etablissement.request';
import { RefreshControl } from 'react-native-gesture-handler';
import CustomHomeHeader from '@/components/Home/CustomHomeHeader';
import VScrollLoader from '@/components/VScrollLoader';
import { calculateDistance } from '@/src/utils/distance';
import { StackParamList } from '@/navigation';
import { useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

export default function FavoritesScreen({
    navigation,
}: StackScreenProps<StackParamList, 'favorites'>) {

    const { i18n } = useTranslation();

    const [location, setLocation] = useState<Location.LocationObject | null>(null);

    const [isLocatisLocationLoading, setLocatisLocationLoading] = useState(false);

    const [favorites, setFavotites] = useState<Favorite[]>([]);

    const [isRefresh, setIsRefresh] = useState(false);

    const [refetchFavorite, { isFetching, isError, error }] = useLazyGetUserFavoritesQuery();

    const [requestFavorite, { isLoading: isFavoriteLoading }] = useFavoriteMutation();

    const { data, isLoading } = useGetUserFavoritesQuery();

    useFocusEffect(
        useCallback(() => {
            refetchFavorite().then((res) => {
                if (res.data) {
                    setFavotites(res.data.data);
                }
            })
            return () => {
            };
        }, [])
    );

    useEffect(() => {
        if (data?.data) {
            setFavotites(data.data)
        }
    }, [data])

    const refetch = () => {
        setIsRefresh(true);
        refetchFavorite()
            .then((res) => {
                if (res.data) {
                    setFavotites(res.data.data)
                }
            })
            .catch(() => setIsRefresh(false));

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
                setLocatisLocationLoading(false);
            }).catch(() => setLocatisLocationLoading(false));
        })();
    }, []);

    const removeFavorite = (id: string) => {
        requestFavorite({ etablissementId: id }).then(() => {
            const filteredFavorites = favorites.filter((favori) => favori.etablissement && favori.etablissement.id != id);
            setFavotites(filteredFavorites);
        })
    }

    return (
        <KeyboardAvoidingView
            flex={1}
            enabled
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <TouchableWithoutFeedback
                onPress={Keyboard.dismiss}
            >
                <Box flex={1}>
                    <ScrollView
                        px={24}
                        py={24}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 350, flexGrow: 1 }}
                        refreshControl={
                            <RefreshControl refreshing={isRefresh} onRefresh={refetch} />
                        }
                    >
                        <Pressable
                            minHeight={"100%"}
                        >
                            {
                                isLoading && (
                                    <VScrollLoader count={4} />
                                )
                            }
                            {
                                !isFetching && (
                                    <HStack justifyContent='space-between' flexWrap='wrap'>
                                        {
                                            favorites?.map((favorite, key) => {
                                                if (favorite.etablissement) {
                                                    return (
                                                        <Pressable
                                                            w={"48%"}
                                                            mt={16}
                                                            key={key}
                                                            //@ts-ignore
                                                            onPress={() => navigation.navigate('etbs', { id: favorite.etablissement?.id, distance: favorite.etablissement?.distance })}
                                                        >
                                                            <VStack gap={8}>
                                                                <Pressable
                                                                    position='absolute'
                                                                    rounded="$full"
                                                                    right={5}
                                                                    top={5}
                                                                    onPress={() => removeFavorite(favorite?.etablissement.id)}
                                                                    zIndex={1000}
                                                                >
                                                                    {
                                                                        isFavoriteLoading ?
                                                                            <ActivityIndicator color={Colors.light.textPrimary} size="small" />
                                                                            :
                                                                            <Ionicons name='heart' size={28} color={Colors.light.textPrimary} />
                                                                    }
                                                                </Pressable>
                                                                {
                                                                    favorite.etablissement.images.length > 0 ?
                                                                        <Image borderRadius={15} w={"100%"} h={190} source={{ uri: favorite.etablissement?.images[0].src }} alt='boostage' />
                                                                        :
                                                                        <Box borderRadius={15} w={"100%"} h={190} backgroundColor='$light300' />
                                                                }
                                                                <StyledText size={12} weight='semi-bold'>{favorite.etablissement?.nom}</StyledText>
                                                                <StyledText size={12} weight='semi-bold' color={Colors.light.gray}>{i18n.language == 'fr' ? favorite.etablissement?.category.titre : favorite.etablissement?.category.titre_en}</StyledText>
                                                            </VStack>
                                                        </Pressable>
                                                    )
                                                }
                                            })
                                        }
                                    </HStack>
                                )
                            }
                            {
                                (!isLoading || !isFetching || !isLocatisLocationLoading) && favorites?.length == 0 && (
                                    <HStack
                                        justifyContent='center'
                                        alignItems='center'
                                        mt={64}
                                    >
                                        <StyledText size={14}>Aucun favori!</StyledText>
                                    </HStack>
                                )
                            }
                        </Pressable>
                    </ScrollView>
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