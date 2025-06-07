import { Box, Button, HStack, ScrollView } from '@gluestack-ui/themed';
import { Keyboard, KeyboardAvoidingView, Platform, Pressable, StyleSheet, TouchableWithoutFeedback, useWindowDimensions } from 'react-native';
import { StyledText } from '../../components/StyledText';
import { Fragment, useState } from 'react';
import EtbsLocationForm from '../../components/EtbsLocationForm';
import { useAppSelector } from '../../src/store';
import { selectEtablissement } from '../../src/features/etablissement/etablissement.slice';
import Colors from '../../constants/Colors';
import { useTranslation } from 'react-i18next';

interface componentNameProps {
    onChangeIndex: () => void,
    handleBack: () => void
}

const EditStep5 = (props: componentNameProps) => {

    const { t } = useTranslation();

    const { createEtablissement, editEtablissement } = useAppSelector(selectEtablissement);
    const { onChangeIndex, handleBack } = props;
    const { width } = useWindowDimensions();
    const [adresse, setAdresse] = useState(createEtablissement?.adresse);

    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1, width: '100%' }}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <Fragment>
                    <Box flex={1}>
                        <Box w={width} px={24}>
                            <StyledText size={20} weight='semi-bold'>{t('etablissement_situer')}</StyledText>
                            <EtbsLocationForm w={"100%"} value={adresse} onChangeLocation={setAdresse}/>
                        </Box>
                    </Box>
                    <HStack px={24} pt={16} pb={Platform.OS == 'android' ? 16 : 0} alignItems='center' justifyContent='space-between'>
                        <Pressable onPress={handleBack}>
                            <StyledText size={14} weight='semi-bold'>{t('retour')}</StyledText>
                        </Pressable>
                        <Button
                            height={50}
                            width='auto'
                            px={50}
                            borderRadius={10}
                            bgColor={createEtablissement?.longitude ? '$primary' : '$light200'}
                            onPress={() => createEtablissement?.longitude && onChangeIndex()}
                        >
                            <StyledText size={14} color={createEtablissement?.longitude ? '#000' : Colors.light.gray} weight='semi-bold'>{t('next')}</StyledText>
                        </Button>
                    </HStack>
                </Fragment>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};


export default EditStep5;

const styles = StyleSheet.create({
    container: {
        padding: 10,
        rowGap: 20,
        columnGap: 30,
        flexDirection: 'row',
        flexWrap: 'wrap'
    }
});
