import type { Metadata } from 'next';
import KeyboardTestClient from '../keyboard-test/KeyboardTestClient';

export const metadata: Metadata = {
  title: 'TKL Keyboard Test – Tenkeyless 87 Key Keyboard Tester Online',
  description:
    'Test your TKL (Tenkeyless) 87-key keyboard online. No numpad, full function row and navigation cluster. Free real-time keyboard tester for mechanical keyboards.',
  keywords: [
    'TKL keyboard test',
    'tenkeyless keyboard test',
    '87 key keyboard test',
    'TKL mechanical keyboard tester',
    'test TKL keyboard online',
    'tenkeyless keyboard checker',
  ],
  openGraph: {
    title: 'TKL Keyboard Test – Tenkeyless 87-Key Keyboard Tester',
    description:
      'Test every key on your TKL tenkeyless 87-key keyboard. Full function row, navigation cluster, no numpad.',
    type: 'website',
  },
};

export default function TKLKeyboardTestPage() {
  return (
    <KeyboardTestClient
      initialLayout="tkl"
      initialPlatform="windows"
      initialRegion="ansi"
      initialTheme="dark"
      pageTitle="TKL Keyboard Test"
      pageDescription="Test every key on your TKL (Tenkeyless) 87-key keyboard. Full function row and navigation cluster without numpad."
    />
  );
}
