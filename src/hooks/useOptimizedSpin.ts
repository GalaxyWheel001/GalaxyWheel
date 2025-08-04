import { useState, useCallback, useMemo } from 'react';
import { getSpinStatus, getAvailableSpins, updateSpinStatus, consumeShareSpin } from '@/utils/spin';
import { getCurrencyRate, getCurrencySymbol } from '@/utils/currencies';
import type { SpinResult } from '@/types';

export function useOptimizedSpin(currency: string) {
  const [spinStatus, setSpinStatus] = useState(() => getSpinStatus());
  const [availableSpins, setAvailableSpins] = useState(() => getAvailableSpins());

  // Мемоизируем вычисления валюты
  const currencyRate = useMemo(() => getCurrencyRate(currency), [currency]);
  const currencySymbol = useMemo(() => getCurrencySymbol(currency), [currency]);

  // Оптимизированная функция обновления спинов
  const updateAvailableSpins = useCallback(() => {
    setAvailableSpins(getAvailableSpins());
  }, []);

  // Оптимизированная функция обновления статуса
  const updateSpinStatus = useCallback(() => {
    setSpinStatus(getSpinStatus());
  }, []);

  // Оптимизированная функция обработки спина
  const handleSpinComplete = useCallback((result: SpinResult) => {
    // Обновляем статус
    updateSpinStatus();
    updateAvailableSpins();

    // Отправляем уведомление
    const userId = localStorage.getItem('galaxy_wheel_user_id') || 'unknown';
    fetch('/api/notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'spin', userId, result }),
    }).catch(console.error); // Игнорируем ошибки уведомлений
  }, [updateSpinStatus, updateAvailableSpins]);

  return {
    spinStatus,
    availableSpins,
    currencyRate,
    currencySymbol,
    updateAvailableSpins,
    updateSpinStatus,
    handleSpinComplete
  };
} 