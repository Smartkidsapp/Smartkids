import { Category, Option } from "@/src/types";
import { Box, Button, HStack, ScrollView, SelectContent, SelectDragIndicator, SelectIcon, SelectInput, SelectItem, SelectPortal, Slider, SliderFilledTrack, View, VStack } from '@gluestack-ui/themed';
import { Fragment, useEffect, useState } from "react";
import { StyledText } from "../StyledText";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import THEME from "@/constants/theme";
import { Select } from '@gluestack-ui/themed';
import { SelectTrigger } from '@gluestack-ui/themed';
import { ChevronDownIcon } from '@gluestack-ui/themed';
import { SelectBackdrop } from '@gluestack-ui/themed';
import { SelectDragIndicatorWrapper } from '@gluestack-ui/themed';
import { SliderTrack } from '@gluestack-ui/themed';
import { SliderThumb } from '@gluestack-ui/themed';
import { useTranslation } from "react-i18next";
import { StyleSheet, useWindowDimensions } from "react-native";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import { useGetOptionsQuery } from "@/src/features/etablissement/etablissement.apiSlice";

const FilterModalContent = ({
    categories,
    options,
    handleDeleteFilter,
    selectedCategory,
    chosenOptions = [],
    distance,
    minAge = 0,
    maxAge = 99,
    handleFilter
}: {
    categories: Category[],
    options: Option[],
    handleDeleteFilter: () => void,
    selectedCategory: Category | null,
    chosenOptions: any[],
    distance: number,
    minAge: number,
    maxAge: number
    handleFilter: ({ distance, category, options, ages }: { category?: string | null, distance?: number, options: any[], ages: number[] }) => void
}) => {

    const { width } = useWindowDimensions();

    const { t, i18n } = useTranslation();

    const [value, setValue] = useState(distance);
    const [values, setValues] = useState([minAge, maxAge]);
    const [category, setCategory] = useState<string | null>(selectedCategory?.id || null);
    const [selectedOptions, setSelectedOptions] = useState<string[]>(chosenOptions);
    const { data: optionsData } = useGetOptionsQuery({ category: category! });

    useEffect(() => {
        setSelectedOptions([]);
    }, [category])

    const handleReinitFilter = () => {
        setCategory(null);
        setValue(0);
        handleDeleteFilter();
    }

    const handleSubmitFilter = () => {
        setCategory(null);
        setValue(0);
        handleFilter({ category: category || null, distance: value, options: selectedOptions, ages: values });
    }

    const handleSelectOption = (option: any) => {
        setSelectedOptions((prevSelected) =>
            prevSelected.includes(option.id)
                ? prevSelected.filter((id) => id !== option.id)
                : [...prevSelected, option.id]
        );
    };

    const selectedTitles = options
        .filter(option => selectedOptions.includes(option.id))
        .map(option => i18n.language == 'fr' ? option.titre : option.titre_en)
        .join(', ') || t('select_etablissement_options');

    const handleValuesChange = (values: any) => {
        setValues(values);
    };

    return (
        <VStack w="$full" justifyContent='center' alignItems='center'>
            <StyledText size={14} weight='semi-bold' style={{ alignSelf: 'flex-start' }}>{t('categorie')}</StyledText>
            <Select
                mt={16}
                mb={32}
                w={'100%'}
                onValueChange={(value) => setCategory(value)}
                selectedValue={category}
            >
                <SelectTrigger>
                    <SelectInput
                        placeholder={t('select_etablissement_type')}
                        value={i18n.language == 'fr' ? (categories.find(cat => cat.id === category)?.titre || '') : (categories.find(cat => cat.id === category)?.titre_en || '')}
                    />
                    <SelectIcon as={ChevronDownIcon} />
                </SelectTrigger>
                <SelectPortal>
                    <SelectBackdrop />
                    <SelectContent pb={44}>
                        <ScrollView width="100%">
                            <SelectDragIndicatorWrapper>
                                <SelectDragIndicator />
                            </SelectDragIndicatorWrapper>
                            {
                                [...categories].sort((a, b) => i18n.language == 'fr' ? a.titre.localeCompare(b.titre) : a.titre_en?.localeCompare(b.titre_en)).map((categorie, key) => (
                                    <SelectItem
                                        key={key}
                                        label={i18n.language == 'fr' ? categorie.titre : categorie.titre_en}
                                        value={categorie.id}
                                    />
                                ))
                            }
                        </ScrollView>
                    </SelectContent>
                </SelectPortal>
            </Select>
            {
                (optionsData?.data && optionsData.data.length > 0) && (
                    <Fragment>
                        <StyledText size={14} weight='semi-bold' style={{ alignSelf: 'flex-start' }}>{t('ce_que_l_etablissement_propose')}</StyledText>
                        <Select
                            mt={16}
                            mb={32}
                            w={'100%'}
                        >
                            <SelectTrigger>
                                <SelectInput
                                    placeholder={selectedTitles}
                                    placeholderTextColor={selectedOptions.length > 0 ? 'black' : '$light400'}
                                />
                                <SelectIcon as={ChevronDownIcon} />
                            </SelectTrigger>
                            <SelectPortal>
                                <SelectBackdrop />
                                <SelectContent pb={44}>
                                    <SelectDragIndicatorWrapper>
                                        <SelectDragIndicator />
                                    </SelectDragIndicatorWrapper>
                                    <ScrollView width="100%">
                                        {[...optionsData?.data].sort((a, b) => i18n.language == 'fr' ? a.titre.localeCompare(b.titre) : a.titre_en?.localeCompare(b.titre_en)).map((option, key) => (
                                            <Box
                                                key={key}
                                                bgColor={selectedOptions.includes(option.id) ? '$light300' : 'transparent'}
                                                borderRadius={4}
                                                mb={4}
                                            >
                                                <SelectItem
                                                    label={i18n.language == 'fr' ? option.titre : option.titre_en}
                                                    value={option.id}
                                                    onPress={() => handleSelectOption(option)}
                                                />
                                            </Box>
                                        ))}
                                    </ScrollView>
                                </SelectContent>
                            </SelectPortal>
                        </Select>
                    </Fragment>
                )
            }
            <StyledText size={14} weight='semi-bold' style={{ alignSelf: 'flex-start' }}>Distance ({value} km)</StyledText>
            <Slider
                mt={16}
                minValue={0}
                maxValue={200}
                value={value}
                onChange={setValue}
                step={10}
                defaultValue={value}
                size="md"
                orientation="horizontal"
                isDisabled={false}
                isReversed={false}
            >
                <SliderTrack height={10}>
                    <SliderFilledTrack bgColor='$primary' height={10} />
                </SliderTrack>
                <SliderThumb bgColor='$primary' h={24} w={24} />
            </Slider>
            <HStack
                alignItems='center'
                justifyContent='space-between'
                w='$full'
                mt={16}
            >
                <StyledText color={Colors.light.gray} weight='semi-bold' size={10}>0 km</StyledText>
                <StyledText color={Colors.light.gray} weight='semi-bold' size={10}>200 km</StyledText>
            </HStack>
            <StyledText size={14} weight='semi-bold' style={{ alignSelf: 'flex-start', marginTop: 32 }}>Age</StyledText>
            <MultiSlider
                values={values}
                sliderLength={width - 48}
                onValuesChange={handleValuesChange}
                min={0}
                max={99}
                step={1}
                selectedStyle={{
                    backgroundColor: Colors.light.primary,
                    height: 10
                }}
                unselectedStyle={{
                    backgroundColor: '#ccc',
                    height: 10,
                    borderRadius: 100
                }}
                customMarker={(e) => (
                    <Box
                        style={{
                            height: 24,
                            width: 24,
                            borderRadius: 12,
                            backgroundColor: Colors.light.primary,
                            marginTop: 6
                        }}
                        shadowColor="rgba(30, 30, 30, 0.3)"
                        shadowOffset={{ width: 0, height: 3 }}
                        shadowOpacity={0.27}
                        shadowRadius={4.65}
                        elevation={6}
                    />
                )}
            />
            <HStack
                alignItems='center'
                justifyContent='space-between'
                w='$full'
            >
                <StyledText color={Colors.light.gray} weight='semi-bold' size={10}>{values[0]} {t('an')}{values[0] > 1 && 's'}</StyledText>
                <StyledText color={Colors.light.gray} weight='semi-bold' size={10}>{values[1]} {t('an')}s</StyledText>
            </HStack>
            <Button
                elevation="$3"
                shadowColor="rgba(0, 0, 0, 0.5)"
                bg="$primary"
                size="xl"
                w={'100%'}
                h={50}
                mt={32}
                borderRadius={10}
                onPress={handleSubmitFilter}>
                <StyledText size={14} weight="semi-bold">
                    {t('filtrer')}
                </StyledText>
            </Button>
            <Button
                elevation="$3"
                shadowColor="rgba(0, 0, 0, 0.5)"
                bg='transparent'
                h={50}
                mt={32}
                onPress={handleReinitFilter}
                justifyContent='center'
                alignItems='center'
                gap={5}
            >
                <Ionicons name='trash' color={THEME.colors.DANGER} size={18} />
                <StyledText size={14} weight="semi-bold" color={THEME.colors.DANGER}>
                    {t('effacer')}
                </StyledText>
            </Button>
        </VStack>
    )
}

const styles = StyleSheet.create({
    itemContainer: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    selectedItem: {
        backgroundColor: '#e0f7fa', // Highlight color for selected items
    }
});

export default FilterModalContent;