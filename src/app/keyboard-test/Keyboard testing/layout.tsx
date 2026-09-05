import React from 'react';
import type { Metadata, Viewport } from 'next';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'Keyboard Tester – Test Every Key Online | Free Keyboard Test Tool',
  description:
    'Free online keyboard tester. Test every key on your keyboard in real time. Supports Full Size, TKL, 75%, 65%, 60%, Mac, MacBook, Laptop, and more layouts.',
  icons: {
    icon: [{ url: '/favicon.ico', type: 'image/x-icon' }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
