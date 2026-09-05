'use client';
import React, { useState, useRef, useCallback, useEffect } from 'react';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import Link from 'next/link';

type Mode = 1 | 5 | 10;
type Phase = 'idle' | 'running' | 'done';

export default function DragClickTestPage() {
  const [mode, setMode] = useState<Mode>(5);
  const [phase, setPhase] = useState<Phase>('idle');
  const [clicks, setClicks] = useState(0);
  const [timeLeft, setTimeLeft] = useState(5);
  const [cps, setCps] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startRef = useRef<number>(0);
  const clicksRef = useRef(0);

  const startTest = useCallback(() => {
    setPhase('running');
    setClicks(0);
    clicksRef.current = 0;
    startRef.current = performance.now();
    setTimeLeft(mode);
    timerRef.current = setInterval(() => {
      const elapsed = (performance.now() - startRef.current) / 1000;
      const remaining = Math.max(0, mode - elapsed);
      setTimeLeft(remaining);
      setCps(parseFloat((clicksRef.current / elapsed).toFixed(2)));
      if (remaining <= 0) {
        if (timerRef.current) clearInterval(timerRef.current);
        setPhase('done');
      }
    }, 50);
  }, [mode]);

  const handleMouseDown = useCallback(() => {
    if (phase === 'idle') startTest();
    if (phase === 'running') {
      setIsDragging(true);
      clicksRef.current += 1;
      setClicks(c => c + 1);
    }
  }, [phase, startTest]);

  const handleMouseMove = useCallback(() => {
    if (isDragging && phase === 'running') {
      clicksRef.current += 0.1;
      setClicks(c => c + 0.1);
    }
  }, [isDragging, phase]);

  const handleMouseUp = useCallback(() => setIsDragging(false), []);

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  const reset = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setPhase('idle');
    setClicks(0);
    setCps(0);
    setTimeLeft(mode);
    setIsDragging(false);
    clicksRef.current = 0;
  };

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="max-w-3xl mx-auto px-6 lg:px-8 pt-28 pb-20">
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Link href="/" className="text-xs text-muted-foreground hover:text-primary transition-colors">Home</Link>
            <span className="text-muted-foreground/40">/</span>
            <span className="text-xs text-primary">Drag Click Test</span>
          </div>
          <span className="inline-flex items-center gap-2 glass-card rounded-full px-3 py-1.5 text-xs font-semibold text-amber-400 uppercase tracking-widest mb-4">Gaming</span>
          <h1 className="text-section-title font-bold text-foreground mb-3">
            Drag Click <span className="text-primary">Test</span>
          </h1>
          <p className="text-muted-foreground text-base leading-relaxed max-w-xl">
            Test your drag clicking technique. Press and drag your mouse across the button to register rapid clicks.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {([1, 5, 10] as Mode[]).map(m => (
            <button key={m} onClick={() => { setMode(m); reset(); }}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition-all ${
                mode === m ? 'bg-primary text-black glow-cyan' : 'glass-card text-muted-foreground hover:text-foreground hover:border-primary/30'
              }`}>{m}s</button>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="glass-card rounded-2xl p-4 text-center">
            <div className="font-mono text-2xl font-bold text-primary mb-1">{Math.floor(clicks)}</div>
            <div className="text-xs text-muted-foreground">Clicks</div>
          </div>
          <div className="glass-card rounded-2xl p-4 text-center">
            <div className="font-mono text-2xl font-bold text-amber-400 mb-1">{cps.toFixed(1)}</div>
            <div className="text-xs text-muted-foreground">CPS</div>
          </div>
          <div className="glass-card rounded-2xl p-4 text-center">
            <div className="font-mono text-2xl font-bold text-violet-400 mb-1">{timeLeft.toFixed(1)}s</div>
            <div className="text-xs text-muted-foreground">Time Left</div>
          </div>
        </div>

        <div className="flex justify-center mb-8">
          <div
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className={`w-80 h-32 rounded-2xl border-2 flex items-center justify-center cursor-pointer select-none transition-all ${
              isDragging ? 'bg-primary/20 border-primary shadow-[0_0_30px_rgba(0,212,255,0.4)]' :
              phase === 'running'? 'glass-card border-primary/30 hover:border-primary/50' : 'glass-card border-border hover:border-primary/30'
            }`}
          >
            <div className="text-center">
              <div className="text-lg font-bold text-foreground">
                {phase === 'idle' ? 'Click & Drag Here' : isDragging ? 'DRAGGING!' : phase === 'done' ? 'Done!' : 'Keep Dragging!'}
              </div>
              <div className="text-xs text-muted-foreground mt-1">Hold mouse button and drag</div>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <button onClick={reset} className="inline-flex items-center gap-2 glass-card rounded-full px-6 py-3 text-sm font-semibold text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all">
            Reset
          </button>
        </div>
      </div>
      <Footer />
    </main>
  );
}
