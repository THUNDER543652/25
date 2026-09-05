import KeyboardTestClient from './Keyboard testing/keyboard-test/KeyboardTestClient';

export default function KeyboardTestPage() {
  return <KeyboardTestClient initialLayout="full" initialPlatform="windows" initialRegion="ansi" initialTheme="dark" pageTitle="Keyboard Tester" pageDescription="Test every key on your keyboard in real time. Supports all layouts." />;
}
