import { Box, Button, HStack, ImageBackground, Pressable, ScrollView, useToast } from '@gluestack-ui/themed';
import { ActivityIndicator, Keyboard, KeyboardAvoidingView, Platform, StyleSheet, TouchableWithoutFeedback, useWindowDimensions } from 'react-native';
import { StyledText } from '../../components/StyledText';
import { Fragment, useEffect, useState } from 'react';
import { Image } from '@gluestack-ui/themed';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import ImagePickerSheet, { FileRecord } from '../../components/ImagePickerSheet';
import CustomBottomSheet from '../../components/CustomBottomSheet';
import { useAppDispatch, useAppSelector } from '../../src/store';
import { initCreateEtablissement, selectEtablissement, setCreateEtablissement } from '../../src/features/etablissement/etablissement.slice';
import { useCreateEtablissementMutation, useDeleteMediaMutation, useEditEtablissementMutation } from '../../src/features/etablissement/etablissement.apiSlice';
import { handleApiError } from '../../src/utils/error.util';
import BaseToast from '@/components/BaseToast';
import { Media } from '@/src/types';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StackParamList } from '@/navigation';
import { useTranslation } from 'react-i18next';

interface componentNameProps {
    onChangeIndex: () => void,
    handleBack: () => void
}

interface File {
    name: string;
    type: string;
    uri: string;
}

const EditStep6 = (props: componentNameProps) => {

    const { t } = useTranslation();

    const navigation = useNavigation<StackNavigationProp<StackParamList, 'edit-my-etbs'>>();

    const toast = useToast();

    const dispatch = useAppDispatch();
    const { createEtablissement, editEtablissement } = useAppSelector(selectEtablissement);

    const [editEtablisement, { isLoading, isError, isSuccess, error, data }] = useEditEtablissementMutation();

    const [deleteMedia, { }] = useDeleteMediaMutation();

    const [isBottomSheetOpen, setBottomSheetOpen] = useState(false);

    const [currentImages, setCurrentImages] = useState<Media[]>(editEtablissement?.images || [])

    const toggleBottomSheet = () => {
        setBottomSheetOpen(!isBottomSheetOpen);
    };

    const onCloseBottomSheet = () => {
        setBottomSheetOpen(false);
    };

    const { onChangeIndex, handleBack } = props;
    const { width } = useWindowDimensions();
    const [images, setImages] = useState<File[]>([]);

    const onSubmit = () => {
        if (createEtablissement) {
            if (currentImages.length > 0 || createEtablissement?.images.length > 0) {
                editEtablisement(createEtablissement);
            }
        }
    };

    const remove = (index: number) => {
        setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    }

    useEffect(() => {
        dispatch(setCreateEtablissement({ images }));
    }, [images])

    useEffect(() => {
        if (isError) {
            handleApiError({
                error: error,
                toast,
                setFormError: () => { },
            });
        }
        if (isSuccess) {
            toast.show({
                placement: 'top',
                render: () => (
                    <BaseToast bg="$primary" description={data.message} />
                ),
            });
            dispatch(initCreateEtablissement());
            navigation.navigate('tab-navigator');
        }
    }, [isError, isSuccess])

    const pushImage = (file: File) => {
        setImages((prevImages) => [...prevImages, file]);
        setBottomSheetOpen(!isBottomSheetOpen);
    }

    const removeExistingImage = (id: string, index: number) => {
        deleteMedia({ id }).then(() => {
            setCurrentImages((prevImages) => prevImages.filter((_, i) => i !== index));
        }).catch((err) => console.log(err))
    }

    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1, width: '100%' }}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <Fragment>
                    <ScrollView>
                        <Box w={width} px={24}>
                            <StyledText size={20} weight='semi-bold'>{t('ajouter_quelques_images')}</StyledText>
                            <HStack flexWrap='wrap' justifyContent='space-between' alignItems='center' mt={16}>
                                {
                                    currentImages?.map((image, key) => (
                                        <Box w={"48%"} mt={16}>
                                            <ImageBackground source={{ uri: image.src }} imageStyle={{ borderRadius: 15 }} resizeMode='cover' w={"100%"} h={160}>
                                                <Pressable
                                                    position='absolute'
                                                    top={9}
                                                    right={12}
                                                    bgColor='#E23F1B'
                                                    w={20}
                                                    h={20}
                                                    rounded='$full'
                                                    justifyContent='center'
                                                    alignItems='center'
                                                    onPress={() => removeExistingImage(image.id, key)}
                                                >
                                                    <Ionicons name='close' color='white' size={14} />
                                                </Pressable>
                                            </ImageBackground>
                                        </Box>
                                    ))
                                }
                                {
                                    images?.map((image, key) => (
                                        <Box w={"48%"} mt={16}>
                                            <ImageBackground source={{ uri: image.uri }} imageStyle={{ borderRadius: 15 }} resizeMode='cover' w={"100%"} h={160}>
                                                <Pressable
                                                    position='absolute'
                                                    top={9}
                                                    right={12}
                                                    bgColor='#E23F1B'
                                                    w={20}
                                                    h={20}
                                                    rounded='$full'
                                                    justifyContent='center'
                                                    alignItems='center'
                                                    onPress={() => remove(key)}
                                                >
                                                    <Ionicons name='close' color='white' size={14} />
                                                </Pressable>
                                            </ImageBackground>
                                        </Box>
                                    ))
                                }
                                {
                                    images?.length < 5 && (
                                        <Box w={"48%"} mt={16}>
                                            <Pressable
                                                w={"100%"}
                                                h={160}
                                                borderRadius={15}
                                                justifyContent='center'
                                                alignItems='center'
                                                borderColor={Colors.light.primary}
                                                borderWidth={2}
                                                borderStyle='dashed'
                                                onPress={toggleBottomSheet}
                                            >
                                                <Ionicons name='image-outline' size={36} color={Colors.light.primary} />
                                                <StyledText weight='semi-bold' size={12} color={Colors.light.textPrimary} style={{ marginTop: 8 }}>{t('cliquez_pour_ajouter')}</StyledText>
                                            </Pressable>
                                        </Box>
                                    )
                                }
                            </HStack>
                        </Box>
                    </ScrollView>
                    <HStack px={24} pt={16} pb={Platform.OS == 'android' ? 16 : 0} alignItems='center' justifyContent='space-between'>
                        <Pressable onPress={handleBack}>
                            <StyledText size={14} weight='semi-bold'>{t('retour')}</StyledText>
                        </Pressable>
                        <Button
                            height={50}
                            width='auto'
                            px={50}
                            borderRadius={10}
                            bgColor={currentImages.length > 0 || (createEtablissement?.images && createEtablissement?.images.length > 0) ? '$primary' : '$light200'}
                            onPress={onSubmit}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="#000" size="small" />
                            ) : (
                                <StyledText size={14} color={currentImages.length > 0 || (createEtablissement?.images && createEtablissement?.images.length > 0) ? '#000' : Colors.light.gray} weight='semi-bold'>{t('sauvegarder')}</StyledText>
                            )}
                        </Button>
                    </HStack>
                    <CustomBottomSheet isOpen={isBottomSheetOpen} onClose={onCloseBottomSheet} title={t('choisissez_votre_photo')}>
                        <ImagePickerSheet onFilePicked={(file) => pushImage(file)} />
                    </CustomBottomSheet>
                </Fragment>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};


export default EditStep6;

const styles = StyleSheet.create({
    container: {
        padding: 10,
        rowGap: 20,
        columnGap: 30,
        flexDirection: 'row',
        flexWrap: 'wrap'
    }
});
