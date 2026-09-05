'use client';
import React, { useState, useEffect } from 'react';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import Link from 'next/link';

type ColorTest = 'black' | 'white' | 'red' | 'green' | 'blue' | 'gray' | 'contrast' | null;

const colorTests = [
  { id: 'black', label: 'Black', bg: '#000000', desc: 'Uniformity & backlight bleed' },
  { id: 'white', label: 'White', bg: '#FFFFFF', desc: 'Brightness uniformity' },
  { id: 'red', label: 'Red', bg: '#FF0000', desc: 'Red channel test' },
  { id: 'green', label: 'Green', bg: '#00FF00', desc: 'Green channel test' },
  { id: 'blue', label: 'Blue', bg: '#0000FF', desc: 'Blue channel test' },
  { id: 'gray', label: 'Gray', bg: '#808080', desc: 'Mid-tone uniformity' },
  { id: 'contrast', label: 'Contrast', bg: 'repeating-linear-gradient(0deg, #000 0px, #000 1px, #fff 1px, #fff 2px)', desc: 'Contrast ratio test' },
];

export default function MonitorTestPage() {
  const [activeTest, setActiveTest] = useState<ColorTest>(null);
  const [brightness, setBrightness] = useState<number | null>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveTest(null);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const startTest = (test: ColorTest) => {
    setActiveTest(test);
    void document.documentElement.requestFullscreen?.().catch(() => undefined);
  };

  const exitTest = () => {
    setActiveTest(null);
    if (document.fullscreenElement) void document.exitFullscreen?.();
  };

  if (activeTest) {
    const test = colorTests.find(t => t.id === activeTest)!;
    return (
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center cursor-pointer"
        style={{ background: test.bg }}
        onClick={exitTest}
      >
        <div className="absolute top-4 right-4">
          <button
            onClick={(event) => { event.stopPropagation(); exitTest(); }}
            className="px-4 py-2 rounded-full text-sm font-semibold"
            style={{ background: 'rgba(0,0,0,0.5)', color: 'white' }}
          >
            ✕ Exit (ESC)
          </button>
        </div>
        <p className="text-sm opacity-30" style={{ color: test.id === 'black' ? 'white' : 'black' }}>
          Click to exit · {test.label} Test
        </p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="max-w-4xl mx-auto px-6 lg:px-8 pt-28 pb-20">
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Link href="/" className="text-xs text-muted-foreground hover:text-primary transition-colors">Home</Link>
            <span className="text-muted-foreground/40">/</span>
            <span className="text-xs text-primary">Monitor Test</span>
          </div>
          <span className="inline-flex items-center gap-2 glass-card rounded-full px-3 py-1.5 text-xs font-semibold text-rose-400 uppercase tracking-widest mb-4">Display</span>
          <h1 className="text-section-title font-bold text-foreground mb-3">
            Monitor <span className="text-primary">Test</span>
          </h1>
          <p className="text-muted-foreground text-base leading-relaxed max-w-xl">
            Test your monitor with fullscreen color tests, contrast checks, and brightness uniformity.
          </p>
        </div>

        {/* Color Tests */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-foreground mb-4">Fullscreen Color Tests</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {colorTests.map((test) => (
              <button
                key={test.id}
                onClick={() => startTest(test.id as ColorTest)}
                className="glass-card-hover rounded-2xl p-4 flex flex-col items-center gap-3 group transition-all"
              >
                <div
                  className="w-full h-16 rounded-xl border border-border"
                  style={{ background: test.bg }}
                />
                <div className="text-center">
                  <div className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{test.label}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{test.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Gradient Test */}
        <div className="glass-card rounded-2xl p-6 mb-8">
          <h3 className="text-sm font-semibold text-foreground mb-4">Gradient Banding Test</h3>
          <div className="rounded-xl overflow-hidden h-20" style={{ background: 'linear-gradient(to right, #000, #fff)' }} />
          <p className="text-xs text-muted-foreground mt-2">A smooth gradient should have no visible banding or steps. Banding indicates limited color depth.</p>
        </div>

        {/* Brightness Slider */}
        <div className="glass-card rounded-2xl p-6 mb-8">
          <h3 className="text-sm font-semibold text-foreground mb-4">Brightness Reference</h3>
          <div className="grid grid-cols-10 gap-1 h-12 mb-3">
            {Array.from({ length: 10 }, (_, i) => (
              <div
                key={i}
                className="rounded"
                style={{ background: `rgb(${Math.round(i * 28.3)}, ${Math.round(i * 28.3)}, ${Math.round(i * 28.3)})` }}
              />
            ))}
          </div>
          <p className="text-xs text-muted-foreground">You should be able to distinguish all 10 shades from black to white. If the darkest shades merge, adjust your monitor brightness.</p>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <h2 className="text-lg font-bold text-foreground mb-4">Monitor Test Guide</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
            <div>
              <h3 className="text-foreground font-semibold mb-2">What to look for</h3>
              <p>On black screens: look for backlight bleed in corners. On white: check for yellow tinting or uneven brightness. On color screens: check for uniformity.</p>
            </div>
            <div>
              <h3 className="text-foreground font-semibold mb-2">Contrast test</h3>
              <p>The contrast test shows alternating black and white lines. A good monitor should show sharp, distinct lines without ghosting or blurring.</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
