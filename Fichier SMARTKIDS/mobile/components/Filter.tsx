import { ArrowRightIcon, Box, Button, ChevronLeftIcon, ChevronsLeftIcon, HStack, KeyboardAvoidingView, Pressable, ScrollView, VStack } from '@gluestack-ui/themed';
import { StackScreenProps } from '@react-navigation/stack';
import React, { Fragment, useCallback, useRef, useState } from 'react';
import { Image, ImageBackground, ImageSourcePropType, Keyboard, Platform, StyleSheet, TextInput, TouchableOpacity, TouchableWithoutFeedback, useWindowDimensions } from 'react-native';
import { StackParamList } from '../navigation';
import { StyledText } from './StyledText';
import Swiper from 'react-native-swiper';
import { View } from 'react-native';
import ControlledTextInput from './ControlledTextInput';
import { useForm } from 'react-hook-form';
import { Ionicons } from '@expo/vector-icons';
import SelectInput from './SelectInput';
import countries from "../utils/countries.json";
import { useNavigation } from '@react-navigation/native';
import AppInput from './AppInput';
import { Category } from '../screens/SignupStepScreen';

interface FilterProps {
    onClose: () => void
}

export default function Filter({
    onClose
}: FilterProps) {

    const categories: Category[] = [
        {
            id: 1,
            name: "Restaurants 🍝"
        },
        {
            id: 2,
            name: "Fast food 🍔"
        },
        {
            id: 3,
            name: "Pizzerias 🍕"
        },
        {
            id: 4,
            name: "Cafés et bistros ☕"
        },
        {
            id: 5,
            name: "Épiceries et marchés locaux 🥖"
        },
    ];

    return (
        <KeyboardAvoidingView
            flex={1}
            enabled
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <TouchableWithoutFeedback
                onPress={Keyboard.dismiss}
            >
                <Fragment>
                    <Box
                        flex={1}
                        backgroundColor='$light100'
                    >
                        <CustomHeader onClose={onClose} />
                        <ScrollView
                            contentContainerStyle={{
                                flexGrow: 1,
                                padding: 20,
                                rowGap: 10,
                            }}
                            showsVerticalScrollIndicator={false}
                        >
                            <HStack mt={16} justifyContent='space-between' alignItems='center'>
                                <StyledText weight="semi-bold" size={12}>Catégories populaires</StyledText>
                            </HStack>
                            <HStack gap={10} mt={16} flexWrap='wrap'>
                                {
                                    categories.map((category, key) => (
                                        <Box key={key} mt={5} alignItems='center' justifyContent='center' bg={'white'} py={8} px={10} borderRadius={30}>
                                            <StyledText size={10} weight='semi-bold'>{category.name}</StyledText>
                                        </Box>
                                    ))
                                }
                            </HStack>
                        </ScrollView>
                    </Box>
                </Fragment>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

const CustomHeader = ({ onClose }: { onClose: () => void }) => {

    const navigation = useNavigation();

    const handleBackPress = () => {
        navigation.goBack();
    };

    return (
        <View style={[styles.header]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: "100%" }}>
                <TouchableOpacity onPress={onClose} style={{ alignItems: 'center', padding: 10, width: '10%' }}>
                    <ChevronLeftIcon
                        width={28}
                        height={28}
                        color='$primary'
                    />
                </TouchableOpacity>
                <AppInput
                    icon={<Ionicons size={22} name='search-outline' />}
                    placeholder='Chercher de la nourriture'
                    containerBg="$primary0"
                    height={30}
                    width={"80%"}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 50,
        paddingBottom: 16,
        columnGap: 0,
        backgroundColor: '#FFF'
        // justifyContent: 'space-between',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        width: '100%',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    modalOption: {
        fontSize: 18,
        padding: 10,
        textAlign: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
});