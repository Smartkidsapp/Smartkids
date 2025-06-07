import { Category, Option } from "@/src/types";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { HStack } from "@gluestack-ui/themed";
import { useState } from "react";
import { Keyboard, Platform, Pressable } from "react-native";
import AppInput from "../AppInput";
import CustomBottomSheet from "../CustomBottomSheet";
import FilterModalContent from "./FilterModalContent";
import Colors from "@/constants/Colors";
import { useTranslation } from "react-i18next";

const CustomHomeHeader = ({
    query,
    setQuery,
    handleSearch,
    categories,
    options,
    handleDeleteFilter,
    selectedCategory,
    distance,
    chosenOptions,
    minAge,
    maxAge,
    handleFilter
}: {
    categories: Category[],
    options: Option[],
    query: string,
    setQuery: (text: string) => void,
    handleSearch: (text: string) => void,
    handleDeleteFilter: () => void,
    selectedCategory: Category | null,
    distance: number,
    chosenOptions: any[],
    minAge: number,
    maxAge: number
    handleFilter: ({ distance, category, options, ages }: { category?: string | null, distance?: number, options: any[], ages: number[] }) => void
}) => {

    const { t } = useTranslation();

    const [isBottomSheetOpen, setBottomSheetOpen] = useState(false);

    const toggleBottomSheet = () => {
        Keyboard.dismiss();
        setBottomSheetOpen(!isBottomSheetOpen);
    };

    const onSheetClose = () => {
        Keyboard.dismiss();
        setBottomSheetOpen(false);

    }

    const handleSubmitFilter = ({ distance, category, options, ages }: { category?: string | null, distance?: number, options: any[], ages: number[] }) => {
        handleFilter({category: category || null, distance, options: options, ages: ages});
        toggleBottomSheet();
    }
    const rightIcon = <Pressable onPress={() => { setQuery(''); handleSearch('') }}>
        <Ionicons size={20} name='close-circle' color={Colors.light.gray} />
    </Pressable>

    return (
        <HStack justifyContent="space-between" alignItems="center" space="md" height={Platform.OS == 'ios' ? 111 : 67} bgColor="$white" pt={Platform.OS == 'android' ? 0 : 44} px={24}>
            <AppInput
                icon={<Ionicons size={22} name='search-outline' />}
                placeholder={t('rechercher_ici')}
                containerBg="$primary0"
                width={"86%"}
                height={40}
                rightIcon={query.length > 0 ? rightIcon : undefined}
                value={query}
                onChangeText={setQuery}
                onSubmitEditing={() => handleSearch(query)}
                keyboardType='web-search'
            />
            <Pressable onPress={toggleBottomSheet}>
                <FontAwesome name='sliders' size={24} color={"#231F20"} />
            </Pressable>
            <CustomBottomSheet customSnapPoints={['100%', '100%']} isOpen={isBottomSheetOpen} onClose={onSheetClose} title={t('filtre')}>
                <FilterModalContent
                    handleFilter={handleSubmitFilter}
                    selectedCategory={selectedCategory}
                    distance={distance}
                    categories={categories}
                    options={options}
                    chosenOptions={chosenOptions}
                    minAge={minAge}
                    maxAge={maxAge}
                    handleDeleteFilter={() => { handleDeleteFilter(); toggleBottomSheet() }}
                />
            </CustomBottomSheet>
        </HStack>
    );
};

export default CustomHomeHeader;