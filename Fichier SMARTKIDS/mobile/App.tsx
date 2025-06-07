/**
 * Intl polyfills.
 */
import "@formatjs/intl-getcanonicallocales/polyfill";
import "@formatjs/intl-locale/polyfill";
import "@formatjs/intl-pluralrules/polyfill";
import "@formatjs/intl-pluralrules/locale-data/fr";
import "@formatjs/intl-numberformat/polyfill";
import "@formatjs/intl-numberformat/locale-data/fr";
import "@formatjs/intl-datetimeformat/polyfill";
import "@formatjs/intl-datetimeformat/locale-data/fr";
import "@formatjs/intl-datetimeformat/add-all-tz";

import 'react-native-gesture-handler';
import { createConfig, GluestackUIProvider } from '@gluestack-ui/themed';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { MainNavigator } from './navigation';
import { config } from '@gluestack-ui/config';
import { useFonts } from 'expo-font';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { Provider } from 'react-redux';
import { store } from './src/store';
import * as SplashScreen from 'expo-splash-screen';
import { SheetProvider } from "react-native-actions-sheet";
import "@/components/sheet";
import './translation/i18n';

export default function App() {

  // Prevent the splash screen from auto-hiding
  SplashScreen.preventAutoHideAsync();

  const [loaded, error] = useFonts({
    "Urbanist-Bold": require('./assets/fonts/Urbanist-Bold.ttf'),
    "Urbanist-ExtraBold": require('./assets/fonts/Urbanist-ExtraBold.ttf'),
    "Urbanist-Italic": require('./assets/fonts/Urbanist-Italic.ttf'),
    "Urbanist-Medium": require('./assets/fonts/Urbanist-Medium.ttf'),
    "Urbanist-Regular": require('./assets/fonts/Urbanist-Regular.ttf'),
    "Urbanist-SemiBold": require('./assets/fonts/Urbanist-SemiBold.ttf'),
  });

  if (!loaded) {
    return null;
  }

  const extendedConfig = createConfig({
    ...config,
    tokens: {
      ...config.tokens,
      colors: {
        ...config.tokens.colors,
        primary: 'rgba(229, 215, 197, 1)',
        danger: 'rgba(226, 3, 29, 1)',
        secondary: 'rgba(253, 202, 66, 1)',
        text: 'rgba(8, 33, 45, 1)',
        primaryMuted: 'rgba(251, 240, 212, 1)',
        gray: 'rgba(255, 255, 255, 0.9)',
      },
    },
  });

  return (
    <Provider store={store}>
      <NavigationContainer>
        <GluestackUIProvider config={extendedConfig}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <BottomSheetModalProvider>
              <SheetProvider>
                <MainNavigator />
              </SheetProvider>
            </BottomSheetModalProvider>
          </GestureHandlerRootView>
        </GluestackUIProvider>
      </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
