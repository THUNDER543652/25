import type { Metadata } from 'next';
import KeyboardTestClient from '../keyboard-test/KeyboardTestClient';

export const metadata: Metadata = {
  title: 'ANSI Keyboard Test – US Layout Keyboard Tester Online',
  description:
    'Test your ANSI US layout keyboard online. Standard American keyboard layout with wide Enter key and left Shift. Free real-time keyboard tester.',
  keywords: [
    'ANSI keyboard test',
    'US keyboard test',
    'ANSI layout keyboard tester',
    'American keyboard test',
    'ANSI keyboard checker',
    'test ANSI keyboard online',
  ],
  openGraph: {
    title: 'ANSI Keyboard Test – US Layout Keyboard Tester',
    description:
      'Test every key on your ANSI US layout keyboard. Standard American layout with wide Enter and left Shift.',
    type: 'website',
  },
};

export default function ANSIKeyboardTestPage() {
  return (
    <KeyboardTestClient
      initialLayout="full"
      initialPlatform="windows"
      initialRegion="ansi"
      initialTheme="dark"
      pageTitle="ANSI Keyboard Test"
      pageDescription="Test every key on your ANSI (US) layout keyboard. Standard American keyboard layout."
    />
  );
}
