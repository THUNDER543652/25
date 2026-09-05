'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import Link from 'next/link';

type ButtonState = 'idle' | 'pressed' | 'released';

interface ButtonInfo {
  id: number;
  label: string;
  name: string;
  state: ButtonState;
  pressCount: number;
  lastLatency: number | null;
}

export default function MouseTestPage() {
  const [buttons, setButtons] = useState<ButtonInfo[]>([
    { id: 0, label: 'Left', name: 'LMB', state: 'idle', pressCount: 0, lastLatency: null },
    { id: 1, label: 'Middle', name: 'MMB', state: 'idle', pressCount: 0, lastLatency: null },
    { id: 2, label: 'Right', name: 'RMB', state: 'idle', pressCount: 0, lastLatency: null },
    { id: 3, label: 'Side Back', name: 'M4', state: 'idle', pressCount: 0, lastLatency: null },
    { id: 4, label: 'Side Fwd', name: 'M5', state: 'idle', pressCount: 0, lastLatency: null },
  ]);
  const [scrollCount, setScrollCount] = useState(0);
  const [scrollDir, setScrollDir] = useState<'up' | 'down' | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const pressTimeRef = useRef<Record<number, number>>({});
  const scrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseDown = useCallback((e: MouseEvent) => {
    e.preventDefault();
    const btn = e.button;
    pressTimeRef.current[btn] = performance.now();
    setButtons(prev => prev.map(b => b.id === btn ? { ...b, state: 'pressed', pressCount: b.pressCount + 1 } : b));
  }, []);

  const handleMouseUp = useCallback((e: MouseEvent) => {
    const btn = e.button;
    const latency = pressTimeRef.current[btn] ? Math.round(performance.now() - pressTimeRef.current[btn]) : null;
    setButtons(prev => prev.map(b => b.id === btn ? { ...b, state: 'released', lastLatency: latency } : b));
    setTimeout(() => {
      setButtons(prev => prev.map(b => b.id === btn ? { ...b, state: 'idle' } : b));
    }, 300);
  }, []);

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    setScrollCount(c => c + 1);
    setScrollDir(e.deltaY > 0 ? 'down' : 'up');
    if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
    scrollTimerRef.current = setTimeout(() => setScrollDir(null), 500);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  }, []);

  useEffect(() => {
    const testArea = document.getElementById('mouse-test-area');
    if (!testArea) return;
    testArea.addEventListener('mousedown', handleMouseDown);
    testArea.addEventListener('mouseup', handleMouseUp);
    testArea.addEventListener('wheel', handleWheel, { passive: false });
    testArea.addEventListener('mousemove', handleMouseMove);
    testArea.addEventListener('contextmenu', (e) => e.preventDefault());
    return () => {
      testArea.removeEventListener('mousedown', handleMouseDown);
      testArea.removeEventListener('mouseup', handleMouseUp);
      testArea.removeEventListener('wheel', handleWheel);
      testArea.removeEventListener('mousemove', handleMouseMove);
    };
  }, [handleMouseDown, handleMouseUp, handleWheel, handleMouseMove]);

  const resetAll = () => {
    setButtons(prev => prev.map(b => ({ ...b, state: 'idle', pressCount: 0, lastLatency: null })));
    setScrollCount(0);
    setScrollDir(null);
  };

  const getButtonStyle = (state: ButtonState) => {
    if (state === 'pressed') return 'bg-primary/30 border-primary text-primary shadow-[0_0_20px_rgba(0,212,255,0.4)]';
    if (state === 'released') return 'bg-emerald-500/20 border-emerald-400 text-emerald-400';
    return 'glass-card text-muted-foreground hover:border-primary/30';
  };

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="max-w-4xl mx-auto px-6 lg:px-8 pt-28 pb-20">
        {/* Page Header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Link href="/" className="text-xs text-muted-foreground hover:text-primary transition-colors">Home</Link>
            <span className="text-muted-foreground/40">/</span>
            <span className="text-xs text-primary">Mouse Test</span>
          </div>
          <span className="inline-flex items-center gap-2 glass-card rounded-full px-3 py-1.5 text-xs font-semibold text-violet-400 uppercase tracking-widest mb-4">
            Mouse Testing
          </span>
          <h1 className="text-section-title font-bold text-foreground mb-3">
            Mouse <span className="text-primary">Button Test</span>
          </h1>
          <p className="text-muted-foreground text-base leading-relaxed max-w-xl">
            Test all mouse buttons, scroll wheel, and measure click latency. Click inside the test area to detect left, right, middle, and side buttons.
          </p>
        </div>

        {/* Test Area */}
        <div
          id="mouse-test-area"
          className="glass-card rounded-2xl p-8 mb-8 cursor-crosshair select-none min-h-[300px] flex flex-col items-center justify-center border-2 border-dashed border-border hover:border-primary/30 transition-colors"
          style={{ userSelect: 'none' }}
        >
          <div className="text-center mb-8">
            <div className="text-4xl mb-3">🖱️</div>
            <p className="text-muted-foreground text-sm">Click, scroll, or move your mouse here</p>
            <p className="text-xs text-muted-foreground/60 mt-1">Right-click is captured (context menu disabled)</p>
          </div>

          {/* Mouse Position */}
          <div className="glass-card rounded-xl px-4 py-2 mb-6">
            <span className="font-mono text-xs text-muted-foreground">Position: </span>
            <span className="font-mono text-xs text-primary">{mousePos.x}, {mousePos.y}</span>
          </div>

          {/* Scroll Indicator */}
          <div className={`glass-card rounded-xl px-6 py-3 transition-all duration-300 ${
            scrollDir === 'up' ? 'border-primary/50 bg-primary/10' :
            scrollDir === 'down' ? 'border-amber-400/50 bg-amber-500/10' : ''
          }`}>
            <div className="flex items-center gap-3">
              <svg className={`w-5 h-5 transition-colors ${scrollDir === 'up' ? 'text-primary' : scrollDir === 'down' ? 'text-amber-400' : 'text-muted-foreground'}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" />
              </svg>
              <span className="text-sm font-mono text-muted-foreground">Scroll: <span className="text-foreground">{scrollCount}</span></span>
              {scrollDir && <span className={`text-xs font-semibold ${scrollDir === 'up' ? 'text-primary' : 'text-amber-400'}`}>{scrollDir === 'up' ? '▲ Up' : '▼ Down'}</span>}
            </div>
          </div>
        </div>

        {/* Button Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
          {buttons.map((btn) => (
            <div
              key={btn.id}
              className={`rounded-2xl p-4 border transition-all duration-150 text-center ${getButtonStyle(btn.state)}`}
            >
              <div className="font-mono text-lg font-bold mb-1">{btn.name}</div>
              <div className="text-xs text-muted-foreground mb-2">{btn.label}</div>
              <div className="font-mono text-sm font-semibold">{btn.pressCount} clicks</div>
              {btn.lastLatency !== null && (
                <div className="text-xs text-muted-foreground mt-1">{btn.lastLatency}ms</div>
              )}
              <div className={`mt-2 text-xs font-semibold uppercase tracking-wide ${
                btn.state === 'pressed' ? 'text-primary' :
                btn.state === 'released' ? 'text-emerald-400' : 'text-muted-foreground/40'
              }`}>
                {btn.state === 'pressed' ? 'PRESSED' : btn.state === 'released' ? 'RELEASED' : 'IDLE'}
              </div>
            </div>
          ))}
        </div>

        {/* Reset */}
        <div className="flex justify-center mb-12">
          <button
            onClick={resetAll}
            className="inline-flex items-center gap-2 glass-card rounded-full px-6 py-3 text-sm font-semibold text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Reset All
          </button>
        </div>

        {/* Info */}
        <div className="glass-card rounded-2xl p-6">
          <h2 className="text-lg font-bold text-foreground mb-4">About Mouse Button Test</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-muted-foreground leading-relaxed">
            <div>
              <h3 className="text-foreground font-semibold mb-2">What does it test?</h3>
              <p>This tool detects all mouse button inputs including left click (LMB), right click (RMB), middle click (MMB), and side buttons (M4/M5). It also measures click latency and scroll wheel direction.</p>
            </div>
            <div>
              <h3 className="text-foreground font-semibold mb-2">How to use</h3>
              <p>Click inside the test area with any mouse button. The corresponding button will light up. Scroll your mouse wheel to test scroll direction. Click latency is shown in milliseconds.</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
