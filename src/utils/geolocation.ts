import axios from 'axios';
import type { GeolocationData, ExchangeRate, SupportedLanguage, SupportedCurrency } from '@/types';

const FALLBACK_DATA: GeolocationData = {
  country: 'United States',
  country_code: 'US',
  currency: 'USD',
  language: 'en',
  timezone: 'America/New_York'
};

export async function detectUserLocation(): Promise<GeolocationData> {
  try {
    // Try ipapi.co first
    const response = await axios.get('https://ipapi.co/json/', {
      timeout: 5000
    });

    if (response.data && response.data.country_code) {
      return {
        country: response.data.country_name || FALLBACK_DATA.country,
        country_code: response.data.country_code,
        currency: response.data.currency || getCurrencyByCountry(response.data.country_code),
        language: getLanguageByCountry(response.data.country_code),
        timezone: response.data.timezone || FALLBACK_DATA.timezone
      };
    }
  } catch (error) {
    console.warn('ipapi.co failed, trying geojs.io');
  }

  try {
    // Fallback to geojs.io
    const response = await axios.get('https://get.geojs.io/v1/ip/geo.json', {
      timeout: 5000
    });

    if (response.data && response.data.country_code) {
      return {
        country: response.data.country || FALLBACK_DATA.country,
        country_code: response.data.country_code,
        currency: getCurrencyByCountry(response.data.country_code),
        language: getLanguageByCountry(response.data.country_code),
        timezone: response.data.timezone || FALLBACK_DATA.timezone
      };
    }
  } catch (error) {
    console.warn('geojs.io failed, using fallback');
  }

  // Use browser language as additional fallback
  const browserLang = navigator.language.split('-')[0] as SupportedLanguage;
  return {
    ...FALLBACK_DATA,
    language: ['en', 'ru', 'es', 'fr', 'de', 'tr', 'ar', 'ja', 'zh', 'pt'].includes(browserLang) ? browserLang : 'en'
  };
}

export async function convertCurrency(amount: number, fromCurrency: string, toCurrency: string): Promise<number> {
  if (fromCurrency === toCurrency) return amount;

  try {
    const response = await axios.get(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`, {
      timeout: 5000
    });

    const rate = response.data.rates[toCurrency];
    if (rate) {
      return Math.round(amount * rate * 100) / 100;
    }
  } catch (error) {
    console.warn('Currency conversion failed:', error);
  }

  return amount; // Return original amount if conversion fails
}

function getCurrencyByCountry(countryCode: string): SupportedCurrency {
  const currencyMap: Record<string, SupportedCurrency> = {
    'US': 'USD', 'GB': 'GBP', 'JP': 'JPY', 'CN': 'CNY',
    'RU': 'RUB', 'UA': 'UAH', 'BY': 'BYN', 'KZ': 'KZT',
    'UZ': 'UZS', 'AM': 'AMD', 'GE': 'GEL', 'AZ': 'AZN',
    'TR': 'TRY', 'DE': 'EUR', 'FR': 'EUR', 'IT': 'EUR',
    'ES': 'EUR', 'PT': 'EUR', 'NL': 'EUR', 'BE': 'EUR',
    'AT': 'EUR', 'FI': 'EUR', 'IE': 'EUR', 'GR': 'EUR',
    'BR': 'BRL', 'MX': 'MXN', 'IN': 'INR', 'KR': 'KRW',
    'CA': 'CAD', 'AU': 'AUD', 'PL': 'PLN', 'CZ': 'CZK',
    'HU': 'HUF', 'RO': 'RON', 'BG': 'BGN', 'HR': 'HRK',
    'DK': 'DKK', 'NO': 'NOK', 'SE': 'SEK', 'CH': 'CHF',
    'SG': 'SGD', 'HK': 'HKD', 'NZ': 'NZD', 'ZA': 'ZAR',
    'TH': 'THB', 'MY': 'MYR', 'ID': 'IDR', 'PH': 'PHP',
    'VN': 'VND'
  };

  return currencyMap[countryCode] || 'USD';
}

function getLanguageByCountry(countryCode: string): SupportedLanguage {
  const languageMap: Record<string, SupportedLanguage> = {
    'RU': 'ru', 'UA': 'ru', 'BY': 'ru', 'KZ': 'ru',
    'UZ': 'ru', 'AM': 'ru', 'GE': 'ru', 'AZ': 'ru',
    'ES': 'es', 'MX': 'es', 'AR': 'es', 'CO': 'es',
    'PE': 'es', 'CL': 'es', 'VE': 'es', 'EC': 'es',
    'FR': 'fr', 'BE': 'fr', 'CA': 'fr', 'CH': 'fr',
    'DE': 'de', 'AT': 'de', 'TR': 'tr', 'SA': 'ar',
    'AE': 'ar', 'EG': 'ar', 'MA': 'ar', 'DZ': 'ar',
    'JP': 'ja', 'CN': 'zh', 'TW': 'zh', 'HK': 'zh',
    'BR': 'pt', 'PT': 'pt'
  };

  return languageMap[countryCode] || 'en';
}
export async function getLocationByIp(ip: string): Promise<GeolocationData> {
  try {
    const response = await axios.get(`https://ipapi.co/${ip}/json/`, {
      timeout: 5000,
    });

    if (response.data && response.data.country_code) {
      return {
        country: response.data.country_name || FALLBACK_DATA.country,
        country_code: response.data.country_code,
        currency: response.data.currency || getCurrencyByCountry(response.data.country_code),
        language: getLanguageByCountry(response.data.country_code),
        timezone: response.data.timezone || FALLBACK_DATA.timezone,
      };
    }
  } catch (error) {
    console.warn('ipapi.co failed for IP lookup, using fallback');
  }

  return FALLBACK_DATA;
}
