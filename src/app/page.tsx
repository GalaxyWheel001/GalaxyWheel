'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Volume2, VolumeX, MessageCircle } from 'lucide-react';
import { WheelOfFortune } from '@/components/wheel/WheelOfFortune';
import { SpinTimer } from '@/components/wheel/SpinTimer';
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
  const getFlagUrl = (lang: string) => {
    const code = lang === 'en' ? 'gb' : lang;
    return `https://flagcdn.com/w40/${code}.png`;
  };

  return (
    <button
      onClick={onToggle}
      style={{
        position: 'fixed',
        top: '15px',
        right: '15px',
        width: '42px',
        height: '42px',
        borderRadius: '50%',
        border: 'none',
        boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
        backgroundImage: `url(${getFlagUrl(currentLang)})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        cursor: 'pointer',
        zIndex: 9999
      }}
      title={currentLang === 'en' ? `Switch to ${userLang.toUpperCase()}` : 'Switch to EN'}
    />
  );
}

// Simple loading screen
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
  const [spinResult, setSpinResult] = useState<SpinResultType | null>(null);
  const [showSupport, setShowSupport] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState('USD');

  // Language states
  const [userLang, setUserLang] = useState('en');
  const [currentLang, setCurrentLang] = useState('en');

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

      // Detect user language
      const browserLang = locationData.language || navigator.language.split('-')[0] || 'en';
      setUserLang(browserLang);

      const savedLang = localStorage.getItem('galaxy_wheel_language') || browserLang;
      setCurrentLang(savedLang);
      await i18n.changeLanguage(savedLang);
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
    analytics.trackUserAction('spin_complete', { 
      amount: result.amount, 
      currency: result.currency 
    });
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

  if (!mounted || loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Language Toggle Button — всегда показываем */}
      <LanguageToggle
        userLang={userLang}
        currentLang={currentLang}
        onToggle={toggleLanguage}
      />

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
          <SpinTimer
            nextSpinTime={spinStatus.nextSpinTime}
            onTimerEnd={handleTimerEnd}
          />
        )}
        <WheelOfFortune
          currency={selectedCurrency}
          availableSpins={availableSpins}
          onSpinComplete={handleSpinResult}
        />
        {geoData && (
          <div className="mt-8 text-center text-gray-400 text-sm">
            <p>🌍 {geoData.country} • 💰 {geoData.currency}</p>
          </div>
        )}
      </main>

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
        <SupportChat
          isOpen={showSupport}
          onClose={() => setShowSupport(false)}
        />
      )}

      {/* Share Spin */}
      <ShareSpin onShareSuccess={updateAvailableSpins} currency={selectedCurrency} bonusAmountUSD={25} />
    </div>
  );
}
