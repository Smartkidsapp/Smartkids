import { Avatar, AvatarImage, Box, Button, Checkbox, CheckboxIcon, CheckboxIndicator, CheckboxLabel, CheckIcon, ChevronLeftIcon, ChevronRightIcon, HStack, ScrollView, useToast, VStack } from '@gluestack-ui/themed';
import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { KeyboardAvoidingView } from '@gluestack-ui/themed';
import {
    ActivityIndicator,
    Image,
    Keyboard,
    Linking,
    Platform,
    StyleSheet,
    TouchableWithoutFeedback,
} from 'react-native';
import { Pressable } from '@gluestack-ui/themed';
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { useForm } from 'react-hook-form';
import { StackParamList } from '../../navigation';
import { StyledText } from '../../components/StyledText';
import { StackTabParamList } from '../../navigation/TabNavigation';
import Colors from '../../constants/Colors';
import CustomBottomSheet from '../../components/CustomBottomSheet';
import LogoutBtn from '../../src/features/auth/LogoutBtn';
import { useAppDispatch, useAppSelector } from '../../src/store';
import { logout, selectUser } from '../../src/features/auth/auth.slice';
import UpdateProfilePicture from '../../src/features/users/UpdateProfilePicture';
import ModalLangue from '@/components/ModalLangue';
import { useTranslation } from 'react-i18next';
import { useDeleteAccountMutation } from '@/src/features/users/store/user.apiSlice';
import { useSignoutMutation } from '@/src/features/auth/auth.apiSlice';
import { getItemAsync } from 'expo-secure-store';
import { REFRESH_TOKEN_KEY } from '@/src/features/auth/auth.request';
import { useNavigation } from '@react-navigation/native';
import { handleApiError } from '@/src/utils/error.util';
import * as Sharing from 'expo-sharing';

interface CardMenuItemProps {
    icon?: any,
    title: string,
    action: () => void,
    bg?: string
}

export default function ProfilScreen({
    navigation,
}: StackScreenProps<StackTabParamList, 'profil'>) {

    const { t } = useTranslation();

    const user = useAppSelector(selectUser);

    const openUrl = async (url: string) => {
        try {
            const canOpenURL = await Linking.canOpenURL(url);
            if (canOpenURL) {
                Linking.openURL(url)
            }
        } catch (error) {
            console.log(error);
        }
    }

    const shareApp = async () => {
        try {
            const isAvailable = await Sharing.isAvailableAsync();
            if (isAvailable) {
                Sharing.shareAsync("https://smartkidsapp.com/", {
                    dialogTitle: ""
                })
            }
        } catch (error) {
            console.log(error);
        }
    }

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [menuSmartkidsItems, setMenuSmartkidsItems] = useState<any[]>([]);
    const [menuInfoLegalItems, setMenuInfoLegalItems] = useState<any[]>([]);

    const becomeSeller = {
        icon: <Ionicons name='home' size={16} />,
        title: t('profil.basculer_propriétaire'),
        //@ts-ignore
        action: () => navigation.navigate('become-owner'),
        bg: Colors.light.primary
    };

    const someMenuInfoItems = [
        {
            icon: <Ionicons name='person' size={16} />,
            title: t('profil.modifier_mes_infos'),
            //@ts-ignore
            action: () => navigation.navigate('edit-info')
        },
        {
            icon: <Ionicons name='lock-closed' size={16} />,
            title: t('profil.modifier_mot_de_passe'),
            //@ts-ignore
            action: () => navigation.navigate('update-password')
        },
        {
            icon: <Ionicons name='heart' size={16} />,
            title: t('profil.mes_favoris'),
            //@ts-ignore
            action: () => navigation.navigate('favorites')
        }
    ];

    const sellerParameterItems: CardMenuItemProps[] = [
        {
            icon: <Ionicons name='card-sharp' size={18} />,
            title: t('profil.mon_abonnement'),
            //@ts-ignore
            action: () => navigation.navigate('subscription')
        },
        {
            icon: <Ionicons name='home' size={18} />,
            title: t('profil.modifier_etablissement'),
            //@ts-ignore
            action: () => navigation.navigate('edit-my-etbs')
        }
    ];

    const languageItem: CardMenuItemProps = {
        icon: <Ionicons name='globe' size={18} />,
        title: t('profil.langue'),
        //@ts-ignore
        action: () => setIsModalVisible(true)
    };

    const [menuInfoItems, setMenuInfoItems] = useState<CardMenuItemProps[]>(someMenuInfoItems);

    const [menuParameterItems, setMenuParameterItems] = useState<CardMenuItemProps[]>([languageItem]);

    useEffect(() => {
        if (!user?.isSeller) {
            setMenuInfoItems(() => [becomeSeller, ...someMenuInfoItems]);
            setMenuParameterItems([languageItem]);
        } else {
            setMenuInfoItems(someMenuInfoItems);
            setMenuParameterItems(() => [languageItem, ...sellerParameterItems]);
        }
    }, [user, t]);

    useEffect(() => {
        setMenuSmartkidsItems([
            {
                icon: <Ionicons name='information-circle' size={18} />,
                title: t('profil.a_propos'),
                action: () => openUrl('https://smartkidsapp.com')
            },
            {
                icon: <Ionicons name='mail' size={18} />,
                title: t('profil.contactez_nous'),
                action: () => openUrl('https://smartkidsapp.com')
            },
            {
                icon: <Ionicons name='arrow-redo' size={18} />,
                title: t('profil.share_app'),
                action: () => shareApp()
            }
        ]);

        setMenuInfoLegalItems([
            {
                icon: <Ionicons name='document-text-outline' size={16} />,
                title: t('profil.cgv'),
                action: () => openUrl('https://smartkidsapp.com/conditions-generales-de-vente')
            },
            {
                icon: <Ionicons name='document-text-outline' size={16} />,
                title: t('profil.politique_confidentialite'),
                action: () => openUrl('https://smartkidsapp.com/politiques-de-confidentialites')
            },
            {
                icon: <Ionicons name='document-text-outline' size={16} />,
                title: t('profil.mentions'),
                action: () => openUrl('https://smartkidsapp.com/mentions-legales')
            }
        ]);
    }, [t]);

    const [isBottomSheetOpen, setBottomSheetOpen] = useState(false);

    const toggleBottomSheet = () => {
        setBottomSheetOpen(!isBottomSheetOpen);
    };

    const onCloseBottomSheet = () => {
        setBottomSheetOpen(false);
    };

    return (
        <KeyboardAvoidingView
            flex={1}
            enabled
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <TouchableWithoutFeedback
                style={styles.container}
                onPress={Keyboard.dismiss}
            >
                <Fragment>
                    <ScrollView flex={1} bg={"$light100"} p={25} contentContainerStyle={{ paddingBottom: 150 }}>
                        {
                            !user && (
                                <VStack
                                    justifyContent='center'
                                    alignItems='center'
                                    space='xs'
                                >
                                    <StyledText size={24} weight='bold'>{t('your_profil')}</StyledText>
                                    <StyledText size={13} style={{ marginTop: 8 }} center>{t('profil_text_se_connecter')}</StyledText>

                                    <Button
                                        elevation="$3"
                                        shadowColor="rgba(0, 0, 0, 0.5)"
                                        bg="$primary"
                                        size="xl"
                                        w={'100%'}
                                        mt={16}
                                        h={50}
                                        borderRadius={10}
                                        //@ts-ignore
                                        onPress={() => navigation.navigate('login')}
                                    >
                                        <StyledText size={14} weight="semi-bold">
                                            {t('login_or_register')}
                                        </StyledText>
                                    </Button>
                                </VStack>
                            )
                        }
                        {
                            user && (
                                <VStack
                                    justifyContent='center'
                                    alignItems='center'
                                    space='xs'
                                >
                                    <Avatar
                                        bg="$primary"
                                        w={80}
                                        h={80}
                                        position="relative"
                                        mb={8}
                                    >
                                        <AvatarImage
                                            alt={user?.name ?? 'User'}
                                            source={
                                                user?.avatar
                                                    ? { uri: user.avatar }
                                                    : require('../../assets/images/avatar.png')
                                            }
                                        />
                                        <UpdateProfilePicture />
                                    </Avatar>
                                    <StyledText weight='semi-bold' size={14}>{user?.name}</StyledText>
                                    <StyledText>{user?.email}</StyledText>
                                </VStack>
                            )
                        }

                        {
                            user && (
                                <VStack space='lg' mt={32}>
                                    <StyledText size={14} weight='semi-bold'>{t('profil.mes_informations')}</StyledText>
                                    {
                                        menuInfoItems.map((item, key) => (
                                            <CardMenuItem key={key} bg={item.bg} icon={item.icon} title={item.title} action={item.action} />
                                        ))
                                    }
                                </VStack>
                            )
                        }
                        <VStack space='lg' mt={32}>
                            <StyledText size={14} weight='semi-bold'>{t('profil.setting')}</StyledText>
                            {
                                menuParameterItems.map((item, key) => (
                                    <CardMenuItem key={key} bg={item.bg} icon={item.icon} title={item.title} action={item.action} />
                                ))
                            }
                        </VStack>
                        <VStack space='lg' mt={32}>
                            <StyledText size={14} weight='semi-bold'>SMARTKIDS</StyledText>
                            {
                                menuSmartkidsItems.map((item, key) => (
                                    <CardMenuItem key={key} bg={item.bg} icon={item.icon} title={item.title} action={item.action} />
                                ))
                            }
                        </VStack>
                        <VStack space='lg' mt={32}>
                            <StyledText size={14} weight='semi-bold'>{t('profil.informations_legales')}</StyledText>
                            {
                                menuInfoLegalItems.map((item, key) => (
                                    <CardMenuItem key={key} bg={item.bg} icon={item.icon} title={item.title} action={item.action} />
                                ))
                            }
                        </VStack>
                        {user && <LogoutBtn />}
                        {
                            user && (
                                <Button
                                    mt={16}
                                    borderWidth={0}
                                    backgroundColor='transparent'
                                    h={50}
                                    gap={5}
                                    onPress={toggleBottomSheet}
                                >
                                    <Ionicons name='trash' size={16} color={"#BC2121"} />
                                    <StyledText color="#BC2121" size={14} weight="semi-bold">
                                        {t('profil.supprimer_mon_compte')}
                                    </StyledText>
                                </Button>
                            )
                        }
                    </ScrollView>
                    <CustomBottomSheet isOpen={isBottomSheetOpen} onClose={onCloseBottomSheet} title={t('profil.suppression_du_compte')}>
                        <RemoveModalContent />
                    </CustomBottomSheet>
                    <ModalLangue setIsModalVisible={setIsModalVisible} isModalVisible={isModalVisible} />
                </Fragment>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

const CardMenuItem = ({ icon, title, action, bg }: CardMenuItemProps) => {
    return (
        <Pressable
            justifyContent='space-between'
            alignItems='center'
            shadowColor='$light400'
            borderRadius={5}
            p={12}
            backgroundColor='$white'
            flexDirection='row'
            onPress={action}
            bgColor={bg ? bg : '$white'}
        >
            <HStack space='md' alignItems='center'>
                {icon && icon}
                <StyledText weight='semi-bold'>{title}</StyledText>
            </HStack>
            <ChevronRightIcon />
        </Pressable>
    )
}

const RemoveModalContent = () => {

    const toast = useToast();

    const navigation = useNavigation<StackNavigationProp<StackTabParamList, 'profil', undefined>>();

    const dispatch = useAppDispatch();

    const [deleteAccount, { isLoading, isSuccess, isError, error }] = useDeleteAccountMutation();

    const [logoutFromServer, { isLoading: isSignoutLoading }] = useSignoutMutation();

    const { t } = useTranslation();

    const handleConfirm = () => {
        deleteAccount();
    }

    useEffect(() => {

        if (isSuccess) {
            handleLogout();
        }

        if (isError) {
            handleApiError({
                error: error,
                toast
            });
        }
    }, [isSuccess, isError])

    const handleLogout = async () => {
        const [refreshTokenJSON, fcmToken] = await Promise.all([
            getItemAsync(REFRESH_TOKEN_KEY),
            null/*getItemAsync(FCM_TOKEN_KEY)*/,
        ]);
        const { id: refreshToken } = JSON.parse(refreshTokenJSON ?? '{}');

        logoutFromServer({
            fcmToken,
            refreshToken,
        }).finally(() => {
            dispatch(logout());
            navigation.reset({
                routes: [
                    {
                        //@ts-ignore
                        name: 'login',
                    },
                ],
                index: 1,
            });
        });
    };

    return (
        <VStack w="$full" justifyContent='center' alignItems='center'>
            <Box>
                <Ionicons name="warning" size={48} color="#E23F1B" />
            </Box>
            <StyledText size={14} weight='semi-bold' style={{ marginTop: 16 }}>Attention</StyledText>
            <StyledText size={14} style={{ marginTop: 16, textAlign: 'center' }}>
                {t('text_suppression')}
            </StyledText>
            <Button
                elevation="$3"
                shadowColor="rgba(0, 0, 0, 0.5)"
                bg="$primary"
                size="xl"
                w={'100%'}
                h={50}
                mt={32}
                borderRadius={10}
                onPress={handleConfirm}
                alignItems="center"
                justifyContent='center'
                disabled={isLoading}
            >
                {isLoading ? (
                    <ActivityIndicator size="small" color="rgba(8, 33, 45, 0.5)" />
                ) : (
                    <StyledText size={14} weight="semi-bold">
                        {t('Confirmer')}
                    </StyledText>
                )}
            </Button>
        </VStack>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
});
