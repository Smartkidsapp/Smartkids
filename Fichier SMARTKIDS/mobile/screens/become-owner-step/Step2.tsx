import { Box, Button, HStack, ScrollView, VStack } from '@gluestack-ui/themed';
import { Keyboard, KeyboardAvoidingView, Platform, Pressable, StyleSheet, TouchableWithoutFeedback, useWindowDimensions } from 'react-native';
import { StyledText } from '../../components/StyledText';
import { Fragment, useEffect, useState } from 'react';
import ControlledTextInput from '../../components/ControlledTextInput';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateEtablissementStep2Dto, CreateEtablissementStep2Schema } from '../../src/features/etablissement/etablissement.request';
import { selectEtablissement, setCreateEtablissement } from '../../src/features/etablissement/etablissement.slice';
import { useAppDispatch, useAppSelector } from '../../src/store';
import { useTranslation } from 'react-i18next';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import Colors from '@/constants/Colors';

interface componentNameProps {
    onChangeIndex: () => void,
    handleBack: () => void
}

const Step2 = (props: componentNameProps) => {

    const { t } = useTranslation();

    const [values, setValues] = useState([0, 99]);

    const { onChangeIndex, handleBack } = props;
    const { width } = useWindowDimensions();
    const { createEtablissement } = useAppSelector(selectEtablissement);
    const dispatch = useAppDispatch();

    const {
        control,
        reset,
        handleSubmit,
        setError,
        formState: { isValid },
    } = useForm<CreateEtablissementStep2Dto>({
        resolver: zodResolver(CreateEtablissementStep2Schema),
    });

    const onPressBack = () => {
        reset();
        handleBack()
    }

    const onSubmit = (data: CreateEtablissementStep2Dto) => {
        dispatch(setCreateEtablissement(data));
        onChangeIndex();
    };

    const handleValuesChange = (values: any) => {
        setValues(values);
        dispatch(setCreateEtablissement({ min_age: values[0], max_age: values[1] }));
    };

    useEffect(() => {
        dispatch(setCreateEtablissement({ min_age: 0, max_age: 99 }));
    }, [])

    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1, width: '100%' }}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <Fragment>
                    <ScrollView>
                        <Box w={width} px={24}>
                            <StyledText size={20} weight='semi-bold'>{t('parler_de_votre_etablissement')}</StyledText>
                            <VStack space="md" w={"100%"} mt={32}>
                                <ControlledTextInput
                                    name="nom"
                                    control={control}
                                    required
                                    label={`${t('nom_ou_rs')}*`}
                                    placeholder={`${t('entrez_le_nom_ou_rs')}...`}
                                    textContentType="name"
                                />
                                <ControlledTextInput
                                    textArea={true}
                                    name="description"
                                    control={control}
                                    required
                                    label={`${t('description_etablissement')}*`}
                                />
                                <ControlledTextInput
                                    name="code_promo"
                                    control={control}
                                    required
                                    label={t('code_promo')}
                                    placeholder={t('entrer_le_code_promotionnel')}
                                />
                                <StyledText size={11}>{t('code_promo_description')}</StyledText>
                                <ControlledTextInput
                                    name="phone"
                                    control={control}
                                    required
                                    label={`${t('numero_telephone')}*`}
                                    placeholder="Ex : +33 653 58 74 27"
                                    textContentType="telephoneNumber"
                                />
                            </VStack>
                            <StyledText size={14} style={{ marginTop: 32, marginBottom: 16 }} weight='semi-bold'>{t('categorie_d_age_convient')}</StyledText>
                            <MultiSlider
                                values={values}
                                sliderLength={width - 48}
                                onValuesChange={handleValuesChange}
                                min={0}
                                max={99}
                                step={1}
                                selectedStyle={{
                                    backgroundColor: Colors.light.primary,
                                    height: 4
                                }}
                                unselectedStyle={{
                                    backgroundColor: '#ccc',
                                    height: 4
                                }}
                                customMarker={(e) => (
                                    <Box
                                        style={{
                                            height: 24,
                                            width: 24,
                                            borderRadius: 12,
                                            backgroundColor: Colors.light.primary,
                                        }}
                                    />
                                )}
                            />
                            <Box style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <StyledText weight="semi-bold">{values[0]} {t('an')}{values[0] > 1 && 's'}</StyledText>
                                <StyledText weight="semi-bold">{values[1]} {t('an')}s</StyledText>
                            </Box>
                        </Box>
                        <Box h={150} />
                    </ScrollView>
                    <HStack px={24} pt={16} pb={Platform.OS == 'android' ? 16 : 0} alignItems='center' justifyContent='space-between'>
                        <Pressable onPress={onPressBack}>
                            <StyledText size={14} weight='semi-bold'>{t('retour')}</StyledText>
                        </Pressable>
                        <Button
                            height={50}
                            width='auto'
                            px={50}
                            borderRadius={10}
                            bgColor='$primary'
                            onPress={handleSubmit(onSubmit)}
                        >
                            <StyledText size={14} weight='semi-bold'>{t('next')}</StyledText>
                        </Button>
                    </HStack>
                </Fragment>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};


export default Step2;

const styles = StyleSheet.create({
    container: {
        padding: 10,
        rowGap: 20,
        columnGap: 30,
        flexDirection: 'row',
        flexWrap: 'wrap'
    }
});
