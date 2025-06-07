import { Box, Button, HStack, Icon, Image, Pressable, ScrollView, VStack } from '@gluestack-ui/themed';
import { ActivityIndicator, FlatList, Keyboard, KeyboardAvoidingView, Platform, StyleSheet, TouchableWithoutFeedback, useWindowDimensions } from 'react-native';
import { StyledText } from '../../components/StyledText';
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useGetCategoriesQuery } from '../../src/features/etablissement/etablissement.apiSlice';
import { Category } from '../../src/types';
import Colors from '../../constants/Colors';
import { useAppDispatch, useAppSelector } from '../../src/store';
import { selectEtablissement, setCreateEtablissement } from '../../src/features/etablissement/etablissement.slice';
import { useTranslation } from 'react-i18next';

interface componentNameProps {
    onChangeIndex: () => void,
}

interface ParkingItemProps {
    id: string;
    title: string;
}

const EditStep1 = (props: componentNameProps) => {

    const { t, i18n } = useTranslation();

    const dispatch = useAppDispatch();
    const { editEtablissement, createEtablissement } = useAppSelector(selectEtablissement);
    const { onChangeIndex } = props;
    const { width } = useWindowDimensions();

    useEffect(() => {
        dispatch(setCreateEtablissement({category: editEtablissement?.category.id}));
    }, [editEtablissement])

    const onSubmit = () => {
        if(editEtablissement?.category) {
            onChangeIndex();
        }
    };

    const { data, isLoading } = useGetCategoriesQuery();

    const ParkingItem = useMemo(() => ({ item }: { item: Category }) => {

        const handlePress = useCallback(() => {
            dispatch(setCreateEtablissement({ category: item.id }));
        }, [dispatch, item.id]);

        return (
            <Pressable
                flex={1}
                onPress={handlePress}
            >
                <Box
                    flex={1}
                    borderWidth={2}
                    borderColor={createEtablissement?.category === item.id ? '$primary' : 'gray.300'}
                    borderRadius={10}
                    px={13}
                    py={16}
                    backgroundColor="white"
                >
                    <HStack alignItems="center" space="sm">
                        <Image source={{uri: item.icon?.src}} style={{height: 24, width: 24}}/>
                        <StyledText size={14} weight='semi-bold'>{i18n.language == "fr" ? item.titre : item.titre_en}</StyledText>
                    </HStack>
                </Box>
            </Pressable>
        );
    }, [dispatch, createEtablissement, editEtablissement]);

    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1, width: '100%' }}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <Fragment>
                    <ScrollView contentContainerStyle={{ paddingBottom: 150 }}>
                        <Box w={width} px={24}>
                            <StyledText size={20} weight='semi-bold'>{t('laquelle_de_ces_propositions')}</StyledText>
                            <VStack space="md" w={"100%"} mt={32}>
                                {
                                    isLoading && (
                                        <ActivityIndicator color={Colors.light.gray} size="large" />
                                    )
                                }
                                <FlatList
                                    data={[...data?.data ?? []].sort((a, b) => i18n.language == 'fr' ? a.titre.localeCompare(b.titre):  a.titre_en?.localeCompare(b.titre_en))}
                                    keyExtractor={(item: Category) => item.id}
                                    renderItem={({ item }: { item: Category }) => <ParkingItem key={item.id} item={item} />}
                                    numColumns={2}
                                    columnWrapperStyle={{
                                        justifyContent: 'space-between',
                                        marginBottom: 16, // Adds space between rows
                                        gap: 16
                                    }}
                                />
                            </VStack>
                        </Box>
                    </ScrollView>
                    <HStack px={24} pt={16} pb={Platform.OS == 'android' ? 16 : 0} alignItems='center' justifyContent='flex-end'>
                        <Button
                            height={50}
                            width='auto'
                            px={50}
                            borderRadius={10}
                            bgColor={editEtablissement?.category ? '$primary' : '$light200'}
                            onPress={onSubmit}
                        >
                            <StyledText size={14} color={editEtablissement?.category ? '#000' : Colors.light.gray} weight='semi-bold'>{t('next')}</StyledText>
                        </Button>
                    </HStack>
                </Fragment>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};

export default EditStep1;

const styles = StyleSheet.create({
    container: {
        padding: 10,
        rowGap: 20,
        columnGap: 30,
        flexDirection: 'row',
        flexWrap: 'wrap'
    }
});
