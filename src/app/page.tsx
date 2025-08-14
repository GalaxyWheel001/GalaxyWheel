'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Volume2, VolumeX, MessageCircle } from 'lucide-react';

// Минимальная кнопка переключения языка
function LanguageToggle({
  userLang,
  currentLang,
  onToggle
}: { userLang: string; currentLang: string; onToggle: () => void }) {
  // Флаг показывает язык, на который переключится
  const nextLang = currentLang === 'en' ? userLang : 'en';
  const flagCode = nextLang === 'en' ? 'gb' : nextLang;

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
        backgroundImage: `url(https://flagcdn.com/w40/${flagCode}.png)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        cursor: 'pointer',
        zIndex: 9999
      }}
      title={`Switch to ${nextLang.toUpperCase()}`}
    />
  );
}

export default function HomePage() {
  const { t, i18n } = useTranslation();
  const [userLang, setUserLang] = useState('en'); // родной язык пользователя
  const [currentLang, setCurrentLang] = useState('en'); // язык интерфейса
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const browserLang = navigator.language.split('-')[0] || 'en';
    setUserLang(browserLang);

    const savedLang = localStorage.getItem('galaxy_wheel_language') || browserLang;
    setCurrentLang(savedLang);
    i18n.changeLanguage(savedLang);
  }, [i18n]);

  const toggleLanguage = () => {
    const newLang = currentLang === 'en' ? userLang : 'en';
    setCurrentLang(newLang);
    i18n.changeLanguage(newLang);
    localStorage.setItem('galaxy_wheel_language', newLang);
  };

  return (
    <div className="min-h-screen relative bg-black text-white flex flex-col items-center justify-center">
      {/* Язык */}
      <LanguageToggle userLang={userLang} currentLang={currentLang} onToggle={toggleLanguage} />

      {/* Заголовок */}
      <h1 className="text-4xl mb-4">{t('title')}</h1>
      <p className="mb-8">{t('subtitle')}</p>

      {/* Пример кнопок */}
      <div className="flex gap-4">
        <button onClick={() => setIsMuted(!isMuted)}>
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
        <button>
          <MessageCircle size={20} />
        </button>
      </div>
    </div>
  );
}
