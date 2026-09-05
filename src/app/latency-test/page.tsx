'use client';
import React, { useState, useRef, useCallback, useEffect } from 'react';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import Link from 'next/link';

type Phase = 'idle' | 'running' | 'done';

export default function LatencyTestPage() {
  const [phase, setPhase] = useState<Phase>('idle');
  const [latency, setLatency] = useState<number | null>(null);
  const [history, setHistory] = useState<number[]>([]);
  const [isPressed, setIsPressed] = useState(false);
  const pressTimeRef = useRef<number>(0);
  const releaseTimeRef = useRef<number>(0);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.code !== 'Space' && e.key !== 'Enter') return;
    e.preventDefault();
    if (isPressed) return;
    pressTimeRef.current = performance.now();
    setIsPressed(true);
    setPhase('running');
  }, [isPressed]);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    if (e.code !== 'Space' && e.key !== 'Enter') return;
    if (!isPressed) return;
    const lt = Math.round(performance.now() - pressTimeRef.current);
    setLatency(lt);
    setHistory(prev => [lt, ...prev.slice(0, 19)]);
    setIsPressed(false);
    setPhase('done');
    setTimeout(() => setPhase('idle'), 1000);
  }, [isPressed]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  const avg = history.length > 0 ? Math.round(history.reduce((a, b) => a + b, 0) / history.length) : null;
  const best = history.length > 0 ? Math.min(...history) : null;

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="max-w-3xl mx-auto px-6 lg:px-8 pt-28 pb-20">
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Link href="/" className="text-xs text-muted-foreground hover:text-primary transition-colors">Home</Link>
            <span className="text-muted-foreground/40">/</span>
            <span className="text-xs text-primary">Latency Test</span>
          </div>
          <span className="inline-flex items-center gap-2 glass-card rounded-full px-3 py-1.5 text-xs font-semibold text-primary uppercase tracking-widest mb-4">Keyboard</span>
          <h1 className="text-section-title font-bold text-foreground mb-3">
            Input Latency <span className="text-primary">Test</span>
          </h1>
          <p className="text-muted-foreground text-base leading-relaxed max-w-xl">
            Measure keyboard input latency. Press and hold Space or Enter to measure the key press duration.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="glass-card rounded-2xl p-4 text-center">
            <div className="font-mono text-2xl font-bold text-primary mb-1">{latency !== null ? `${latency}ms` : '—'}</div>
            <div className="text-xs text-muted-foreground">Last Latency</div>
          </div>
          <div className="glass-card rounded-2xl p-4 text-center">
            <div className="font-mono text-2xl font-bold text-emerald-400 mb-1">{best !== null ? `${best}ms` : '—'}</div>
            <div className="text-xs text-muted-foreground">Best</div>
          </div>
          <div className="glass-card rounded-2xl p-4 text-center">
            <div className="font-mono text-2xl font-bold text-amber-400 mb-1">{avg !== null ? `${avg}ms` : '—'}</div>
            <div className="text-xs text-muted-foreground">Average</div>
          </div>
        </div>

        <div
          className={`glass-card rounded-2xl p-12 mb-8 text-center transition-all ${
            isPressed ? 'border-primary/50 bg-primary/10 shadow-[0_0_40px_rgba(0,212,255,0.2)]' : ''
          }`}
        >
          <div className={`w-24 h-24 rounded-full border-2 mx-auto mb-6 flex items-center justify-center transition-all ${
            isPressed ? 'border-primary bg-primary/20 scale-110' : 'border-border'
          }`}>
            <svg className={`w-10 h-10 transition-colors ${isPressed ? 'text-primary' : 'text-muted-foreground'}`} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
            </svg>
          </div>
          <div className="text-lg font-bold text-foreground mb-2">
            {isPressed ? 'Key Held...' : phase === 'done' ? `${latency}ms` : 'Press & Hold SPACE or ENTER'}
          </div>
          <div className="text-sm text-muted-foreground">
            {isPressed ? 'Release to measure' : 'Hold the key to measure press duration'}
          </div>
        </div>

        {history.length > 0 && (
          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-foreground mb-4">Measurement History</h3>
            <div className="flex flex-wrap gap-2">
              {history.map((t, i) => (
                <span key={i} className={`font-mono text-sm px-3 py-1.5 rounded-full glass-card ${
                  i === 0 ? 'text-primary border-primary/30' : 'text-muted-foreground'
                }`}>{t}ms</span>
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}
