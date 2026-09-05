'use client';
import React, { useState, useRef, useCallback } from 'react';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import Link from 'next/link';

interface ClickEvent {
  time: number;
  gap: number | null;
  isDouble: boolean;
}

export default function DoubleClickTestPage() {
  const [clicks, setClicks] = useState<ClickEvent[]>([]);
  const [doubleClickCount, setDoubleClickCount] = useState(0);
  const [lastGap, setLastGap] = useState<number | null>(null);
  const [status, setStatus] = useState<'idle' | 'double' | 'single'>('idle');
  const lastClickTime = useRef<number | null>(null);
  const DOUBLE_CLICK_THRESHOLD = 500;

  const handleClick = useCallback(() => {
    const now = performance.now();
    const gap = lastClickTime.current !== null ? Math.round(now - lastClickTime.current) : null;
    const isDouble = gap !== null && gap < DOUBLE_CLICK_THRESHOLD;

    lastClickTime.current = now;
    setLastGap(gap);

    if (isDouble) {
      setDoubleClickCount(c => c + 1);
      setStatus('double');
    } else {
      setStatus('single');
    }

    setClicks(prev => [{ time: now, gap, isDouble }, ...prev.slice(0, 19)]);

    setTimeout(() => setStatus('idle'), 600);
  }, []);

  const reset = () => {
    setClicks([]);
    setDoubleClickCount(0);
    setLastGap(null);
    setStatus('idle');
    lastClickTime.current = null;
  };

  const totalClicks = clicks.length;
  const singleClicks = clicks.filter(c => !c.isDouble).length;
  const avgGap = clicks.filter(c => c.gap !== null).length > 0
    ? Math.round(clicks.filter(c => c.gap !== null).reduce((a, c) => a + (c.gap ?? 0), 0) / clicks.filter(c => c.gap !== null).length)
    : null;

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="max-w-3xl mx-auto px-6 lg:px-8 pt-28 pb-20">
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Link href="/" className="text-xs text-muted-foreground hover:text-primary transition-colors">Home</Link>
            <span className="text-muted-foreground/40">/</span>
            <span className="text-xs text-primary">Double Click Test</span>
          </div>
          <span className="inline-flex items-center gap-2 glass-card rounded-full px-3 py-1.5 text-xs font-semibold text-rose-400 uppercase tracking-widest mb-4">Mouse Testing</span>
          <h1 className="text-section-title font-bold text-foreground mb-3">
            Double Click <span className="text-primary">Test</span>
          </h1>
          <p className="text-muted-foreground text-base leading-relaxed max-w-xl">
            Detect faulty mouse double-clicks. Click the button below rapidly to see if your mouse registers unintended double-clicks.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Clicks', value: totalClicks, color: 'text-primary' },
            { label: 'Double Clicks', value: doubleClickCount, color: 'text-rose-400' },
            { label: 'Single Clicks', value: singleClicks, color: 'text-emerald-400' },
            { label: 'Last Gap', value: lastGap !== null ? `${lastGap}ms` : '—', color: 'text-amber-400' },
          ].map((stat) => (
            <div key={stat.label} className="glass-card rounded-2xl p-4 text-center">
              <div className={`font-mono text-2xl font-bold ${stat.color} mb-1`}>{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Click Button */}
        <div className="flex justify-center mb-8">
          <button
            onClick={handleClick}
            className={`relative w-64 h-64 rounded-full border-2 transition-all duration-150 font-bold text-xl select-none ${
              status === 'double'
                ? 'bg-rose-500/20 border-rose-400 text-rose-400 scale-95 shadow-[0_0_40px_rgba(244,63,94,0.4)]'
                : status === 'single' ?'bg-primary/20 border-primary text-primary scale-95 shadow-[0_0_40px_rgba(0,212,255,0.4)]' :'glass-card border-border text-muted-foreground hover:border-primary/40 hover:text-primary'
            }`}
          >
            <div className="flex flex-col items-center gap-2">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zm-7.518-.267A8.25 8.25 0 1120.25 10.5M8.288 14.212A5.25 5.25 0 1117.25 10.5" />
              </svg>
              <span>{status === 'double' ? '⚠️ DOUBLE!' : status === 'single' ? 'CLICKED' : 'CLICK ME'}</span>
              {lastGap !== null && <span className="font-mono text-sm">{lastGap}ms</span>}
            </div>
          </button>
        </div>

        {/* Average */}
        {avgGap !== null && (
          <div className="text-center mb-8">
            <span className="glass-card rounded-full px-4 py-2 text-sm text-muted-foreground">
              Average gap: <span className="font-mono text-primary">{avgGap}ms</span>
              {' '}&bull;{' '}
              Threshold: <span className="font-mono text-amber-400">{DOUBLE_CLICK_THRESHOLD}ms</span>
            </span>
          </div>
        )}

        {/* Click Log */}
        {clicks.length > 0 && (
          <div className="glass-card rounded-2xl p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-foreground">Click Log</h3>
              <button onClick={reset} className="text-xs text-muted-foreground hover:text-primary transition-colors">Clear</button>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {clicks.map((click, i) => (
                <div key={i} className={`flex items-center justify-between py-1.5 px-3 rounded-lg text-xs ${
                  click.isDouble ? 'bg-rose-500/10 border border-rose-500/20' : 'bg-white/3'
                }`}>
                  <span className={click.isDouble ? 'text-rose-400 font-semibold' : 'text-muted-foreground'}>
                    {click.isDouble ? '⚠️ Double Click' : 'Single Click'}
                  </span>
                  <span className="font-mono text-muted-foreground">
                    {click.gap !== null ? `${click.gap}ms gap` : 'First click'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="glass-card rounded-2xl p-6">
          <h2 className="text-lg font-bold text-foreground mb-4">About Double Click Test</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-muted-foreground leading-relaxed">
            <div>
              <h3 className="text-foreground font-semibold mb-2">What is a double-click fault?</h3>
              <p>A faulty mouse registers two clicks when you only clicked once. This is common in aging mice where the micro-switch debounce fails, causing unintended double-clicks in games and applications.</p>
            </div>
            <div>
              <h3 className="text-foreground font-semibold mb-2">How to interpret results</h3>
              <p>If you see "Double Click" detected when you only clicked once, your mouse has a debounce issue. Gaps under {DOUBLE_CLICK_THRESHOLD}ms between clicks are flagged as potential double-clicks.</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
