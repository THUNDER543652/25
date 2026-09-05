'use client';
import React, { useState } from 'react';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import Link from 'next/link';

type TestScreen = 'black' | 'white' | 'red' | 'green' | 'blue' | 'gradient' | null;

const screens = [
  { id: 'black', label: 'Black', bg: '#000000', text: 'white', desc: 'Find bright dead pixels' },
  { id: 'white', label: 'White', bg: '#FFFFFF', text: 'black', desc: 'Find dark dead pixels' },
  { id: 'red', label: 'Red', bg: '#FF0000', text: 'white', desc: 'Test red sub-pixels' },
  { id: 'green', label: 'Green', bg: '#00FF00', text: 'black', desc: 'Test green sub-pixels' },
  { id: 'blue', label: 'Blue', bg: '#0000FF', text: 'white', desc: 'Test blue sub-pixels' },
  { id: 'gradient', label: 'Gradient', bg: 'linear-gradient(135deg, #000 0%, #fff 100%)', text: 'white', desc: 'Gradient uniformity' },
];

export default function DeadPixelTestPage() {
  const [activeScreen, setActiveScreen] = useState<TestScreen>(null);
  const [screenIndex, setScreenIndex] = useState(0);

  const startTest = (id: string) => {
    setActiveScreen(id as TestScreen);
    setScreenIndex(screens.findIndex(s => s.id === id));
    void document.documentElement.requestFullscreen?.().catch(() => undefined);
  };

  const exitTest = () => {
    setActiveScreen(null);
    if (document.fullscreenElement) void document.exitFullscreen?.();
  };

  const nextScreen = () => {
    const next = (screenIndex + 1) % screens.length;
    setScreenIndex(next);
    setActiveScreen(screens[next].id as TestScreen);
  };

  const prevScreen = () => {
    const prev = (screenIndex - 1 + screens.length) % screens.length;
    setScreenIndex(prev);
    setActiveScreen(screens[prev].id as TestScreen);
  };

  if (activeScreen) {
    const screen = screens.find(s => s.id === activeScreen)!;
    return (
      <div
        className="fixed inset-0 z-[9999] flex flex-col items-center justify-center cursor-pointer"
        style={{ background: screen.bg, color: screen.text }}
        onClick={nextScreen}
      >
        <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-3">
          <button
            onClick={(e) => { e.stopPropagation(); prevScreen(); }}
            className="px-4 py-2 rounded-full text-sm font-semibold"
            style={{ background: 'rgba(0,0,0,0.3)', color: screen.text }}
          >
            ← Prev
          </button>
          <span className="px-4 py-2 rounded-full text-sm font-semibold" style={{ background: 'rgba(0,0,0,0.3)' }}>
            {screen.label} ({screenIndex + 1}/{screens.length})
          </span>
          <button
            onClick={(e) => { e.stopPropagation(); nextScreen(); }}
            className="px-4 py-2 rounded-full text-sm font-semibold"
            style={{ background: 'rgba(0,0,0,0.3)', color: screen.text }}
          >
            Next →
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); exitTest(); }}
            className="px-4 py-2 rounded-full text-sm font-semibold"
            style={{ background: 'rgba(255,0,0,0.4)', color: 'white' }}
          >
            ✕ Exit
          </button>
        </div>
        <p className="text-sm opacity-50">Click anywhere to go to next screen · Look for any abnormal pixels</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="max-w-3xl mx-auto px-6 lg:px-8 pt-28 pb-20">
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Link href="/" className="text-xs text-muted-foreground hover:text-primary transition-colors">Home</Link>
            <span className="text-muted-foreground/40">/</span>
            <span className="text-xs text-primary">Dead Pixel Test</span>
          </div>
          <span className="inline-flex items-center gap-2 glass-card rounded-full px-3 py-1.5 text-xs font-semibold text-rose-400 uppercase tracking-widest mb-4">Display</span>
          <h1 className="text-section-title font-bold text-foreground mb-3">
            Dead Pixel <span className="text-primary">Test</span>
          </h1>
          <p className="text-muted-foreground text-base leading-relaxed max-w-xl">
            Scan your monitor for dead, stuck, or hot pixels using full-screen color tests.
          </p>
        </div>

        <div className="glass-card rounded-2xl p-6 mb-8">
          <h3 className="text-sm font-semibold text-foreground mb-4">Instructions</h3>
          <ol className="space-y-2 text-sm text-muted-foreground">
            <li className="flex gap-2"><span className="text-primary font-bold">1.</span> Click a color below to enter true browser fullscreen mode</li>
            <li className="flex gap-2"><span className="text-primary font-bold">2.</span> Look carefully across the entire screen for any abnormal pixels</li>
            <li className="flex gap-2"><span className="text-primary font-bold">3.</span> Click anywhere or use Next/Prev to cycle through colors</li>
            <li className="flex gap-2"><span className="text-primary font-bold">4.</span> Press Exit or Escape to return to this page</li>
          </ol>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {screens.map((screen) => (
            <button
              key={screen.id}
              onClick={() => startTest(screen.id)}
              className="glass-card-hover rounded-2xl p-5 flex flex-col items-center gap-3 transition-all group"
            >
              <div
                className="w-16 h-16 rounded-xl border border-border"
                style={{ background: screen.bg }}
              />
              <div className="text-center">
                <div className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{screen.label}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{screen.desc}</div>
              </div>
            </button>
          ))}
        </div>

        <div className="glass-card rounded-2xl p-6">
          <h2 className="text-lg font-bold text-foreground mb-4">Types of Pixel Defects</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            {[
              { name: 'Dead Pixel', desc: 'Always black, no light output. Transistor failure.', color: 'text-muted-foreground' },
              { name: 'Stuck Pixel', desc: 'Stuck on one color (red, green, or blue). Can sometimes be fixed.', color: 'text-rose-400' },
              { name: 'Hot Pixel', desc: 'Always bright white. Opposite of dead pixel.', color: 'text-amber-400' },
            ].map(t => (
              <div key={t.name} className="glass-card rounded-xl p-4">
                <div className={`font-semibold mb-1 ${t.color}`}>{t.name}</div>
                <div className="text-xs text-muted-foreground">{t.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
