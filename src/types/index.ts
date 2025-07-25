export interface GeolocationData {
  country: string;
  country_code: string;
  currency: string;
  language: string;
  timezone: string;
}

export interface ExchangeRate {
  result: string;
  base_code: string;
  target_code: string;
  conversion_rate: number;
}

export interface SpinResult {
  amount: number;
  localAmount: number;
  currency: string;
  promocode: string;
  sectorIndex: number;
}

export interface WheelSector {
  amount: number;
  color: string;
  promocode: string;
  probability: number;
}

export interface UserSpinStatus {
  lastSpinDate: string;
  hasSpunToday: boolean;
  nextSpinTime: number;
}

export interface SoundManager {
  playSpinSound: () => void;
  playWinSound: () => void;
  toggleSound: () => void;
  isMuted: boolean;
}

export interface ShareData {
  amount: number;
  currency: string;
  promocode: string;
  message: string;
}

export type SupportedLanguage = 'en' | 'ru' | 'es' | 'fr' | 'de' | 'tr' | 'ar' | 'ja' | 'zh' | 'pt';

export type SupportedCurrency = 'USD' | 'EUR' | 'RUB' | 'GBP' | 'JPY' | 'CNY' | 'AZN' | 'TRY' | 'UAH' | 'KZT' | 'UZS' | 'BYN' | 'AMD' | 'GEL' | 'MXN' | 'BRL' | 'INR' | 'KRW' | 'CAD' | 'AUD' | 'PLN' | 'CZK' | 'HUF' | 'RON' | 'BGN' | 'HRK' | 'DKK' | 'NOK' | 'SEK' | 'CHF' | 'SGD' | 'HKD' | 'NZD' | 'ZAR' | 'THB' | 'MYR' | 'IDR' | 'PHP' | 'VND';
