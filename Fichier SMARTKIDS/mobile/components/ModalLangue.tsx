import { Modal, Pressable, StyleSheet, SafeAreaView, TextInput, StyleProp, TextStyle } from "react-native";
import { ReactNode, SetStateAction, useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { Box, Button } from "@gluestack-ui/themed";
import Colors from "@/constants/Colors";
import Checkbox from "expo-checkbox";
import { StyledText } from "./StyledText";
import { Ionicons } from "@expo/vector-icons";

export type ChexBoxAreaProps = {
    title?: string,
    label: string,
    width?: any,
    textStyle?: StyleProp<TextStyle>,
    leftWidget?: ReactNode,
    handleChangeBool: ((bool: boolean) => void) | undefined,
    bool: boolean,
    touched: any,
    errors: any,
    backgroundColorLigth?: string,
    backgroundColorDark?: string,
    colorName?: keyof typeof Colors.light | keyof typeof Colors.dark,
    backgroundColorName?: keyof typeof Colors.light | keyof typeof Colors.dark,
}

export type ModalLangueProps = {
    setIsModalVisible: React.Dispatch<React.SetStateAction<boolean>>,
    isModalVisible: boolean,
}

const ModalLangue = (props: ModalLangueProps) => {

    const { isModalVisible, setIsModalVisible } = props;

    const { t, i18n } = useTranslation();

    const [selectLanguage, setSelectLanguage] = useState(i18n.language);

    const handleChangeLanguage = () => {
        i18n.changeLanguage(selectLanguage);
        setIsModalVisible(false);
    }

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isModalVisible}
        >
            <SafeAreaView style={styles.modalContainer}>
                <Box style={styles.modalContent}>
                    <Pressable onPress={() => { setIsModalVisible(false); setSelectLanguage(i18n.language) }} style={{ padding: 10, marginBottom: 0, position: "absolute", right: 10, top: 10 }}>
                        <Ionicons name='close' size={25} />
                    </Pressable>
                    <Box style={{ justifyContent: 'center', alignItems: 'center', marginTop: 30, rowGap: 15 }}>
                        <Ionicons name='globe-outline' colorName='text' size={60} />
                        <StyledText size={20}>Langue</StyledText>
                        <Box style={{ width: "80%" }}>
                            <Box style={styles.containerList}>
                                <Pressable onPress={() => { setSelectLanguage("fr") }}>
                                    <ChexBoxArea textStyle={{ color: '#000' }} title={"Français (par défaut)"} label={"Français (par défaut)"} handleChangeBool={(value) => { setSelectLanguage("fr") }} bool={selectLanguage == "fr"} touched={undefined} errors={undefined} />
                                </Pressable>
                                <Pressable onPress={() => { setSelectLanguage("en") }}>
                                    <ChexBoxArea title={"Anglais"} label={"Anglais"} handleChangeBool={(value) => { setSelectLanguage("en") }} bool={selectLanguage == "en"} touched={undefined} errors={undefined} />
                                </Pressable>
                            </Box>
                        </Box>
                        <Box style={{ width: "100%", paddingHorizontal: 20, marginTop: 20 }}>
                            <Button
                                backgroundColor="$primary"
                                onPress={handleChangeLanguage}
                            >
                                <StyledText weight='semi-bold' size={14}>Enregistrer</StyledText>
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </SafeAreaView>
        </Modal>
    );
}

const ChexBoxArea = (props: ChexBoxAreaProps) => {
    const { title, textStyle, bool, errors, touched, handleChangeBool } = props;

    return (
        <Box style={{}}>
            <Box style={{ display: 'flex', flexDirection: 'row', gap: 10, justifyContent: 'space-between', alignItems: 'flex-start', width: "100%", backgroundColor: 'white', }}>
                <Checkbox
                    style={{ height: 20, width: 20, borderRadius: 100 }}
                    value={bool}
                    onValueChange={handleChangeBool}
                    color={bool ? 'rgba(229, 215, 197, 1)' : undefined}
                />
                <Box style={{ rowGap: 8, width: "100%" }}>
                    <StyledText weight='bold' size={16} style={[textStyle, { textAlign: 'left' }]}>
                        {title}
                    </StyledText>
                </Box>
            </Box>

            {touched && errors ? (
                <StyledText color='red' style={{ marginTop: 0 }}>{errors}</StyledText>
            ) : null}
        </Box>
    );
};

export default ModalLangue;

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        // height: "100%",
        width: "100%",
        // flexDirection: "column",
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    modalContent: {
        // padding: 20,
        width: "90%",
        flex: .6,
        // height: 300,
        borderRadius: 20,
        padding: 20,
        // borderTopRightRadius: 20,
        backgroundColor: '#FFF'
    },
    modalContent2: {
        // padding: 20,
        width: "90%",
        flex: .4,
        // height: 300,
        borderRadius: 20,
        padding: 20
        // borderTopRightRadius: 20,
    },
    containerList: {
        rowGap: 30,
        columnGap: 20,
        flexDirection: 'column',
        marginTop: 30
    }
});  