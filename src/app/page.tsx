'use client';

import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Volume2, VolumeX, MessageCircle } from 'lucide-react';
import { WheelOfFortune } from '@/components/wheel/WheelOfFortune';
import { SpinTimer } from '@/components/wheel/SpinTimer';
import { CosmicDecorations } from '@/components/wheel/CosmicDecorations';
import { ShareSpin } from '@/components/wheel/ShareSpin';
import SpinResult from '@/components/wheel/SpinResult';
import SupportChat from '@/components/wheel/SupportChat';
import { detectUserLocation } from '@/utils/geolocation';
import { useSound } from '@/hooks/useSound';
import { useOptimizedSpin } from '@/hooks/useOptimizedSpin';
import { analytics, initPerformanceTracking } from '@/utils/analytics';
import { preloadCriticalImages } from '@/utils/imageOptimization';
import { getCurrencyRate, getCurrencySymbol } from '@/utils/currencies';
import type { GeolocationData, SpinResult as SpinResultType } from '@/types';
import '../utils/i18n';
import { getUserId, isNewUser } from '@/utils/userId';

// Loading screen
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

// Language toggle button
function LanguageToggle({
  userLang,
  currentLang,
  onToggle
}: {
  userLang: string;
  currentLang: string;
  onToggle: () => void;
}) {
  const nextLang = currentLang === 'en' ? userLang : 'en';
  const flagCode = nextLang === 'en' ? 'gb' : nextLang;

  return (
    <button
      onClick={onToggle}
      style={{
        width: '42px',
        height: '42px',
        borderRadius: '50%',
        border: 'none',
        backgroundImage: `url(https://flagcdn.com/w40/${flagCode}.png)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        cursor: 'pointer',
      }}
      className="fixed top-4 left-4 z-20"
      title={`Switch to ${nextLang.toUpperCase()}`}
    />
  );
}

export default function HomePage() {
  const { t, i18n } = useTranslation();
  const { toggleSound, isMuted } = useSound();

  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [geoData, setGeoData] = useState<GeolocationData | null>(null);
  const [spinResult, setSpinResult] = useState<SpinResultType | null>(null);
  const [showSupport, setShowSupport] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState('USD');

  // Новый стейт для языков
  const [userLang, setUserLang] = useState('en'); // язык пользователя
  const [currentLang, setCurrentLang] = useState('en'); // текущий язык страницы

  const {
    spinStatus,
    availableSpins,
    updateAvailableSpins,
    updateSpinStatus,
    handleSpinComplete
  } = useOptimizedSpin(selectedCurrency);

  const initializeApp = useCallback(async () => {
    try {
      analytics.init();
      initPerformanceTracking();
      preloadCriticalImages();

      const isNew = isNewUser();
      const userId = getUserId();
      analytics.trackUserAction('page_visit', { isNew });

      fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'visit', userId, isNew }),
      });

      const locationData = await detectUserLocation();
      setGeoData(locationData);

      if (locationData.currency) {
        setSelectedCurrency(locationData.currency);
        localStorage.setItem('galaxy_wheel_currency', locationData.currency);
      }

      const detectedLang = locationData.language || navigator.language.split('-')[0] || 'en';
      setUserLang(detectedLang);

      const savedLang = localStorage.getItem('galaxy_wheel_language') || detectedLang;
      setCurrentLang(savedLang);
      i18n.changeLanguage(savedLang);

      localStorage.setItem('galaxy_wheel_language', savedLang);
      document.cookie = `galaxy_wheel_language=${savedLang}; path=/; max-age=2592000`;

      updateSpinStatus();
      updateAvailableSpins();
    } catch (error) {
      console.error('Initialization error:', error);
      analytics.trackError(error as Error, 'initialization');
    } finally {
      setLoading(false);
    }
  }, [i18n, updateSpinStatus, updateAvailableSpins]);

  useEffect(() => {
    setMounted(true);
    initializeApp();
  }, [initializeApp]);

  const handleSpinResult = (result: SpinResultType) => {
    setSpinResult(result);
    handleSpinComplete(result);
    analytics.trackUserAction('spin_complete', { amount: result.amount, currency: result.currency });
  };

  const handleTimerEnd = () => {
    updateSpinStatus();
    updateAvailableSpins();
    analytics.trackUserAction('timer_end');
  };

  const toggleLanguage = () => {
    const newLang = currentLang === 'en' ? userLang : 'en';
    setCurrentLang(newLang);
    i18n.changeLanguage(newLang);
    localStorage.setItem('galaxy_wheel_language', newLang);
    document.cookie = `galaxy_wheel_language=${newLang}; path=/; max-age=2592000`;
  };

  if (!mounted || loading) return <LoadingScreen />;

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Effects */}
      {/* <div className="cosmic-bg"></div> */}
      {/* <div className="stars"></div> */}
      {/* <CosmicDecorations /> */}

      {/* Language toggle */}
      <LanguageToggle userLang={userLang} currentLang={currentLang} onToggle={toggleLanguage} />

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

      {/* Main Content */}
      <main className="relative z-10 flex flex-col items-center justify-center px-4 pb-8">
        {spinStatus.hasSpunToday && (
          <SpinTimer nextSpinTime={spinStatus.nextSpinTime} onTimerEnd={handleTimerEnd} />
        )}
        <WheelOfFortune
          currency={selectedCurrency}
          availableSpins={availableSpins}
          onSpinComplete={handleSpinResult}
        />
        {geoData && (
          <div className="mt-8 text-center text-gray-400 text-sm">
            🌍 {geoData.country} • 💰 {geoData.currency}
          </div>
        )}
      </main>

      {/* Control Buttons */}
      <div className="fixed top-4 right-4 z-20 flex gap-2">
        <button
          onClick={toggleSound}
          className="w-12 h-12 bg-gray-800 bg-opacity-80 rounded-full flex items-center justify-center text-white hover:bg-opacity-100 transition-all"
          title={isMuted ? t('soundOff') : t('soundOn')}
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
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
      {showSupport && (
        <SupportChat isOpen={showSupport} onClose={() => setShowSupport(false)} />
      )}

      {/* Share Spin */}
      <ShareSpin onShareSuccess={updateAvailableSpins} currency={selectedCurrency} bonusAmountUSD={25} />
    </div>
  );
}
