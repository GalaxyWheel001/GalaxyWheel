import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientBody from "./ClientBody";
import Script from "next/script";
import { cookies } from 'next/headers';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://bonus.galaxycasino.bet"),
  title: "Galaxy Wheel — Казино Колесо Фортуны",
  description: "Испытай удачу! Крути колесо фортуны и выигрывай призы каждый день. Без депозита, без риска!",
  keywords: "колесо фортуны, казино, призы, бонусы, игра, выигрыш, галактика",
  authors: [{ name: "Galaxy Casino" }],
  creator: "Galaxy Casino",
  publisher: "Galaxy Casino",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
  },
  openGraph: {
    title: "Galaxy Wheel — Казино Колесо Фортуны",
    description: "Испытай удачу! Крути колесо фортуны и выигрывай призы каждый день. Без депозита, без риска!",
    url: "https://bonus.galaxycasino.bet",
    siteName: "Galaxy Wheel",
    locale: "ru_RU",
    type: "website",
    images: [
      {
        url: "https://bonus.galaxycasino.bet/wheel-preview.jpg",
        width: 1200,
        height: 630,
        alt: "Galaxy Wheel — Казино Колесо Фортуны",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Galaxy Wheel — Казино Колесо Фортуны",
    description: "Испытай удачу! Крути колесо фортуны и выигрывай призы каждый день. Без депозита, без риска!",
    images: ["https://bonus.galaxycasino.bet/wheel-preview.jpg"],
    creator: "@galaxycasino",
    site: "@galaxycasino",
  },
  alternates: {
    canonical: "https://bonus.galaxycasino.bet/",
  },
  other: {
    "theme-color": "#000000",
    "msapplication-TileColor": "#000000",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "apple-mobile-web-app-title": "Galaxy Wheel",
    "application-name": "Galaxy Wheel",
    "mobile-web-app-capable": "yes",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Получаем язык из куки SSR
  let lang = 'en';
  try {
    lang = cookies().get('galaxy_wheel_language')?.value || 'en';
  } catch {}
  return (
    <html lang={lang} className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="canonical" href="https://bonus.galaxycasino.bet/" />
        
        {/* Дополнительные мета-теги для лучшего SEO */}
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="googlebot" content="index, follow" />
        <meta name="bingbot" content="index, follow" />
        <meta name="yandex" content="index, follow" />
        
        {/* Социальные сети */}
        <meta property="og:locale" content="ru_RU" />
        <meta property="og:locale:alternate" content="en_US" />
        <meta property="og:locale:alternate" content="es_ES" />
        <meta property="og:locale:alternate" content="fr_FR" />
        <meta property="og:locale:alternate" content="de_DE" />
        
        {/* Дополнительные Twitter теги */}
        <meta name="twitter:site" content="@galaxycasino" />
        <meta name="twitter:creator" content="@galaxycasino" />
        <meta name="twitter:image:alt" content="Galaxy Wheel — Казино Колесо Фортуны" />
        
        {/* Безопасность */}
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        
        {/* Предзагрузка критических ресурсов */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://ipapi.co" />
        <link rel="dns-prefetch" href="https://get.geojs.io" />
        <link rel="dns-prefetch" href="https://api.exchangerate-api.com" />
      </head>
      <body suppressHydrationWarning className="antialiased">
        <ClientBody>{children}</ClientBody>
      </body>
    </html>
  );
}
