'use client';
import React, { useState, useRef, useCallback, useEffect } from 'react';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import Link from 'next/link';

type Mode = 1 | 5 | 10 | 30 | 60;
type Phase = 'idle' | 'running' | 'done';

export default function CPSTestPage() {
  const [mode, setMode] = useState<Mode>(5);
  const [phase, setPhase] = useState<Phase>('idle');
  const [clicks, setClicks] = useState(0);
  const [timeLeft, setTimeLeft] = useState<number>(5);
  const [cps, setCps] = useState<number>(0);
  const [bestCps, setBestCps] = useState<number>(0);
  const [history, setHistory] = useState<number[]>([]);
  const startTimeRef = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const clicksRef = useRef(0);

  const startTest = useCallback(() => {
    setPhase('running');
    setClicks(0);
    clicksRef.current = 0;
    setTimeLeft(mode);
    startTimeRef.current = performance.now();

    timerRef.current = setInterval(() => {
      const elapsed = (performance.now() - startTimeRef.current) / 1000;
      const remaining = Math.max(0, mode - elapsed);
      setTimeLeft(remaining);
      const currentCps = elapsed > 0 ? clicksRef.current / elapsed : 0;
      setCps(parseFloat(currentCps.toFixed(2)));

      if (remaining <= 0) {
        if (timerRef.current) clearInterval(timerRef.current);
        const finalCps = parseFloat((clicksRef.current / mode).toFixed(2));
        setCps(finalCps);
        setBestCps(prev => Math.max(prev, finalCps));
        setHistory(prev => [finalCps, ...prev.slice(0, 9)]);
        setPhase('done');
      }
    }, 50);
  }, [mode]);

  const handleClick = useCallback(() => {
    if (phase === 'idle') {
      startTest();
      clicksRef.current = 1;
      setClicks(1);
    } else if (phase === 'running') {
      clicksRef.current += 1;
      setClicks(c => c + 1);
    }
  }, [phase, startTest]);

  const reset = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setPhase('idle');
    setClicks(0);
    setCps(0);
    setTimeLeft(mode);
    clicksRef.current = 0;
  }, [mode]);

  useEffect(() => {
    if (phase === 'idle') setTimeLeft(mode);
  }, [mode, phase]);

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const getRating = (c: number) => {
    if (c >= 14) return { label: 'Godlike', color: 'text-primary' };
    if (c >= 10) return { label: 'Pro Gamer', color: 'text-violet-400' };
    if (c >= 7) return { label: 'Fast', color: 'text-emerald-400' };
    if (c >= 4) return { label: 'Average', color: 'text-amber-400' };
    return { label: 'Slow', color: 'text-rose-400' };
  };

  const rating = getRating(cps);
  const progress = phase === 'running' ? ((mode - timeLeft) / mode) * 100 : phase === 'done' ? 100 : 0;

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="max-w-3xl mx-auto px-6 lg:px-8 pt-28 pb-20">
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Link href="/" className="text-xs text-muted-foreground hover:text-primary transition-colors">Home</Link>
            <span className="text-muted-foreground/40">/</span>
            <span className="text-xs text-primary">CPS Test</span>
          </div>
          <span className="inline-flex items-center gap-2 glass-card rounded-full px-3 py-1.5 text-xs font-semibold text-amber-400 uppercase tracking-widest mb-4">Gaming</span>
          <h1 className="text-section-title font-bold text-foreground mb-3">
            CPS <span className="text-primary">Test</span>
          </h1>
          <p className="text-muted-foreground text-base leading-relaxed max-w-xl">
            Measure your Clicks Per Second. Choose a time mode and click as fast as you can to see your CPS score.
          </p>
        </div>

        {/* Mode Selector */}
        <div className="flex flex-wrap gap-2 mb-8">
          {([1, 5, 10, 30, 60] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); reset(); }}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition-all ${
                mode === m
                  ? 'bg-primary text-black glow-cyan' :'glass-card text-muted-foreground hover:text-foreground hover:border-primary/30'
              }`}
            >
              {m}s
            </button>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="glass-card rounded-full h-2 mb-8 overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-100 rounded-full"
            style={{ width: `${progress}%`, boxShadow: 'rgba(0,212,255,0.5) 0 0 10px' }}
          />
        </div>

        {/* Main Click Area */}
        <div className="flex justify-center mb-8">
          <button
            onClick={handleClick}
            disabled={phase === 'done'}
            className={`relative w-72 h-72 rounded-full border-2 transition-all duration-100 select-none ${
              phase === 'running' ?'bg-primary/10 border-primary text-primary active:scale-95 shadow-[0_0_40px_rgba(0,212,255,0.3)]'
                : phase === 'done' ?'bg-emerald-500/10 border-emerald-400 text-emerald-400 cursor-default' :'glass-card border-border text-muted-foreground hover:border-primary/40 hover:text-primary active:scale-95'
            }`}
          >
            <div className="flex flex-col items-center gap-2">
              <div className="cps-counter text-foreground">{phase === 'idle' ? '?' : cps.toFixed(2)}</div>
              <div className="text-sm text-muted-foreground">CPS</div>
              <div className="font-mono text-lg font-bold text-foreground">{clicks} clicks</div>
              <div className="text-xs text-muted-foreground">
                {phase === 'idle' ? 'Click to start' : phase === 'running' ? `${timeLeft.toFixed(1)}s left` : 'Done!'}
              </div>
              {phase === 'done' && <div className={`text-sm font-bold ${rating.color}`}>{rating.label}</div>}
            </div>
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="glass-card rounded-2xl p-4 text-center">
            <div className="font-mono text-2xl font-bold text-primary mb-1">{cps.toFixed(2)}</div>
            <div className="text-xs text-muted-foreground">Current CPS</div>
          </div>
          <div className="glass-card rounded-2xl p-4 text-center">
            <div className="font-mono text-2xl font-bold text-amber-400 mb-1">{bestCps.toFixed(2)}</div>
            <div className="text-xs text-muted-foreground">Best CPS</div>
          </div>
          <div className="glass-card rounded-2xl p-4 text-center">
            <div className="font-mono text-2xl font-bold text-violet-400 mb-1">{clicks}</div>
            <div className="text-xs text-muted-foreground">Total Clicks</div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-3 mb-12">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 glass-card rounded-full px-6 py-3 text-sm font-semibold text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Reset
          </button>
        </div>

        {/* History */}
        {history.length > 0 && (
          <div className="glass-card rounded-2xl p-6 mb-8">
            <h3 className="text-sm font-semibold text-foreground mb-4">Recent Scores</h3>
            <div className="flex flex-wrap gap-2">
              {history.map((score, i) => (
                <span key={i} className={`font-mono text-sm px-3 py-1.5 rounded-full glass-card ${
                  i === 0 ? 'text-primary border-primary/30' : 'text-muted-foreground'
                }`}>
                  {score.toFixed(2)}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* CPS Rating Table */}
        <div className="glass-card rounded-2xl p-6">
          <h2 className="text-lg font-bold text-foreground mb-4">CPS Rating Scale</h2>
          <div className="space-y-2">
            {[
              { range: '14+ CPS', label: 'Godlike', color: 'text-primary', desc: 'World-class clicking speed' },
              { range: '10–14 CPS', label: 'Pro Gamer', color: 'text-violet-400', desc: 'Competitive gaming level' },
              { range: '7–10 CPS', label: 'Fast', color: 'text-emerald-400', desc: 'Above average speed' },
              { range: '4–7 CPS', label: 'Average', color: 'text-amber-400', desc: 'Normal clicking speed' },
              { range: '< 4 CPS', label: 'Slow', color: 'text-rose-400', desc: 'Below average' },
            ].map((r) => (
              <div key={r.range} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div className="flex items-center gap-3">
                  <span className={`font-mono text-sm font-bold ${r.color}`}>{r.range}</span>
                  <span className={`text-xs font-semibold ${r.color}`}>{r.label}</span>
                </div>
                <span className="text-xs text-muted-foreground">{r.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
