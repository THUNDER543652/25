import React from 'react';
import type { Metadata, Viewport } from 'next';
import { DM_Sans, JetBrains_Mono } from 'next/font/google';
import '../styles/tailwind.css';

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-dm-sans',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'TestAppara — Free PC Device Testing Tools',
    template: '%s | TestAppara',
  },
  description: 'Test your keyboard, mouse, microphone, and peripherals instantly in your browser. Free tools: CPS test, typing speed, dead pixel, polling rate & more.',
  icons: {
    icon: [
      { url: '/favicon.ico', type: 'image/x-icon', sizes: 'any' },
      { url: '/favicon.png', type: 'image/png', sizes: '256x256' }
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning className={`${dmSans.variable} ${jetbrainsMono.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `try { const t = localStorage.getItem("tw-theme"); document.documentElement.dataset.theme = t === "light" ? "light" : "dark"; } catch (e) { document.documentElement.dataset.theme = "dark"; }` }} />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3995420051808249"
          crossOrigin="anonymous"
        />
      </head>
      <body className={dmSans.className}>
        {children}
      </body>
    </html>
  );
}
