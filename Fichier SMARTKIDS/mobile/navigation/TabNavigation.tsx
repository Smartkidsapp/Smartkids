import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StyledText } from "../components/StyledText";
import { FontAwesome, FontAwesome5, Ionicons } from "@expo/vector-icons";
import { Box, HStack } from "@gluestack-ui/themed";
import { Platform, Pressable } from "react-native";
import HomeScreen from "../screens/Tabs/HomeScreen";
import ProfilScreen from "../screens/Tabs/ProfilScreen";
import Colors from "../constants/Colors";
import MapsScreen from "../screens/Tabs/MapsScreen";
import { useAppSelector } from "@/src/store";
import { selectUser } from "@/src/features/auth/auth.slice";
import MyEtablissementScreen from "@/screens/MyEtablissementSCreen";
import { useTranslation } from "react-i18next";

export type StackTabParamList = {
    home: undefined;
    profil: undefined;
    maps: undefined;
    'my-etbs': undefined;
};

export default function TabNavigation() {

    const { t } = useTranslation();

    const Tab = createBottomTabNavigator<StackTabParamList>();

    const user = useAppSelector(selectUser);

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarHideOnKeyboard: true,
                tabBarShowLabel: true,
                headerTitleAlign: "center",
                tabBarStyle: {
                    backgroundColor: "#fff",
                    borderRadius: 30,
                    marginBottom: 44,
                    height: 62,
                    paddingTop: Platform.OS == "ios" ? 30 : 16,
                    marginHorizontal: 24,
                    shadowColor: "rgba(30, 30, 30, 0.3)",
                    shadowOffset: {
                        width: 0,
                        height: 3,
                    },
                    shadowOpacity: 0.27,
                    shadowRadius: 4.65,
                    elevation: 6,
                    position: 'absolute',
                    display: ['maps', 'my-etbs'].includes(route.name) ? 'none' : 'flex',  // Hide tabBar on Maps screen
                },
                headerStyle: {
                    backgroundColor: '#fff', //Colors.primaryColor,
                    //height: 123,
                    shadowColor: 'transparent', // this covers iOS
                    elevation: 0,
                },
                headerShadowVisible: false,
                tabBarItemStyle: {
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                }
            })}
        >
            <Tab.Screen
                name="home"
                component={HomeScreen}
                options={{
                    title: '',
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <Box bgColor={focused ? "#231F20" : 'transparent'} w={focused ? 34 : 'auto'} h={34} rounded="$full" justifyContent="center" alignItems="center">
                            <Ionicons size={22} name="home" color={focused ? Colors.light.textPrimary : 'rgba(30, 30, 30, 0.6)'} />
                            {
                                !focused && (
                                    <StyledText weight='semi-bold' size={12} color={'rgba(30, 30, 30, 0.6)'}>{t('tabBar.explorer')}</StyledText>
                                )
                            }
                        </Box>
                    ),
                }}
            />
            <Tab.Screen
                name="maps"
                component={MapsScreen}
                options={{
                    title: '',
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <Box bgColor={focused ? "#231F20" : 'transparent'} w={focused ? 34 : 'auto'} h={34} rounded="$full" justifyContent="center" alignItems="center">
                            <Ionicons size={22} name="location-sharp" color={focused ? Colors.light.textPrimary : 'rgba(30, 30, 30, 0.6)'} />
                            {
                                !focused && (
                                    <StyledText weight='semi-bold' size={12} color={'rgba(30, 30, 30, 0.6)'}>{t('tabBar.maps')}</StyledText>
                                )
                            }
                        </Box>
                    ),
                }}
            />
            {
                user?.isSeller && (
                    <Tab.Screen
                        name='my-etbs'
                        component={MyEtablissementScreen}
                        options={{
                            title: '',
                            headerShown: false,
                            tabBarIcon: ({ focused }) => (
                                <Box bgColor={focused ? "#231F20" : 'transparent'} w={focused ? 34 : 'auto'} h={34} rounded="$full" justifyContent="center" alignItems="center">
                                    <FontAwesome5 name="store" size={20} color={focused ? Colors.light.textPrimary : 'rgba(30, 30, 30, 0.6)'} />
                                    {
                                        !focused && (
                                            <StyledText style={{ marginTop: 3 }} weight='semi-bold' size={12} color={'rgba(30, 30, 30, 0.6)'}>{t('tabBar.etablissement')}</StyledText>
                                        )
                                    }
                                </Box>
                            ),
                            tabBarLabel: ''
                        }}
                    />
                )
            }
            <Tab.Screen
                name="profil"
                component={ProfilScreen}
                options={{
                    title: 'Profil',
                    headerShown: true,
                    tabBarIcon: ({ focused }) => (
                        <Box bgColor={focused ? "#231F20" : 'transparent'} w={focused ? 34 : 'auto'} h={34} rounded="$full" justifyContent="center" alignItems="center">
                            <Ionicons size={22} name="person" color={focused ? Colors.light.textPrimary : 'rgba(30, 30, 30, 0.6)'} />
                            {
                                !focused && (
                                    <StyledText weight='semi-bold' size={12} color={'rgba(30, 30, 30, 0.6)'}>{t('tabBar.profil')}</StyledText>
                                )
                            }
                        </Box>
                    ),
                    tabBarLabel: ''
                }}
            />
        </Tab.Navigator>
    )
}