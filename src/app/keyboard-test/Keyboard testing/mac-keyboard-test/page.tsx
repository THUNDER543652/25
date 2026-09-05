import type { Metadata } from 'next';
import KeyboardTestClient from '../keyboard-test/KeyboardTestClient';

export const metadata: Metadata = {
  title: 'Mac Keyboard Test – Test Apple Keyboard Keys Online',
  description:
    'Test your Apple Mac keyboard online. Supports ⌘ Command, ⌥ Option, Control, fn, and all Mac-specific keys. Real-time key detection for macOS keyboards.',
  keywords: [
    'mac keyboard test',
    'apple keyboard test',
    'macOS keyboard tester',
    'command key test',
    'option key test',
    'mac keyboard checker',
    'test mac keys online',
  ],
  openGraph: {
    title: 'Mac Keyboard Test – Apple Keyboard Key Tester',
    description:
      'Test every key on your Apple Mac keyboard. Supports ⌘ Command, ⌥ Option, fn, and all Mac-specific keys.',
    type: 'website',
  },
};

export default function MacKeyboardTestPage() {
  return (
    <KeyboardTestClient
      initialLayout="mac"
      initialPlatform="macos"
      initialRegion="ansi"
      initialTheme="dark"
      pageTitle="Mac Keyboard Test"
      pageDescription="Test every key on your Apple Mac keyboard including ⌘ Command, ⌥ Option, fn, and all Mac-specific keys."
    />
  );
}
