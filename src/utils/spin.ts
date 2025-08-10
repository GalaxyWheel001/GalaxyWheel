import type { UserSpinStatus, WheelSector, SpinResult } from '@/types';
import { useState, useEffect } from 'react';

const STORAGE_KEY = 'galaxy_wheel_spin_status';
const SHARE_SPIN_KEY = 'galaxy_wheel_share_spins';

export const WHEEL_SECTORS: WheelSector[] = [
  { amount: 25, color: '#FF6B6B', promocode: 'B25-OFF2024', probability: 0 },
  { amount: 50, color: '#4ECDC4', promocode: 'G50-WINNER', probability: 0 },
  { amount: 100, color: '#45B7D1', promocode: 'L100-COSMO', probability: 0 },
  { amount: 250, color: '#96CEB4', promocode: 'B250-GALAXY', probability: 0.},
  { amount: 500, color: '#FFEAA7', promocode: 'V500-UNIVERSE', probability: 0 },
  { amount: 1000, color: '#DDA0DD', promocode: 'J1000-MILKYWAY', probability: 1 }
];

export function getSpinStatus(): UserSpinStatus {
  if (typeof window === 'undefined') {
    return {
      lastSpinDate: '',
      hasSpunToday: false,
      nextSpinTime: 0
    };
  }

  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return {
      lastSpinDate: '',
      hasSpunToday: false,
      nextSpinTime: 0
    };
  }

  try {
    const status: UserSpinStatus = JSON.parse(stored);
    const today = new Date().toDateString();
    const hasSpunToday = status.lastSpinDate === today;

    let nextSpinTime = 0;
    if (hasSpunToday) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      nextSpinTime = tomorrow.getTime();
    }

    return {
      ...status,
      hasSpunToday,
      nextSpinTime
    };
  } catch {
    return {
      lastSpinDate: '',
      hasSpunToday: false,
      nextSpinTime: 0
    };
  }
}

export function updateSpinStatus(): void {
  if (typeof window === 'undefined') return;

  const today = new Date().toDateString();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  const status: UserSpinStatus = {
    lastSpinDate: today,
    hasSpunToday: true,
    nextSpinTime: tomorrow.getTime()
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(status));
}

export function generateSpinResult(userCurrency: string, exchangeRate: number = 1): SpinResult {
  const random = Math.random();
  let cumulative = 0;

  for (let i = 0; i < WHEEL_SECTORS.length; i++) {
    cumulative += WHEEL_SECTORS[i].probability;
    if (random <= cumulative) {
      const sector = WHEEL_SECTORS[i];
      return {
        amount: sector.amount,
        localAmount: Math.round(sector.amount * exchangeRate * 100) / 100,
        currency: userCurrency,
        promocode: sector.promocode,
        sectorIndex: i
      };
    }
  }

  // Fallback to first sector
  const sector = WHEEL_SECTORS[0];
  return {
    amount: sector.amount,
    localAmount: Math.round(sector.amount * exchangeRate * 100) / 100,
    currency: userCurrency,
    promocode: sector.promocode,
    sectorIndex: 0
  };
}

export function formatTimeUntilNextSpin(nextSpinTime: number): string {
  const now = Date.now();
  const timeLeft = nextSpinTime - now;

  if (timeLeft <= 0) return '00:00:00';

  const hours = Math.floor(timeLeft / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

export function getCurrencySymbol(currency: string): string {
  const symbols: Record<string, string> = {
    'USD': '$', 'EUR': '€', 'GBP': '£', 'JPY': '¥', 'CNY': '¥',
    'RUB': '₽', 'UAH': '₴', 'BYN': 'Br', 'KZT': '₸', 'UZS': 'soʻm',
    'AMD': '֏', 'GEL': '₾', 'AZN': '₼', 'TRY': '₺', 'BRL': 'R$',
    'MXN': '$', 'INR': '₹', 'KRW': '₩', 'CAD': 'C$', 'AUD': 'A$',
    'PLN': 'zł', 'CZK': 'Kč', 'HUF': 'Ft', 'RON': 'lei', 'BGN': 'лв',
    'HRK': 'kn', 'DKK': 'kr', 'NOK': 'kr', 'SEK': 'kr', 'CHF': 'Fr',
    'SGD': 'S$', 'HKD': 'HK$', 'NZD': 'NZ$', 'ZAR': 'R', 'THB': '฿',
    'MYR': 'RM', 'IDR': 'Rp', 'PHP': '₱', 'VND': '₫'
  };

  return symbols[currency] || currency;
}

export function addShareSpin(): void {
  if (typeof window === 'undefined') return;
  const count = Number(localStorage.getItem(SHARE_SPIN_KEY) || '0');
  localStorage.setItem(SHARE_SPIN_KEY, String(count + 1));
}

export function consumeShareSpin(): void {
  if (typeof window === 'undefined') return;
  let count = Number(localStorage.getItem(SHARE_SPIN_KEY) || '0');
  if (count > 0) {
    count--;
    localStorage.setItem(SHARE_SPIN_KEY, String(count));
  }
}

export function getAvailableSpins(): number {
  if (typeof window === 'undefined') return 0;
  const status = getSpinStatus();
  const shareSpins = Number(localStorage.getItem(SHARE_SPIN_KEY) || '0');
  // Если сегодня уже был обычный спин, то только бонусные
  return (status.hasSpunToday ? 0 : 1) + shareSpins;
}

export function useShareSpin(): [number, () => void] {
  const [spins, setSpins] = useState(getAvailableSpins());
  const addSpin = () => {
    addShareSpin();
    setSpins(getAvailableSpins());
  };
  useEffect(() => {
    setSpins(getAvailableSpins());
  }, []);
  return [spins, addSpin];
}


