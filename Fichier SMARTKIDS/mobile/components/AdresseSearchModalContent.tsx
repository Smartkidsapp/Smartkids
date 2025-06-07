import { Category, GoogleMapsAdresse } from "@/src/types";
import { Box, Button, HStack, ScrollView, SelectContent, SelectDragIndicator, SelectIcon, SelectInput, SelectItem, SelectPortal, Slider, SliderFilledTrack, View, VStack } from '@gluestack-ui/themed';
import { useEffect, useState } from "react";
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
import { StyledText } from "./StyledText";
import { useLazySearchPlaceQuery } from "@/src/features/users/store/user.apiSlice";
import AppInput from "./AppInput";
import { Pressable } from "@gluestack-ui/themed";
import { useTranslation } from "react-i18next";

const AdresseSearchModalContent = ({
    onClose,
    handleFilter
}: {
    onClose: () => void,
    handleFilter: (adresse: GoogleMapsAdresse) => void
}) => {

    const { t } = useTranslation();

    const [showList, setShowList] = useState<boolean>(false);

    const [query, setQuery] = useState('');
    const [triggerSearch, { data, error, isLoading }] = useLazySearchPlaceQuery();

    useEffect(() => {
        if (query.length > 3) {
            setShowList(true);
            triggerSearch({ query });
        } else {
            setShowList(false);
            triggerSearch({ query: '' });
        }
    }, [query])

    const handleSelectAdresse = (adresse: GoogleMapsAdresse) => {
        setShowList(false);
        onClose();
        handleFilter(adresse)
    }


    return (
        <VStack space="xs" w='$full'>
            <AppInput
                placeholder={t('entrez_l_adresse')}
                value={query}
                onChangeText={(text) => { setQuery(text) }}
                height={50}
                icon={<Ionicons size={20} name="location-outline" />}
            />
            {
                showList && (
                    <ScrollView
                        mt={16}
                        borderRadius={5}
                        bgColor='$white'
                        maxHeight={"75%"}
                        w={"100%"}
                        px={16}
                        py={24}
                        borderWidth={1}
                        borderColor='$light300'
                    >
                        {
                            (data?.data.length == 0 || !data) && (
                                <HStack justifyContent='flex-start' space='md' borderBottomColor='$light300' borderBottomWidth={0} py={16}>
                                    <Ionicons size={20} name='information-circle-outline' />
                                    <StyledText size={14}>{t('aucun_resultat')}</StyledText>
                                </HStack>
                            )
                        }
                        {
                            data?.data.map((adresse, key) => (
                                <Pressable
                                    key={key}
                                    onPress={() => handleSelectAdresse(adresse)}
                                >
                                    <HStack justifyContent='flex-start' alignItems="center" space='md' borderBottomColor='$light300' borderBottomWidth={data.data.length != key + 1 ? 1 : 0} py={16}>
                                        <Ionicons size={20} name='location' />
                                        <VStack>
                                            <StyledText size={14}>{adresse.name}</StyledText>
                                            <StyledText size={12} color={Colors.light.gray}>{adresse.formatted_address}</StyledText>
                                        </VStack>
                                    </HStack>
                                </Pressable>
                            ))
                        }
                        <Box height={48} />
                    </ScrollView>
                )
            }
        </VStack>
    )
}

export default AdresseSearchModalContent;