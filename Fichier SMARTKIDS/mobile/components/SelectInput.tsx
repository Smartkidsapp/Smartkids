import { Box, EyeIcon, EyeOffIcon, Input, InputField, InputSlot, LockIcon, Modal, SafeAreaView, View, VStack } from '@gluestack-ui/themed';
import React, { ComponentProps, ReactNode, Ref, useState } from 'react';
import { StyleProp, TextInput, TextInputProps, TextStyle, StyleSheet } from 'react-native';
import { StyledText } from './StyledText';
import { Ionicons } from '@expo/vector-icons';
import { FlatList } from 'react-native';
import { Pressable } from '@gluestack-ui/themed';

const BORDER_COLOR_DEFAULT = 'rgba(8, 33, 45, 0.3)';
const BORDER_COLOR_FILLED = 'rgba(8, 33, 45, 1)';
const BORDER_COLOR_DANGER = 'rgba(226, 3, 29, 1)';

export type SelectInputProps = {
    label: string;
    width?: any;
    textStyle?: StyleProp<TextStyle>;
    leftWidget?: ReactNode;
    data: {
        value: string;
        name: string;
    }[],
    value: string;
    error?: string;
    handleChangeText: (item: { value: string; name: string }) => void
}

export default function SelectInput({
    label,
    width,
    textStyle,
    leftWidget,
    data,
    value,
    error,
    handleChangeText,
    ...props
}: SelectInputProps) {

    const [modalVisible, setModalVisible] = useState(false);

    const [searchQuery, setSearchQuery] = useState('');

    const [filteredData, setFilteredData] = useState(data);

    const openModal = () => {
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
    };

    const renderItem = ({ item }: any) => (
        <Pressable onPress={() => handleItemPress(item)} style={{ padding: 15 }}>
            <StyledText>{item.name}</StyledText>
        </Pressable>
    );

    const handleItemPress = (item: any) => {
        handleChangeText(item);
        closeModal();
    };

    const onChangeSearch = (query: string) => {
        setSearchQuery(query);
        if (query.length > 0) {
            const resultFilteredData = data.filter((item) =>
                item.name.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredData(resultFilteredData);
        } else {
            setFilteredData(data);
        }
    }

    return (
        <>
            <VStack space="xs" w={width}>
                {label ? <StyledText weight="medium">{label}</StyledText> : null}

                <Pressable
                    h={50}
                    alignItems="center"
                    borderRadius={10}
                    backgroundColor='$coolGray100'
                    flexDirection='row'
                    justifyContent='space-between'
                    onPress={openModal}
                    paddingHorizontal={10}
                >
                    <StyledText size={12}>{value}</StyledText>
                    <Ionicons name='chevron-down' size={12} />
                </Pressable>

                {error ? (
                    <StyledText size={10} color={BORDER_COLOR_DANGER}>
                        {error}
                    </StyledText>
                ) : null}
            </VStack>

            <Modal
                isOpen={modalVisible}
            >
                <SafeAreaView style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Pressable onPress={closeModal} style={{ padding: 10, marginBottom: 0, position: "absolute", right: 10, top: 10 }}>
                            <Ionicons name='close' size={25} />
                        </Pressable>
                        <View style={styles.searchBarContainer}>
                            <TextInput
                                style={styles.searchBar}
                                placeholder={'rechercher'}
                                placeholderTextColor="#9399A8"
                                value={searchQuery}
                                onChangeText={onChangeSearch}
                            />
                        </View>
                        <FlatList
                            style={{ paddingTop: 15 }}
                            data={filteredData}
                            renderItem={renderItem}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    </View>
                </SafeAreaView>
            </Modal>
        </>
    );
}

// define your styles
const styles = StyleSheet.create({
    container: {
        height: 50,
        maxHeight: 60,
        flex: 1,
        borderBottomColor: '#DDE0E7',
        borderBottomWidth: 1,
        justifyContent: 'center',
        flexShrink: 0,
    },
    textFloting: {
        top: -10,
        position: 'absolute',
    },
    modalContainer: {
        flex: 1,
        // height: "100%",
        width: "100%",
        // flexDirection: "column",
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    modalContent: {
        width: "100%",
        flex: .8,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        backgroundColor: "#FFF"
    },
    searchBarContainer: {
        backgroundColor: '#EEEFF3',
        padding: 10,
        borderRadius: 10,
        marginTop: 40,
        height: 50
    },
    searchBar: {
        backgroundColor: 'transparent',
        borderRadius: 8,
        padding: 8,
        fontSize: 16,
        color: '#000'
    },
});