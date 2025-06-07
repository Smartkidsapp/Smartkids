import { Box, Button, HStack, ScrollView } from '@gluestack-ui/themed';
import { Keyboard, KeyboardAvoidingView, Platform, StyleSheet, TouchableWithoutFeedback, useWindowDimensions } from 'react-native';
import { StyledText } from '../../components/StyledText';
import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';

interface componentNameProps {
    onChangeIndex: () => void
}

const Step0 = (props: componentNameProps) => {

    const { t } = useTranslation();

    const { onChangeIndex } = props;
    const { width } = useWindowDimensions();

    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1, width: '100%' }}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <Fragment>
                    <ScrollView maxHeight={"90%"}>
                        <Box w={width} px={24} mt={32}>
                            <StyledText size={20} weight='semi-bold'>{t('commencer_sur')} SMARTKIDS</StyledText>
                            <StyledText size={14} weight='semi-bold' style={{ marginTop: 32 }}>1. {t('presentation_de_votre_etablissement')} </StyledText>
                            <StyledText size={14} style={{ marginTop: 16, lineHeight: 20 }}>{t('presentation_description')}</StyledText>
                            <Box h={1.2} w='$full' my={32} bgColor='$light300' />
                            <StyledText size={14} weight='semi-bold'>2. {t('informations_generales')}</StyledText>
                            <StyledText size={14} style={{ marginTop: 16, lineHeight: 20 }}>{t('information_description')}</StyledText>
                            <Box h={1.2} w='$full' my={32} bgColor='$light300' />
                            <StyledText size={14} weight='semi-bold'>3. {t('services_et_caracteristiques')}</StyledText>
                            <StyledText size={14} style={{ marginTop: 16, marginBottom: 32, lineHeight: 20 }}>{t('services_description')}</StyledText>
                        </Box>
                    </ScrollView>
                    <HStack px={24}>
                        <Button
                            height={50}
                            width='$full'
                            borderRadius={10}
                            bgColor='$primary'
                            onPress={onChangeIndex}
                        >
                            <StyledText size={14} weight='semi-bold'>{t('commencer')}</StyledText>
                        </Button>
                    </HStack>
                </Fragment>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};


export default Step0;

const styles = StyleSheet.create({
    container: {
        padding: 10,
        rowGap: 20,
        columnGap: 30,
        flexDirection: 'row',
        flexWrap: 'wrap'
    }
});
