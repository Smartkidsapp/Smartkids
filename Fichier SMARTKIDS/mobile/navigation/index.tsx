import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { ChevronLeftIcon, Pressable, View } from '@gluestack-ui/themed';
import { TouchableOpacity, StyleSheet } from 'react-native';
import OnboardingScreen from '../screens/OnboardingScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import VerifyEmailScreen from '../screens/VerifyEmail';
import PasswordForgottenScreen from '../screens/PasswordForgottenScreen';
import PasswordRecoveryCodeScreen from '../screens/PasswordRecoveryCodeScreen';
import TabNavigation from './TabNavigation';
import EtablissementScreen from '../screens/EtablissementSCreen';
import BecomeOwnerScreen from '../screens/BecomeOwnerScreen';
import PasswordResetScreen from '../screens/PasswordResetScreen';
import useAppInit from '../hooks/useAppInit';
import * as SplashScreen from 'expo-splash-screen';
import { useAppSelector } from '../src/store';
import { selectUser } from '../src/features/auth/auth.slice';
import { useLazyGetProfileQuery } from '../src/features/users/store/user.apiSlice';
import InformationScreen from '../screens/InformationScreen';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import UpdatePasswordScreen from '../screens/UpdatePasswordScreen';
import SubscriptionScreen from '@/screens/SubscriptionScreen';
import EditMyEtbsScreen from '@/screens/EditMyEtbsScreen';
import MyEtablissementScreen from '@/screens/MyEtablissementSCreen';
import BoostageScreen from '@/screens/BoostageScreen';
import BoostageHistoriqueScreen from '@/screens/BoostageHistoriqueScreen';
import { StyledText } from '@/components/StyledText';
import FavoritesScreen from '@/screens/FavoritesScreen';
import { useTranslation } from 'react-i18next';

export type StackParamList = {
  index: undefined;
  onboarding: undefined;
  login: undefined;
  register: undefined;
  'verify-email': {
    email: string;
    token: string
  };
  'forgetten-password': | { navigateBackTo?: keyof StackParamList } | undefined;
  'password-recovery': {
    email: string;
    token: string;
    navigateBackTo?: keyof StackParamList;
  };
  'password-reset': {
    email: string;
    token: string;
    navigateBackTo?: keyof StackParamList;
  };
  'tab-navigator': undefined;
  etbs: { id: string, distance?: number };
  'become-owner': undefined;
  'edit-info': undefined;
  'update-password': undefined;
  subscription: undefined;
  'edit-my-etbs': undefined;
  'my-etbs': undefined;
  boostage: { id: string };
  'boostage-historique': undefined;
  'favorites': undefined;
};

const Stack = createNativeStackNavigator<StackParamList>();

export function MainNavigator() {

  const { t } = useTranslation();

  const [initialRoute, setInitialRoute] = useState<keyof StackParamList>('onboarding');


  return (
    <Stack.Navigator
      initialRouteName={'onboarding'}
      screenOptions={{
        headerShown: false,
        animationDuration: 300,
      }}>
      <Stack.Screen
        name="onboarding"
        component={OnboardingScreen}
        options={{
          animation: 'fade',
        }}
      />
      <Stack.Screen
        name="login"
        component={LoginScreen}
        options={{
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="register"
        component={RegisterScreen}
        options={{
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="verify-email"
        //@ts-ignore
        component={VerifyEmailScreen}
        options={{
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="forgetten-password"
        component={PasswordForgottenScreen}
        options={{
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="password-recovery"
        component={PasswordRecoveryCodeScreen}
        options={{
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="password-reset"
        component={PasswordResetScreen}
        options={{
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="tab-navigator"
        component={TabNavigation}
        options={{
          animation: 'fade'
        }}
      />
      <Stack.Screen
        name="etbs"
        component={EtablissementScreen}
        options={{
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="become-owner"
        component={BecomeOwnerScreen}
        options={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="edit-info"
        component={InformationScreen}
        options={({ navigation }) => ({
          title: `${t('title.modifier_vos_informations')}`,
          headerShown: true,
          animation: 'slide_from_right',
          headerLeft: () => (
            <Pressable
              bg="$primary"
              w={32}
              h={32}
              rounded="$full"
              justifyContent='center'
              alignItems='center'
              onPress={() => navigation.goBack()}
            >
              <Ionicons name='chevron-back' size={20} color={"#000"} />
            </Pressable>
          ),
        })}
      />
      <Stack.Screen
        name="update-password"
        component={UpdatePasswordScreen}
        options={({ navigation }) => ({
          title: `${t('mot_de_passe')}`,
          headerShown: true,
          animation: 'slide_from_right',
          headerLeft: () => (
            <Pressable
              bg="$primary"
              w={32}
              h={32}
              rounded="$full"
              justifyContent='center'
              alignItems='center'
              onPress={() => navigation.goBack()}
            >
              <Ionicons name='chevron-back' size={20} color={"#000"} />
            </Pressable>
          ),
        })}
      />
      <Stack.Screen
        name="subscription"
        component={SubscriptionScreen}
        options={({ navigation }) => ({
          title: `${t('abonnement')}`,
          headerShown: true,
          animation: 'slide_from_right',
          headerLeft: () => (
            <Pressable
              bg="$primary"
              w={32}
              h={32}
              rounded="$full"
              justifyContent='center'
              alignItems='center'
              onPress={() => navigation.goBack()}
            >
              <Ionicons name='chevron-back' size={20} color={"#000"} />
            </Pressable>
          ),
        })}
      />
      <Stack.Screen
        name="edit-my-etbs"
        component={EditMyEtbsScreen}
        options={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="my-etbs"
        component={MyEtablissementScreen}
        options={{
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="boostage"
        component={BoostageScreen}
        options={({ navigation }) => ({
          title: `${t('title.promouvoir')}`,
          headerShown: true,
          animation: 'slide_from_right',
          headerLeft: () => (
            <Pressable
              bg="$primary"
              w={32}
              h={32}
              rounded="$full"
              justifyContent='center'
              alignItems='center'
              onPress={() => navigation.goBack()}
            >
              <Ionicons name='chevron-back' size={20} color={"#000"} />
            </Pressable>
          ),
          headerRight: () => (
            <Pressable
              justifyContent='center'
              alignItems='center'
              onPress={() => navigation.navigate('boostage-historique')}
            >
              <StyledText size={14} weight='semi-bold' style={{textDecorationStyle: 'solid', textDecorationColor: 'black', textDecorationLine: 'underline'}}>Historique</StyledText>
            </Pressable>
          )
        })}
      />
      <Stack.Screen
        name="boostage-historique"
        component={BoostageHistoriqueScreen}
        options={({ navigation }) => ({
          title: `${t('title.historique')}`,
          headerShown: true,
          animation: 'slide_from_right',
          headerLeft: () => (
            <Pressable
              bg="$primary"
              w={32}
              h={32}
              rounded="$full"
              justifyContent='center'
              alignItems='center'
              onPress={() => navigation.goBack()}
            >
              <Ionicons name='chevron-back' size={20} color={"#000"} />
            </Pressable>
          ),
        })}
      />
      <Stack.Screen
        name="favorites"
        component={FavoritesScreen}
        options={({ navigation }) => ({
          title: `${t('title.favoris')}`,
          headerShown: true,
          animation: 'slide_from_right',
          headerLeft: () => (
            <Pressable
              bg="$primary"
              w={32}
              h={32}
              rounded="$full"
              justifyContent='center'
              alignItems='center'
              onPress={() => navigation.goBack()}
            >
              <Ionicons name='chevron-back' size={20} color={"#000"} />
            </Pressable>
          ),
        })}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 20,
    paddingLeft: 0,
    paddingTop: 50,
    paddingBottom: 10,
    columnGap: 0,
    backgroundColor: '#FFF'
    // justifyContent: 'space-between',
  },
});
