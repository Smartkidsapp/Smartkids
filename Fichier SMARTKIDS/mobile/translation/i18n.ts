import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { deleteItemAsync, setItemAsync, getItemAsync } from 'expo-secure-store';
import en from "./en.json";
import fr from "./fr.json";

const STORE_LANGUAGE_KEY = "settings.lang";

const languageDetectorPlugin: any = {
    type: "languageDetector",
    async: true,
    init: () => { },
    detect: async function (callback: (lang: string) => void) {
        try {
            // get stored language from Async storage
            // put your own language detection logic here
            await getItemAsync(STORE_LANGUAGE_KEY).then((language: string | null) => {
                if (language) {
                    //if language was stored before, use this language in the app
                    return callback(language);
                } else {
                    //if language was not stored yet, use english
                    return callback("fr");
                }
            });
        } catch (error) {
            console.log("Error reading language", error);
        }
    },
    cacheUserLanguage: async function (language: string) {
        try {
            //save a user's language choice in Async storage
            await setItemAsync(STORE_LANGUAGE_KEY, language);
        } catch (error) { }
    },
};

const resources = {
    en: {
        translation: en,
    },
    fr: {
        translation: fr,
    },
};

i18n.use(initReactI18next).use(languageDetectorPlugin).init({
    resources,
    compatibilityJSON: 'v3',
    // fallback language is set to english
    fallbackLng: "fr",
    interpolation: {
        escapeValue: false,
    },
});
export default i18n;