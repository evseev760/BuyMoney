import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import WebApp from "@twa-dev/sdk";
import en from "locales/en/translation.json";
import ru from "locales/ru/translation.json";

const resources = {
  en: { translation: en },
  ru: { translation: ru },
};

i18n
  .use(LanguageDetector) // Определяет язык
  .use(initReactI18next) // Инициализация react-i18next
  .init({
    resources,
    fallbackLng: WebApp.initDataUnsafe.user?.language_code || "en", //,
    debug: true,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
