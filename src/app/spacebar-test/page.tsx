'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import Link from 'next/link';

export default function SpacebarTestPage() {
  const [count, setCount] = useState(0);
  const [isPressed, setIsPressed] = useState(false);
  const [times, setTimes] = useState<number[]>([]);
  const [phase, setPhase] = useState<'idle' | 'running' | 'done'>('idle');
  const [timeLeft, setTimeLeft] = useState(10);
  const [mode, setMode] = useState<10 | 30 | 60>(10);
  const lastPressRef = useRef<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);
  const countRef = useRef(0);

  const startTest = useCallback(() => {
    setPhase('running');
    setCount(0);
    setTimes([]);
    countRef.current = 0;
    startTimeRef.current = performance.now();
    setTimeLeft(mode);

    timerRef.current = setInterval(() => {
      const elapsed = (performance.now() - startTimeRef.current) / 1000;
      const remaining = Math.max(0, mode - elapsed);
      setTimeLeft(remaining);
      if (remaining <= 0) {
        if (timerRef.current) clearInterval(timerRef.current);
        setPhase('done');
      }
    }, 50);
  }, [mode]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.code !== 'Space') return;
    e.preventDefault();
    if (isPressed) return;
    setIsPressed(true);

    if (phase === 'idle') {
      startTest();
    }

    if (phase === 'running' || phase === 'idle') {
      const now = performance.now();
      const gap = lastPressRef.current !== null ? now - lastPressRef.current : null;
      lastPressRef.current = now;
      if (gap !== null) setTimes(prev => [gap, ...prev.slice(0, 49)]);
      countRef.current += 1;
      setCount(c => c + 1);
    }
  }, [isPressed, phase, startTest]);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    if (e.code !== 'Space') return;
    setIsPressed(false);
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const reset = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setPhase('idle');
    setCount(0);
    setTimes([]);
    setIsPressed(false);
    setTimeLeft(mode);
    lastPressRef.current = null;
    countRef.current = 0;
  };

  const avgGap = times.length > 0 ? Math.round(times.reduce((a, b) => a + b, 0) / times.length) : null;
  const sps = phase === 'done' && mode > 0 ? (count / mode).toFixed(2) : null;
  const progress = phase === 'running' ? ((mode - timeLeft) / mode) * 100 : phase === 'done' ? 100 : 0;

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="max-w-3xl mx-auto px-6 lg:px-8 pt-28 pb-20">
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Link href="/" className="text-xs text-muted-foreground hover:text-primary transition-colors">Home</Link>
            <span className="text-muted-foreground/40">/</span>
            <span className="text-xs text-primary">Spacebar Test</span>
          </div>
          <span className="inline-flex items-center gap-2 glass-card rounded-full px-3 py-1.5 text-xs font-semibold text-emerald-400 uppercase tracking-widest mb-4">Keyboard</span>
          <h1 className="text-section-title font-bold text-foreground mb-3">
            Spacebar <span className="text-primary">Speed Test</span>
          </h1>
          <p className="text-muted-foreground text-base leading-relaxed max-w-xl">
            Test your spacebar speed and count presses. Press the spacebar as fast as you can within the time limit.
          </p>
        </div>

        {/* Mode Selector */}
        <div className="flex flex-wrap gap-2 mb-6">
          {([10, 30, 60] as (10|30|60)[]).map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); reset(); }}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition-all ${
                mode === m ? 'bg-primary text-black glow-cyan' : 'glass-card text-muted-foreground hover:text-foreground hover:border-primary/30'
              }`}
            >
              {m}s
            </button>
          ))}
        </div>

        {/* Progress */}
        <div className="glass-card rounded-full h-2 mb-8 overflow-hidden">
          <div className="h-full bg-primary transition-all duration-100 rounded-full" style={{ width: `${progress}%`, boxShadow: 'rgba(0,212,255,0.5) 0 0 10px' }} />
        </div>

        {/* Spacebar Visual */}
        <div className="flex flex-col items-center mb-8">
          <div className="text-center mb-6">
            <div className="cps-counter text-primary mb-2">{count}</div>
            <div className="text-muted-foreground text-sm">presses</div>
            {sps && <div className="font-mono text-xl font-bold text-emerald-400 mt-2">{sps} SPS</div>}
          </div>

          <div
            className={`w-80 h-16 rounded-xl border-2 flex items-center justify-center font-mono text-sm font-bold transition-all duration-75 select-none ${
              isPressed
                ? 'bg-primary/20 border-primary text-primary shadow-[0_0_30px_rgba(0,212,255,0.4)] translate-y-1'
                : 'glass-card border-border text-muted-foreground'
            }`}
          >
            {phase === 'idle' ? 'Press SPACEBAR to start' : isPressed ? 'PRESSED' : 'SPACEBAR'}
          </div>

          <div className="mt-4 text-center">
            {phase === 'running' && (
              <span className="font-mono text-2xl font-bold text-amber-400">{timeLeft.toFixed(1)}s</span>
            )}
            {phase === 'done' && (
              <span className="text-emerald-400 font-semibold">Time\'s up! {count} presses in {mode}s</span>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="glass-card rounded-2xl p-4 text-center">
            <div className="font-mono text-2xl font-bold text-primary mb-1">{count}</div>
            <div className="text-xs text-muted-foreground">Total Presses</div>
          </div>
          <div className="glass-card rounded-2xl p-4 text-center">
            <div className="font-mono text-2xl font-bold text-emerald-400 mb-1">{sps ?? '—'}</div>
            <div className="text-xs text-muted-foreground">Presses/sec</div>
          </div>
          <div className="glass-card rounded-2xl p-4 text-center">
            <div className="font-mono text-2xl font-bold text-amber-400 mb-1">{avgGap !== null ? `${avgGap}ms` : '—'}</div>
            <div className="text-xs text-muted-foreground">Avg Interval</div>
          </div>
          <div className="glass-card rounded-2xl p-4 text-center">
            <div className="font-mono text-2xl font-bold text-violet-400 mb-1">{timeLeft.toFixed(1)}s</div>
            <div className="text-xs text-muted-foreground">Time Left</div>
          </div>
        </div>

        <div className="flex justify-center mb-12">
          <button onClick={reset} className="inline-flex items-center gap-2 glass-card rounded-full px-6 py-3 text-sm font-semibold text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Reset
          </button>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <h2 className="text-lg font-bold text-foreground mb-4">About Spacebar Test</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-muted-foreground leading-relaxed">
            <div>
              <h3 className="text-foreground font-semibold mb-2">What does it measure?</h3>
              <p>The spacebar test measures how many times you can press the spacebar within a given time period. It also calculates your average presses per second (SPS) and the interval between presses.</p>
            </div>
            <div>
              <h3 className="text-foreground font-semibold mb-2">Use cases</h3>
              <p>Useful for testing spacebar responsiveness, checking for stuck keys, and measuring keyboard input speed for gaming or typing applications.</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
