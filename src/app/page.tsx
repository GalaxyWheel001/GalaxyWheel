'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Volume2, VolumeX, MessageCircle } from 'lucide-react';
import { WheelOfFortune } from '@/components/wheel/WheelOfFortune';
import { SpinResult } from '@/components/wheel/SpinResult';
import { SpinTimer } from '@/components/wheel/SpinTimer';
import { CosmicDecorations } from '@/components/wheel/CosmicDecorations';
import { SupportChat } from '@/components/wheel/SupportChat';
import { ShareSpin } from '@/components/wheel/ShareSpin';
import { detectUserLocation } from '@/utils/geolocation';
import { getSpinStatus, getAvailableSpins } from '@/utils/spin';
import { useSound } from '@/hooks/useSound';
import type { GeolocationData, UserSpinStatus, SpinResult as SpinResultType } from '@/types';
import '../utils/i18n';
import { CurrencyDropdown } from '@/components/wheel/CurrencyDropdown';
import { CURRENCIES } from '@/utils/currencies';
import { useMemo } from 'react';
import { getCurrencySymbol, getCurrencyRate } from '@/utils/currencies';
import { getUserId, isNewUser } from '@/utils/userId';

// Простой LanguageDropdown прямо здесь
const LANGUAGES = [
  { code: 'en', label: 'EN' },
  { code: 'ru', label: 'RU' },
  { code: 'es', label: 'ES' },
  { code: 'fr', label: 'FR' },
  { code: 'de', label: 'DE' },
  { code: 'it', label: 'IT' },
  { code: 'pt', label: 'PT' },
  { code: 'tr', label: 'TR' },
  { code: 'pl', label: 'PL' },
  { code: 'uk', label: 'UA' },
  { code: 'zh', label: 'ZH' },
  { code: 'ja', label: 'JA' },
  { code: 'ar', label: 'AR' },
  { code: 'hi', label: 'HI' },
  { code: 'fa', label: 'FA' },
  { code: 'nl', label: 'NL' },
  { code: 'sv', label: 'SV' },
  { code: 'pt-BR', label: 'PT-BR' },
  { code: 'es-MX', label: 'ES-MX' },
];

function LanguageDropdown({ value, onChange }: { value: string; onChange: (lang: string) => void }) {
  return (
    <select
      className="bg-gray-800 text-white px-3 py-2 rounded-lg border border-cyan-400 focus:outline-none focus:border-cyan-500 text-sm"
      value={value}
      onChange={e => onChange(e.target.value)}
      style={{ minWidth: 60 }}
    >
      {LANGUAGES.map(lang => (
        <option key={lang.code} value={lang.code}>{lang.label}</option>
      ))}
    </select>
  );
}

// Simple loading component for SSR
function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="cosmic-bg"></div>
      <div className="stars"></div>
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <div className="text-xl orbitron text-cyan-400">Loading...</div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const { t, i18n } = useTranslation();
  const { toggleSound, isMuted } = useSound();

  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [geoData, setGeoData] = useState<GeolocationData | null>(null);
  const [spinStatus, setSpinStatus] = useState<UserSpinStatus>({
    lastSpinDate: '',
    hasSpunToday: false,
    nextSpinTime: 0
  });
  const [availableSpins, setAvailableSpins] = useState(0);
  const [spinResult, setSpinResult] = useState<SpinResultType | null>(null);
  const [showSupport, setShowSupport] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);

  const updateAvailableSpins = useCallback(() => {
    setAvailableSpins(getAvailableSpins());
  }, []);

  const initializeApp = useCallback(async () => {
    try {
      const isNew = isNewUser();
      const userId = getUserId();

      // Send visit notification
      fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'visit', userId, isNew }),
      });

      // Detect user location and currency
      const locationData = await detectUserLocation();
      setGeoData(locationData);

      // Change language based on detected location
      if (locationData.language && i18n.language !== locationData.language) {
        await i18n.changeLanguage(locationData.language);
      }

      // Get spin status
      const status = getSpinStatus();
      setSpinStatus(status);
      updateAvailableSpins(); // Обновляем счетчик спинов

    } catch (error) {
      console.error('Initialization error:', error);
    } finally {
      setLoading(false);
    }
  }, [i18n, updateAvailableSpins]);

  useEffect(() => {
    setMounted(true);
    initializeApp();
    setSelectedLanguage(i18n.language);
  }, [initializeApp]);

  // Смена языка
  const handleLanguageChange = async (lang: string) => {
    setSelectedLanguage(lang);
    await i18n.changeLanguage(lang);
    localStorage.setItem('galaxy_wheel_language', lang);
  };

  useEffect(() => {
    // Инициализация валюты: localStorage -> geoData -> USD
    const stored = localStorage.getItem('galaxy_wheel_currency');
    if (stored && CURRENCIES.find(c => c.code === stored)) {
      setSelectedCurrency(stored);
    } else if (geoData?.currency && CURRENCIES.find(c => c.code === geoData.currency)) {
      setSelectedCurrency(geoData.currency);
      localStorage.setItem('galaxy_wheel_currency', geoData.currency);
    } else {
      setSelectedCurrency('USD');
    }

    // Инициализация языка: localStorage -> geoData -> i18n.language
    const storedLang = localStorage.getItem('galaxy_wheel_language');
    if (storedLang && storedLang !== i18n.language) {
      i18n.changeLanguage(storedLang);
      setSelectedLanguage(storedLang);
    }
  }, [geoData]);

  const handleSpinComplete = (result: SpinResultType) => {
    setSpinResult(result);
    // Update spin status
    const newStatus = getSpinStatus();
    setSpinStatus(newStatus);
    updateAvailableSpins(); // Обновляем счетчик спинов

    const userId = getUserId();
    fetch('/api/notify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ type: 'spin', userId, result }),
    });
  };

  const handleTimerEnd = () => {
    const newStatus = getSpinStatus();
    setSpinStatus(newStatus);
    updateAvailableSpins(); // Обновляем счетчик спинов
  };

  const rate = getCurrencyRate(selectedCurrency);
  const symbol = getCurrencySymbol(selectedCurrency);
  const shareAmount = `${symbol}${Math.round(25 * rate)}`;
  const shareMessage = t('shareMessage', {
    amount: shareAmount,
    currency: selectedCurrency,
    promocode: 'GALAXY-WHEEL'
  });

  if (!mounted || loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Effects */}
      {/* <div className="cosmic-bg"></div> */}
      {/* <div className="stars"></div> */}
      {/* <div className="particles"></div> */}
      {/* <CosmicDecorations /> */}

      {/* Header */}
      <header className="relative z-10 pt-8 pb-4">
        <div className="max-w-4xl mx-auto px-4 flex flex-col items-center justify-center relative">
          <h1 className="text-4xl md:text-6xl font-bold orbitron gradient-text mb-2 mx-auto text-center">
            {t('title')}
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto px-4 text-center">
            {t('subtitle')}
          </p>
        </div>
      </header>

      {/* Плавающая панель селекторов справа вверху */}
      <div
        className="fixed top-4 md:right-36 right-4 z-30 flex-row gap-2 bg-gray-900 bg-opacity-80 rounded-2xl shadow-xl p-2 items-center hidden md:flex"
        style={{ minWidth: 60 }}
      >
        <CurrencyDropdown value={selectedCurrency} onChange={setSelectedCurrency} />
        <LanguageDropdown value={selectedLanguage} onChange={handleLanguageChange} />
      </div>
      {/* На мобильных — снизу по центру */}
      <div
        className="fixed bottom-16 left-1/2 -translate-x-1/2 z-50 flex flex-row gap-4 bg-gray-900 bg-opacity-90 rounded-2xl shadow-2xl p-3 items-center md:hidden"
        style={{ minWidth: 60 }}
      >
        <div className="bg-white/10 border border-cyan-400 rounded-lg min-w-[90px] min-h-[44px] flex items-center justify-center">
          <CurrencyDropdown value={selectedCurrency} onChange={setSelectedCurrency} />
        </div>
        <div className="bg-white/10 border border-cyan-400 rounded-lg min-w-[90px] min-h-[44px] flex items-center justify-center">
          <LanguageDropdown value={selectedLanguage} onChange={handleLanguageChange} />
        </div>
      </div>

      {/* Main Content */}
      <main className="relative z-10 flex flex-col items-center justify-center px-4 pb-8">
        {/* Timer (if user has already spun) */}
        {spinStatus.hasSpunToday && (
          <SpinTimer
            nextSpinTime={spinStatus.nextSpinTime}
            onTimerEnd={handleTimerEnd}
          />
        )}

        {/* Wheel of Fortune */}
        <WheelOfFortune
          currency={selectedCurrency}
          availableSpins={availableSpins}
          onSpinComplete={handleSpinComplete}
        />

        {/* User Info */}
        {geoData && (
          <div
            className="mt-8 text-center text-gray-400 text-sm"
          >
            <p>🌍 {geoData.country} • 💰 {geoData.currency}</p>
          </div>
        )}
      </main>

      {/* Control Buttons */}
      <div className="fixed top-4 right-4 z-20 flex gap-2">
        {/* Sound Toggle */}
        <button
          onClick={toggleSound}
          className="w-12 h-12 bg-gray-800 bg-opacity-80 rounded-full flex items-center justify-center text-white hover:bg-opacity-100 transition-all"
          title={isMuted ? t('soundOff') : t('soundOn')}
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>

        {/* Support Button */}
        <button
          onClick={() => setShowSupport(!showSupport)}
          className="w-12 h-12 bg-blue-600 bg-opacity-80 rounded-full flex items-center justify-center text-white hover:bg-opacity-100 transition-all"
          title={t('support')}
        >
          <MessageCircle size={20} />
        </button>
      </div>

      {/* Spin Result Modal */}
      <AnimatePresence>
        {spinResult && (
          <SpinResult
            result={spinResult}
            onClose={() => setSpinResult(null)}
            currency={selectedCurrency}
          />
        )}
      </AnimatePresence>

      {/* Support Chat */}
      <SupportChat
        isOpen={showSupport}
        onClose={() => setShowSupport(false)}
      />

      {/* Share Spin */}
      <ShareSpin onShareSuccess={updateAvailableSpins} currency={selectedCurrency} bonusAmountUSD={25} />
    </div>
  );
}
