'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Volume2, VolumeX, MessageCircle } from 'lucide-react';
import { WheelOfFortune } from '@/components/wheel/WheelOfFortune';
import { SpinTimer } from '@/components/wheel/SpinTimer';
import { CosmicDecorations } from '@/components/wheel/CosmicDecorations';
import { ShareSpin } from '@/components/wheel/ShareSpin';
import { detectUserLocation } from '@/utils/geolocation';
import { useSound } from '@/hooks/useSound';
import { useOptimizedSpin } from '@/hooks/useOptimizedSpin';
import { analytics, initPerformanceTracking } from '@/utils/analytics';
import { preloadCriticalImages } from '@/utils/imageOptimization';
import { getCurrencyRate, getCurrencySymbol } from '@/utils/currencies';
import type { GeolocationData, SpinResult as SpinResultType } from '@/types';
import '../utils/i18n';
import { getUserId, isNewUser } from '@/utils/userId';
import { lazy, Suspense } from 'react';

// Lazy loaded components
const SpinResultComponent = lazy(() => import('@/components/wheel/SpinResult'));
const SupportChatComponent = lazy(() => import('@/components/wheel/SupportChat'));

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
  const [spinResult, setSpinResult] = useState<SpinResultType | null>(null);
  const [showSupport, setShowSupport] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState('USD');

  // Используем оптимизированный хук
  const {
    spinStatus,
    availableSpins,
    currencyRate,
    currencySymbol,
    updateAvailableSpins,
    updateSpinStatus,
    handleSpinComplete
  } = useOptimizedSpin(selectedCurrency);

  const initializeApp = useCallback(async () => {
    try {
      // Инициализируем аналитику
      analytics.init();
      initPerformanceTracking();
      preloadCriticalImages();

      const isNew = isNewUser();
      const userId = getUserId();

      // Отслеживаем посещение
      analytics.trackUserAction('page_visit', { isNew });

      // Send visit notification
      fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'visit', userId, isNew }),
      });

      // Detect user location and currency
      const locationData = await detectUserLocation();
      setGeoData(locationData);

      // Set currency based on detected location
      if (locationData.currency) {
        setSelectedCurrency(locationData.currency);
        localStorage.setItem('galaxy_wheel_currency', locationData.currency);
      }

      // Change language based on detected location
      if (locationData.language && i18n.language !== locationData.language) {
        await i18n.changeLanguage(locationData.language);
        localStorage.setItem('galaxy_wheel_language', locationData.language);
      }

      // Обновляем статус спина
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
    
    // Используем оптимизированный обработчик
    handleSpinComplete(result);
    
    // Отслеживаем спин
    analytics.trackUserAction('spin_complete', { 
      amount: result.amount, 
      currency: result.currency 
    });
  };

  const handleTimerEnd = () => {
    updateSpinStatus();
    updateAvailableSpins();
    
    // Отслеживаем обновление таймера
    analytics.trackUserAction('timer_end');
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
          onSpinComplete={handleSpinResult}
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
          <Suspense fallback={<div className="loading-spinner">Loading...</div>}>
            <SpinResultComponent
              result={spinResult}
              onClose={() => setSpinResult(null)}
              currency={selectedCurrency}
            />
          </Suspense>
        )}
      </AnimatePresence>

      {/* Support Chat */}
      {showSupport && (
        <Suspense fallback={<div className="loading-spinner">Loading...</div>}>
          <SupportChatComponent
            isOpen={showSupport}
            onClose={() => setShowSupport(false)}
          />
        </Suspense>
      )}

      {/* Share Spin */}
      <ShareSpin onShareSuccess={updateAvailableSpins} currency={selectedCurrency} bonusAmountUSD={25} />
    </div>
  );
}
