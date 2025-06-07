import { Box, Button, HStack, Pressable, ScrollView, VStack } from '@gluestack-ui/themed';
import { ActivityIndicator, FlatList, Keyboard, KeyboardAvoidingView, Platform, StyleSheet, TouchableWithoutFeedback, useWindowDimensions } from 'react-native';
import { StyledText } from '../../components/StyledText';
import { Fragment, useCallback, useEffect, useMemo } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useGetOptionsQuery } from '../../src/features/etablissement/etablissement.apiSlice';
import { useAppDispatch, useAppSelector } from '../../src/store';
import { selectEtablissement, setCreateEtablissement } from '../../src/features/etablissement/etablissement.slice';
import { Option } from '../../src/types';
import Colors from '../../constants/Colors';
import { useTranslation } from 'react-i18next';

interface componentNameProps {
    onChangeIndex: () => void,
    handleBack: () => void
}

interface ServiceItemProps {
    id: string;
    title: string;
}


const Step4 = (props: componentNameProps) => {

    const { t } = useTranslation();

    const dispatch = useAppDispatch();
    const { createEtablissement } = useAppSelector(selectEtablissement);

    const { onChangeIndex, handleBack } = props;
    const { width } = useWindowDimensions();

    const { data, isLoading } = useGetOptionsQuery({ category: createEtablissement?.category! });

    useEffect(() => {
        if (!createEtablissement?.options) {
            dispatch(setCreateEtablissement({ options: [] }));
        }
    }, []);

    const ServiceItem = useMemo(() => ({ item }: { item: Option }) => {

        const handlePress = useCallback(() => {
            let options = createEtablissement?.options;

            if (options) {
                if (options?.includes(item.id)) {
                    options = options.filter(option => option !== item.id);
                } else {
                    options = [...options, item.id];
                }
            } else {
                options = [item.id];
            }

            dispatch(setCreateEtablissement({ options: options }));
        }, [dispatch, item.id]);

        return (
            <Pressable
                flex={1}
                onPress={handlePress}
            >
                <Box
                    flex={1}
                    borderWidth={2}
                    borderColor={createEtablissement?.options && createEtablissement?.options.includes(item.id) ? '$primary' : 'gray.300'}
                    borderRadius={10}
                    px={13}
                    py={16}
                    backgroundColor="white"
                >
                    <HStack alignItems="center" space="sm">
                        <StyledText size={14} weight='semi-bold'>{item.titre}</StyledText>
                    </HStack>
                </Box>
            </Pressable>
        );
    }, [dispatch, createEtablissement]);


    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1, width: '100%' }}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <Fragment>
                    <ScrollView>
                        <Box w={width} px={24}>
                            <StyledText size={20} weight='semi-bold'>{t('votre_etablissement_propose')}</StyledText>
                            <VStack space="md" w={"100%"} mt={32}>
                                {
                                    isLoading && (
                                        <ActivityIndicator color={Colors.light.gray} size="large" />
                                    )
                                }
                                <FlatList
                                    data={data?.data}
                                    keyExtractor={(item: Option) => item.id}
                                    renderItem={({ item }: { item: Option }) => <ServiceItem key={item.id} item={item} />}
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
                    <HStack px={24} pt={16} pb={Platform.OS == 'android' ? 16 : 0} alignItems='center' justifyContent='space-between'>
                        <Pressable onPress={handleBack}>
                            <StyledText size={14} weight='semi-bold'>{t('retour')}</StyledText>
                        </Pressable>
                        <Button
                            height={50}
                            width='auto'
                            px={50}
                            borderRadius={10}
                            bgColor='$primary'
                            onPress={onChangeIndex}
                        >
                            <StyledText size={14} weight='semi-bold'>{t('next')}</StyledText>
                        </Button>
                    </HStack>
                </Fragment>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};

const ServiceItem = ({ title }: { title: string }) => {
    return (
        <Box
            flex={1}
            borderWidth={1}
            borderColor="gray.300"
            borderRadius={10}
            px={13}
            py={16}
            backgroundColor="white"
        >
            <HStack alignItems="center" space="sm">
                <Ionicons name="wifi" size={30} color="black" />
                <StyledText size={14} weight='semi-bold'>{title}</StyledText>
            </HStack>
        </Box>
    );
};


export default Step4;

const styles = StyleSheet.create({
    container: {
        padding: 10,
        rowGap: 20,
        columnGap: 30,
        flexDirection: 'row',
        flexWrap: 'wrap'
    }
});
