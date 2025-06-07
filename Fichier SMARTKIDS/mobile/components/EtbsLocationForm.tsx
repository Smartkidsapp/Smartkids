import { EyeIcon, EyeOffIcon, HStack, Input, InputField, InputSlot, LockIcon, ScrollView, VStack } from '@gluestack-ui/themed';
import React, { ComponentProps, Ref, useEffect, useState } from 'react';
import { TextInputProps } from 'react-native';
import { StyledText } from './StyledText';
import { Ionicons } from '@expo/vector-icons';
import { Pressable } from '@gluestack-ui/themed';
import Colors from '../constants/Colors';
import { Box } from '@gluestack-ui/themed';
import AppInput from './AppInput';
import { useLazySearchPlaceQuery } from '../src/features/users/store/user.apiSlice';
import { useAppDispatch, useAppSelector } from '../src/store';
import { selectEtablissement, setCreateEtablissement } from '../src/features/etablissement/etablissement.slice';
import { GoogleMapsAdresse } from '../src/types';
import { useTranslation } from 'react-i18next';

const BORDER_COLOR_DEFAULT = 'rgba(8, 33, 45, 0.3)';
const BORDER_COLOR_FILLED = 'rgba(8, 33, 45, 1)';
const BORDER_COLOR_DANGER = 'rgba(226, 3, 29, 1)';

interface AppInputProps
    extends ComponentProps<typeof InputField>,
    Pick<ComponentProps<typeof Input>, 'isDisabled' | 'isInvalid'> {
    label?: string;
    icon?: JSX.Element;
    rightIcon?: JSX.Element;
    error?: string;
    inputRef?: Ref<TextInputProps>;
    borderColor_?: string;
    containerBg?: string;
    onChangeLocation: (adresse: string) => void
}

export default function EtbsLocationForm({
    label,
    value,
    onChangeLocation,
    width,
    containerBg,
    ...props
}: AppInputProps) {

    const { t } = useTranslation();
    
    const dispatch = useAppDispatch();
    const { createEtablissement } = useAppSelector(selectEtablissement);

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
        dispatch(setCreateEtablissement({ adresse: adresse.name, latitude: adresse.lat, longitude: adresse.lng }));
        onChangeLocation(adresse.name)
        setShowList(false);
    }

    return (
        <VStack space="xs" w={width} mt={32} position='relative'>
            <AppInput
                placeholder={t('adresse_de_votre_etablissement')}
                value={value}
                onChangeText={(text) => { setQuery(text); onChangeLocation(text) }}
                height={props.height ? props.height : 50}
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
    );
}
