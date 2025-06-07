import { ActivityIndicator, Pressable, StyleSheet } from 'react-native';
import React from 'react';
import { Button, HStack } from '@gluestack-ui/themed';
import { StyledText } from '../../../components/StyledText';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { getItemAsync } from 'expo-secure-store';
import { StackParamList } from '../../../navigation';
import { useAppDispatch } from '../../store';
import { useSignoutMutation } from './auth.apiSlice';
import { StackTabParamList } from '../../../navigation/TabNavigation';
import { logout } from './auth.slice';
import { REFRESH_TOKEN_KEY } from './auth.request';
import { useTranslation } from 'react-i18next';

export default function LogoutBtn() {

    const { t } = useTranslation();

    const navigation =
        useNavigation<StackNavigationProp<StackTabParamList, 'profil', undefined>>();
    const dispatch = useAppDispatch();
    const [logoutFromServer, { isLoading }] = useSignoutMutation();

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
        <Button
            mt={32}
            borderRadius={10}
            backgroundColor='$primary'
            h={50}
            onPress={handleLogout}
        >
            <HStack flex={1} alignItems="center" justifyContent='center'>
                {isLoading ? (
                    <ActivityIndicator size="small" color="rgba(8, 33, 45, 0.5)" />
                ) : (
                    <StyledText color='black' size={14} weight="bold">
                        {t('profil.loggout')}
                    </StyledText>
                )}
            </HStack>
        </Button>
    );
}

const styles = StyleSheet.create({
    title: {
        flex: 1,
    },
});
