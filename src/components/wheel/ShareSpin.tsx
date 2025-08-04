import { useState } from 'react';
import { addShareSpin } from '@/utils/spin';
import { FaWhatsapp, FaTwitter, FaFacebookF } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const shareLinks = [
  { name: 'facebook', icon: FaFacebookF, url: (msg: string) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(msg)}` },
  { name: 'whatsapp', icon: FaWhatsapp, url: (msg: string) => `https://wa.me/?text=${encodeURIComponent(msg)}` },
  { name: 'twitter', icon: FaTwitter, url: (msg: string) => `https://twitter.com/intent/tweet?text=${encodeURIComponent(msg)}` }
];

export function ShareSpin({ onShareSuccess, currency = 'USD', bonusAmountUSD = 25 }: { onShareSuccess: () => void, currency?: string, bonusAmountUSD?: number }) {
  const { t } = useTranslation();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [notification, setNotification] = useState('');

  // Кастомный текст для шейринга с локализацией
  const shareText = t('shareSpin.shareText');

  // Рассчитываем сумму бонуса в выбранной валюте
  // const rate = getCurrencyRate(currency);
  // const symbol = getCurrencySymbol(currency);
  // const localAmount = Math.round(bonusAmountUSD * rate);

  // const bonusText = `${symbol}${localAmount}`;
  const bonusText = t('freeSpin');

  const handleShare = (url: string) => {
    window.open(url, '_blank', 'width=600,height=400');
    setTimeout(() => {
      setShowConfirmation(true);
    }, 1500);
  };

  const confirmShare = () => {
    addShareSpin();
    onShareSuccess();
    setNotification(t('shareSpin.bonusAdded') + ` (${bonusText})`);
    setShowConfirmation(false);
    setTimeout(() => setNotification(''), 2500);
  };

  return (
    <>
      <div className="fixed bottom-4 left-0 right-0 flex justify-center gap-4 z-50 md:bottom-auto md:left-4 md:right-auto md:flex-col md:top-1/2 md:-translate-y-1/2">
        {shareLinks.map(({ name, icon: Icon, url }) => (
          <button
            key={name}
            className="bg-gray-900 bg-opacity-80 hover:bg-opacity-100 text-white rounded-full p-3 md:p-4 shadow-lg flex items-center justify-center transition-all"
            style={{ fontSize: 20 }}
            onClick={() => handleShare(url(shareText))}
            title={t(`shareSpin.shareVia_${name}`)}
          >
            <Icon />
          </button>
        ))}
      </div>

      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.5 }}
            className="fixed top-10 left-1/2 -translate-x-1/2 bg-green-600 text-white px-5 py-2 rounded-xl shadow-lg z-50 text-sm md:text-base"
          >
            {notification}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showConfirmation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ y: -50, scale: 0.7 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 50, scale: 0.7 }}
              className="bg-gray-800 rounded-2xl p-6 md:p-8 text-center shadow-2xl border border-gray-700"
            >
              <h3 className="text-lg md:text-xl font-bold text-white mb-4">{t('shareSpin.sharedQuestion')}</h3>
              <p className="text-gray-400 mb-6 text-sm md:text-base">{t('shareSpin.getBonusHint')} <span className="font-bold text-cyan-400">{bonusText}</span></p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="px-6 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 text-white font-semibold transition-colors"
                >
                  {t('shareSpin.cancel')}
                </button>
                <button
                  onClick={confirmShare}
                  className="px-6 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-white font-bold transition-colors shadow-[0_0_15px_rgba(6,182,212,0.6)]"
                >
                  {t('shareSpin.getSpin')}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
} 