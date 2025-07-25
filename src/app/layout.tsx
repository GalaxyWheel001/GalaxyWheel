import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientBody from "./ClientBody";
import Script from "next/script";

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
  openGraph: {
    title: "Galaxy Wheel — Казино Колесо Фортуны",
    description: "Испытай удачу! Крути колесо фортуны и выигрывай призы каждый день. Без депозита, без риска!",
    url: "https://bonus.galaxycasino.bet",
    siteName: "Galaxy Wheel",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Galaxy Wheel — Казино Колесо Фортуны",
      },
    ],
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body suppressHydrationWarning className="antialiased">
        <ClientBody>{children}</ClientBody>
      </body>
    </html>
  );
}
