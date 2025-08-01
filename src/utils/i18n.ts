import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enCommon from '@/locales/en/common.json';
import ruCommon from '@/locales/ru/common.json';
import esCommon from '@/locales/es/common.json';
import frCommon from '@/locales/fr/common.json';
import deCommon from '@/locales/de/common.json';
import itCommon from '@/locales/it/common.json';
import ptCommon from '@/locales/pt/common.json';
import trCommon from '@/locales/tr/common.json';
import plCommon from '@/locales/pl/common.json';
import ukCommon from '@/locales/uk/common.json';
import zhCommon from '@/locales/zh/common.json';
import jaCommon from '@/locales/ja/common.json';
import arCommon from '@/locales/ar/common.json';
import hiCommon from '@/locales/hi/common.json';
import faCommon from '@/locales/fa/common.json';
import nlCommon from '@/locales/nl/common.json';
import svCommon from '@/locales/sv/common.json';
import ptBRCommon from '@/locales/pt-BR/common.json';
import esMXCommon from '@/locales/es-MX/common.json';

const resources = {
  en: { common: enCommon },
  ru: { common: ruCommon },
  es: { common: esCommon },
  fr: { common: frCommon },
  de: { common: deCommon },
  it: { common: itCommon },
  pt: { common: ptCommon },
  tr: { common: trCommon },
  pl: { common: plCommon },
  uk: { common: ukCommon },
  zh: { common: zhCommon },
  ja: { common: jaCommon },
  ar: { common: arCommon },
  hi: { common: hiCommon },
  fa: { common: faCommon },
  nl: { common: nlCommon },
  sv: { common: svCommon },
  'pt-BR': { common: ptBRCommon },
  'es-MX': { common: esMXCommon },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    defaultNS: 'common',
    ns: ['common'],

    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'galaxy_wheel_language'
    },

    interpolation: {
      escapeValue: false
    },

    react: {
      useSuspense: false
    }
  });

export default i18n;
