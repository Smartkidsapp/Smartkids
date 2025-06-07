import {
    Avatar,
    AvatarImage,
    Box,
    Button,
    Center,
    HStack,
    KeyboardAvoidingView,
    Pressable,
    VStack,
    useToast,
} from '@gluestack-ui/themed';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useState } from 'react';
import { ActivityIndicator, Keyboard, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { Platform } from 'react-native';
import { ScrollView } from '@gluestack-ui/themed';
import { Etablissement } from '@/src/types';
import useDynamicDimensions from '@/hooks/useDynamicDimensions';
import { handleApiError } from '@/src/utils/error.util';
import KeyboardAwareAnimatedFooter from './KeyboardAwareAnimatedFooter';
import AppTextArea from './AppTextArea';
import { StyledText } from './StyledText';
import RatingInput from './RatingInput';
import { useRateUserMutation } from '@/src/features/etablissement/etablissement.apiSlice';
import { CloseIcon } from '@gluestack-ui/themed';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import BaseToast from './BaseToast';
import { useTranslation } from 'react-i18next';

export default function RateEtablissement({
    etablissement,
    onClose,
    setUpdateRatingState
}: {
    etablissement: Etablissement,
    onClose: () => void,
    setUpdateRatingState: (value: boolean) => void
}) {

    const { t } = useTranslation();

    const [rating, setRating] = useState<number>(0);
    const [comment, setComment] = useState<string>('');

    const [rateUser, { isLoading }] = useRateUserMutation();

    const toast = useToast();
    const handlePress = () => {
        if (rating === 0) {
            return;
        }

        rateUser({
            comment,
            mark: rating,
            etablissementId: etablissement.id,
        }).then(res => {
            if ('data' in res && res.data) {
                onClose();
                setUpdateRatingState(true);
                toast.show({
                    placement: 'top',
                    render: () => (
                        <BaseToast
                            bg="$primary"
                            description={
                                res.data?.message ??
                                t('avis_envoyé')
                            }
                        />
                    ),
                });
            }

            if ('error' in res && res.error) {
                handleApiError({
                    error: res.error,
                    toast,
                });
            }
        });
    };

    const {
        window: { height: screenH },
    } = useDynamicDimensions();

    const isValid = rating > 0;

    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.contentContainerStyle}
        >
            <Box
                pt={60}
                bg="#fff"
                pb={44}
                justifyContent="space-between"
            >
                <VStack space="xl">
                    <Box>
                        <StyledText size={14} weight="bold" center>
                           {t('noter_votre_experience')} {' '}
                            <StyledText color={Colors.light.textPrimary} size={18}>
                                {etablissement.nom} ?
                            </StyledText>
                        </StyledText>
                    </Box>

                    <Box
                        borderBottomWidth={0.7}
                        borderStyle="dashed"
                        borderColor="rgba(8, 33, 45, 0.3)"
                    />

                    <VStack space="xs">
                        <StyledText center color="rgba(8, 33, 45, 0.3)">
                            {t('votre_note_globale')}
                        </StyledText>
                        <RatingInput value={rating} onChange={setRating} />
                    </VStack>

                    <Box
                        borderBottomWidth={0.7}
                        borderStyle="dashed"
                        borderColor="rgba(8, 33, 45, 0.3)"
                    />

                    <AppTextArea
                        label={t('notez_client')}
                        placeholder={t('ecrivez_avis')}
                        value={comment}
                        onChangeText={setComment}
                        h={120}
                    />
                </VStack>
                <VStack space="xl" bg="#fff" pt={32} pb={44}>
                    <Button
                        disabled={isLoading}
                        elevation="$3"
                        shadowColor="rgba(0, 0, 0, 0.5)"
                        rounded="$full"
                        size="xl"
                        h={50}
                        bg={isValid ? '$primary' : 'rgba(226, 226, 226, 1)'}
                        onPress={handlePress}>
                        <HStack justifyContent="center" alignItems="center" space="sm">
                            <Ionicons size={24} name='send' color="#000" />
                            {isLoading ? (
                                <ActivityIndicator color="#000" size="small" />
                            ) : (
                                <StyledText size={14} color="#000">
                                    {t('soumettre')}
                                </StyledText>
                            )}
                        </HStack>
                    </Button>
                </VStack>
                <Box height={300}/>
            </Box>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    contentContainerStyle: {
        backgroundColor: '#fff',
    },
});
