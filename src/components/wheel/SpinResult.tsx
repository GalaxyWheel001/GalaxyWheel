'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Copy, Share2, ExternalLink, Check } from 'lucide-react';
import { FaFacebookF } from 'react-icons/fa';
import { getCurrencySymbol } from '@/utils/currencies';
import { getUserId } from '@/utils/userId';
import type { SpinResult } from '@/types';
import { useState } from 'react';

export interface SpinResultProps {
  result: SpinResult;
  onClose: () => void;
  currency: string;
}

function SpinResult({ result, onClose, currency }: SpinResultProps) {
  const { t } = useTranslation();
  const [isCopied, setIsCopied] = useState(false);
  const [showCopyNotification, setShowCopyNotification] = useState(false);

  const symbol = getCurrencySymbol(currency);
  const localAmount = result.localAmount ?? result.amount;

  const shareMessage = t('shareMessage', {
    amount: `${symbol}${localAmount}`,
    currency,
    promocode: result.promocode
  });

  const handleCopyPromocode = async () => {
    if (isCopied) return;
    try {
      await navigator.clipboard.writeText(result.promocode);
      setIsCopied(true);
      setShowCopyNotification(true);
      setTimeout(() => {
        setIsCopied(false);
        setShowCopyNotification(false);
      }, 3000);
    } catch (error) {
      console.error('Failed to copy promocode:', error);
    }
  };

  const handleShare = (platform: 'facebook' | 'whatsapp' | 'twitter') => {
    const shareUrl = 'https://galaxy-casino.live'; // ссылка для шаринга
    const encodedMessage = encodeURIComponent(shareMessage);
    let url = '';

    switch (platform) {
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodedMessage}`;
        break;
      case 'whatsapp':
        url = `https://wa.me/?text=${encodedMessage}%20${encodeURIComponent(shareUrl)}`;
        break;
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodedMessage}%20${encodeURIComponent(shareUrl)}`;
        break;
    }

    window.open(url, '_blank', 'width=600,height=400');
  };

  const getCasinoLink = () => {
    if (localAmount === 500) {
      return 'https://casino-galaxy.bet/auth/register?promo=v500-universe';
    } else if (localAmount === 1000) {
      return 'https://casino-galaxy.bet/auth/register?promo=j1000-milkyway';
    } else {
      return `https://casino-galaxy.bet?utm_source=galaxy_wheel&utm_medium=bonus&utm_campaign=spin_result&amount=${encodeURIComponent(localAmount)}&currency=${encodeURIComponent(currency)}&promocode=${encodeURIComponent(result.promocode)}`;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.5, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.5, y: 50 }}
        className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 md:p-8 max-w-md w-full mx-4 border border-cyan-400 neon-glow"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="text-center mb-6">
          <motion.h2
            className="text-2xl md:text-3xl font-bold orbitron gradient-text mb-2"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {t('congratulations')}
          </motion.h2>
          <p className="text-gray-300">{t('youWon')}</p>
        </div>

        {/* Prize Amount */}
        <div className="text-center mb-6">
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-xl p-4 mb-4 flex flex-col items-center justify-center">
            <motion.div
              className="text-4xl md:text-5xl font-extrabold text-yellow-900 orbitron drop-shadow-lg px-4 py-2 bg-black bg-opacity-20 rounded-lg"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              {symbol}{localAmount}
            </motion.div>
            <div className="text-yellow-900 text-base md:text-lg font-bold mt-1 drop-shadow-sm">{currency}</div>
          </div>

          {/* Promocode */}
          <div className="bg-gray-700 rounded-lg p-3 border border-gray-600">
            <div className="text-gray-400 text-sm mb-1">{t('promocode')}</div>
            <div className="text-cyan-400 font-mono text-lg font-bold truncate">
              {result.promocode}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {/* Main Casino Link */}
          <a
            href={getCasinoLink()}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-4 rounded-lg font-bold flex items-center justify-center gap-2 hover:from-green-600 hover:to-emerald-700 transition-all duration-300"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              const userId = getUserId();
              fetch('/api/notify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  type: 'conversion',
                  userId,
                  result: {
                    ...result,
                    localAmount: `${symbol}${localAmount} ${currency}`,
                  },
                }),
              });
              handleCopyPromocode();
            }}
          >
            <ExternalLink size={20} />
            {t('goToCasino')}
          </a>

          {/* Share Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <motion.button
              onClick={handleCopyPromocode}
              className={`py-2 px-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all duration-300 text-sm ${
                isCopied
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                  : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-600 hover:to-blue-700'
              }`}
              whileHover={{ scale: isCopied ? 1 : 1.05 }}
              whileTap={{ scale: isCopied ? 1 : 0.95 }}
            >
              <AnimatePresence mode="wait" initial={false}>
                {isCopied ? (
                  <motion.div
                    key="check"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="flex items-center gap-2"
                  >
                    <Check size={16} />
                    {t('promocodeCopied')}
                  </motion.div>
                ) : (
                  <motion.div
                    key="copy"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="flex items-center gap-2"
                  >
                    <Copy size={16} />
                    {t('copyPromocode')}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
            <button
              onClick={() => handleShare('facebook')}
              className="bg-blue-700 text-white py-2 px-3 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-blue-800 transition-colors text-sm"
            >
              <FaFacebookF size={16} />
              {t('shareSpin.facebook')}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleShare('whatsapp')}
              className="bg-green-600 text-white py-2 px-3 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-green-700 transition-colors text-sm"
            >
              <Share2 size={16} />
              {t('shareSpin.whatsapp')}
            </button>
            <button
              onClick={() => handleShare('twitter')}
              className="bg-blue-400 text-white py-2 px-3 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-blue-500 transition-colors text-sm"
            >
              <Share2 size={16} />
              {t('shareSpin.twitter')}
            </button>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full mt-4 text-gray-400 hover:text-white transition-colors text-sm"
        >
          {t('close')}
        </button>

        <AnimatePresence>
          {showCopyNotification && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-semibold"
            >
              {t('promocodeCopiedToClipboard')}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

export default SpinResult;
