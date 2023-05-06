import React from "react";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from './en'
import fa from './fa'
import ar from './ar'

const resources = {
  en: {
    translation: en
  },
  fa: {
    translation: fa
  },
  ar: {
    translation: ar
  }
}

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: "fa",
    fallbackLng: "fa",
    keySeparator: false,
    interpolation: {
      escapeValue: false // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
    }
  });

  export default i18n;