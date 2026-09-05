'use client';
import React, { useState, useRef, useCallback, useEffect } from 'react';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import Link from 'next/link';

interface ScrollEvent {
  direction: 'up' | 'down' | 'left' | 'right';
  delta: number;
  time: number;
}

export default function ScrollTestPage() {
  const [events, setEvents] = useState<ScrollEvent[]>([]);
  const [vertCount, setVertCount] = useState(0);
  const [horizCount, setHorizCount] = useState(0);
  const [lastDir, setLastDir] = useState<string | null>(null);
  const [smoothScore, setSmoothScore] = useState<number | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const smoothRef = useRef<number[]>([]);
  const lastTimeRef = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    const now = performance.now();
    const gap = lastTimeRef.current ? now - lastTimeRef.current : null;
    lastTimeRef.current = now;

    if (gap !== null && gap > 0 && gap < 200) {
      smoothRef.current.push(gap);
      if (smoothRef.current.length > 20) smoothRef.current.shift();
      const variance = smoothRef.current.reduce((a, b) => a + Math.abs(b - (smoothRef.current.reduce((x, y) => x + y, 0) / smoothRef.current.length)), 0) / smoothRef.current.length;
      const score = Math.max(0, Math.min(100, Math.round(100 - variance)));
      setSmoothScore(score);
    }

    let dir: 'up' | 'down' | 'left' | 'right';
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      dir = e.deltaX > 0 ? 'right' : 'left';
      setHorizCount(c => c + 1);
    } else {
      dir = e.deltaY > 0 ? 'down' : 'up';
      setVertCount(c => c + 1);
    }
    setLastDir(dir);
    setEvents(prev => [{ direction: dir, delta: Math.round(Math.abs(e.deltaY || e.deltaX)), time: now }, ...prev.slice(0, 29)]);

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setLastDir(null), 500);
  }, []);

  useEffect(() => {
    const area = document.getElementById('scroll-test-area');
    if (!area) return;
    area.addEventListener('wheel', handleWheel, { passive: false });
    return () => area.removeEventListener('wheel', handleWheel);
  }, [handleWheel]);

  const reset = () => {
    setEvents([]);
    setVertCount(0);
    setHorizCount(0);
    setLastDir(null);
    setSmoothScore(null);
    smoothRef.current = [];
    lastTimeRef.current = 0;
  };

  const dirColor = (d: string) => {
    if (d === 'up') return 'text-primary';
    if (d === 'down') return 'text-amber-400';
    if (d === 'left') return 'text-violet-400';
    return 'text-emerald-400';
  };

  const dirArrow = (d: string) => ({ up: '↑', down: '↓', left: '←', right: '→' }[d] ?? '');

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="max-w-4xl mx-auto px-6 lg:px-8 pt-28 pb-20">
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Link href="/" className="text-xs text-muted-foreground hover:text-primary transition-colors">Home</Link>
            <span className="text-muted-foreground/40">/</span>
            <span className="text-xs text-primary">Scroll Test</span>
          </div>
          <span className="inline-flex items-center gap-2 glass-card rounded-full px-3 py-1.5 text-xs font-semibold text-violet-400 uppercase tracking-widest mb-4">Mouse Testing</span>
          <h1 className="text-section-title font-bold text-foreground mb-3">
            Scroll Wheel <span className="text-primary">Test</span>
          </h1>
          <p className="text-muted-foreground text-base leading-relaxed max-w-xl">
            Test vertical and horizontal scrolling, detect scroll direction, and measure scroll smoothness.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="glass-card rounded-2xl p-4 text-center">
            <div className="font-mono text-2xl font-bold text-primary mb-1">{vertCount}</div>
            <div className="text-xs text-muted-foreground">Vertical Scrolls</div>
          </div>
          <div className="glass-card rounded-2xl p-4 text-center">
            <div className="font-mono text-2xl font-bold text-violet-400 mb-1">{horizCount}</div>
            <div className="text-xs text-muted-foreground">Horizontal Scrolls</div>
          </div>
          <div className="glass-card rounded-2xl p-4 text-center">
            <div className="font-mono text-2xl font-bold text-emerald-400 mb-1">{vertCount + horizCount}</div>
            <div className="text-xs text-muted-foreground">Total Events</div>
          </div>
          <div className="glass-card rounded-2xl p-4 text-center">
            <div className={`font-mono text-2xl font-bold mb-1 ${
              smoothScore === null ? 'text-muted-foreground' :
              smoothScore >= 80 ? 'text-emerald-400' :
              smoothScore >= 50 ? 'text-amber-400' : 'text-rose-400'
            }`}>
              {smoothScore !== null ? `${smoothScore}%` : '—'}
            </div>
            <div className="text-xs text-muted-foreground">Smoothness</div>
          </div>
        </div>

        {/* Test Area */}
        <div
          id="scroll-test-area"
          className={`glass-card rounded-2xl p-8 mb-8 min-h-[280px] flex flex-col items-center justify-center cursor-default transition-all duration-300 ${
            lastDir ? 'border-primary/40' : ''
          }`}
        >
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">
              {lastDir ? dirArrow(lastDir) : '↕'}
            </div>
            <p className="text-muted-foreground text-sm">Scroll your mouse wheel here</p>
            <p className="text-xs text-muted-foreground/60 mt-1">Supports vertical & horizontal scrolling</p>
          </div>

          {lastDir && (
            <div className={`glass-card rounded-xl px-6 py-3 ${dirColor(lastDir)}`}>
              <span className="font-mono text-sm font-bold">
                {dirArrow(lastDir)} Scrolling {lastDir.toUpperCase()}
              </span>
            </div>
          )}

          {/* Direction Indicators */}
          <div className="mt-6 grid grid-cols-3 gap-2 w-32">
            <div />
            <div className={`key-cap flex items-center justify-center h-8 text-sm font-mono transition-colors ${
              lastDir === 'up' ? 'key-cap-pressed' : ''
            }`}>↑</div>
            <div />
            <div className={`key-cap flex items-center justify-center h-8 text-sm font-mono transition-colors ${
              lastDir === 'left' ? 'key-cap-pressed' : ''
            }`}>←</div>
            <div className={`key-cap flex items-center justify-center h-8 text-sm font-mono transition-colors ${
              lastDir === 'down' ? 'key-cap-pressed' : ''
            }`}>↓</div>
            <div className={`key-cap flex items-center justify-center h-8 text-sm font-mono transition-colors ${
              lastDir === 'right' ? 'key-cap-pressed' : ''
            }`}>→</div>
          </div>
        </div>

        {/* Smooth Scroll Test */}
        <div className="glass-card rounded-2xl p-6 mb-8">
          <h3 className="text-sm font-semibold text-foreground mb-3">Smooth Scrolling Analysis</h3>
          <div className="flex items-center gap-4">
            <div className="flex-1 glass-card rounded-full h-3 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${smoothScore ?? 0}%`,
                  background: smoothScore && smoothScore >= 80 ? '#10b981' : smoothScore && smoothScore >= 50 ? '#f59e0b' : '#f43f5e',
                  boxShadow: `0 0 10px currentColor`,
                }}
              />
            </div>
            <span className="font-mono text-sm text-muted-foreground w-12 text-right">{smoothScore !== null ? `${smoothScore}%` : '—'}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">Scroll continuously to measure smoothness. Higher = smoother scroll wheel.</p>
        </div>

        {/* Event Log */}
        {events.length > 0 && (
          <div className="glass-card rounded-2xl p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-foreground">Scroll Event Log</h3>
              <button onClick={reset} className="text-xs text-muted-foreground hover:text-primary transition-colors">Clear</button>
            </div>
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {events.map((ev, i) => (
                <div key={i} className="flex items-center justify-between py-1 px-3 rounded-lg bg-white/3 text-xs">
                  <span className={`font-mono font-bold ${dirColor(ev.direction)}`}>{dirArrow(ev.direction)} {ev.direction.toUpperCase()}</span>
                  <span className="text-muted-foreground">delta: {ev.delta}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-center mb-8">
          <button onClick={reset} className="inline-flex items-center gap-2 glass-card rounded-full px-6 py-3 text-sm font-semibold text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Reset
          </button>
        </div>
      </div>
      <Footer />
    </main>
  );
}
