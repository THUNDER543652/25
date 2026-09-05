'use client';
import React, { useState, useRef, useCallback, useEffect } from 'react';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import Link from 'next/link';

type Phase = 'idle' | 'waiting' | 'ready' | 'done';

export default function ReactionTimeTestPage() {
  const [phase, setPhase] = useState<Phase>('idle');
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [history, setHistory] = useState<number[]>([]);
  const [tooEarly, setTooEarly] = useState(false);
  const startRef = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startTest = useCallback(() => {
    setPhase('waiting');
    setTooEarly(false);
    setReactionTime(null);
    const delay = 1500 + Math.random() * 3500;
    timerRef.current = setTimeout(() => {
      setPhase('ready');
      startRef.current = performance.now();
    }, delay);
  }, []);

  const handleClick = useCallback(() => {
    if (phase === 'idle') { startTest(); return; }
    if (phase === 'waiting') {
      if (timerRef.current) clearTimeout(timerRef.current);
      setTooEarly(true);
      setPhase('idle');
      return;
    }
    if (phase === 'ready') {
      const rt = Math.round(performance.now() - startRef.current);
      setReactionTime(rt);
      setHistory(prev => [rt, ...prev.slice(0, 9)]);
      setPhase('done');
    }
  }, [phase, startTest]);

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  const avg = history.length > 0 ? Math.round(history.reduce((a, b) => a + b, 0) / history.length) : null;
  const best = history.length > 0 ? Math.min(...history) : null;

  const getRating = (ms: number) => {
    if (ms < 150) return { label: 'Superhuman', color: 'text-primary' };
    if (ms < 200) return { label: 'Pro Gamer', color: 'text-violet-400' };
    if (ms < 250) return { label: 'Fast', color: 'text-emerald-400' };
    if (ms < 300) return { label: 'Average', color: 'text-amber-400' };
    return { label: 'Slow', color: 'text-rose-400' };
  };

  const bgColor = phase === 'waiting' ? 'bg-amber-500/10 border-amber-400/30' : phase === 'ready' ? 'bg-emerald-500/20 border-emerald-400' : 'glass-card';

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="max-w-3xl mx-auto px-6 lg:px-8 pt-28 pb-20">
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Link href="/" className="text-xs text-muted-foreground hover:text-primary transition-colors">Home</Link>
            <span className="text-muted-foreground/40">/</span>
            <span className="text-xs text-primary">Reaction Time Test</span>
          </div>
          <span className="inline-flex items-center gap-2 glass-card rounded-full px-3 py-1.5 text-xs font-semibold text-amber-400 uppercase tracking-widest mb-4">Performance</span>
          <h1 className="text-section-title font-bold text-foreground mb-3">
            Reaction Time <span className="text-primary">Test</span>
          </h1>
          <p className="text-muted-foreground text-base leading-relaxed max-w-xl">
            Measure your reaction time. Wait for the green signal and click as fast as you can.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="glass-card rounded-2xl p-4 text-center">
            <div className="font-mono text-2xl font-bold text-primary mb-1">{reactionTime !== null ? `${reactionTime}ms` : '—'}</div>
            <div className="text-xs text-muted-foreground">Last Result</div>
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

        {/* Test Area */}
        <div className="flex justify-center mb-8">
          <button
            onClick={handleClick}
            className={`w-80 h-80 rounded-full border-2 transition-all duration-150 select-none flex flex-col items-center justify-center gap-3 ${
              phase === 'ready' ? 'bg-emerald-500/20 border-emerald-400 shadow-[0_0_60px_rgba(16,185,129,0.4)] scale-105' :
              phase === 'waiting' ? 'bg-amber-500/10 border-amber-400/30' :
              phase === 'done'? 'bg-primary/10 border-primary' : 'glass-card border-border hover:border-primary/40'
            }`}
          >
            {phase === 'idle' && (
              <>
                <div className="text-4xl">⚡</div>
                <div className="text-lg font-bold text-foreground">Click to Start</div>
              </>
            )}
            {phase === 'waiting' && (
              <>
                <div className="text-4xl">⏳</div>
                <div className="text-lg font-bold text-amber-400">Wait...</div>
                <div className="text-xs text-muted-foreground">Don\'t click yet!</div>
              </>
            )}
            {phase === 'ready' && (
              <>
                <div className="text-4xl">🟢</div>
                <div className="text-2xl font-bold text-emerald-400">CLICK NOW!</div>
              </>
            )}
            {phase === 'done' && reactionTime !== null && (
              <>
                <div className="cps-counter text-primary">{reactionTime}</div>
                <div className="text-sm text-muted-foreground">milliseconds</div>
                <div className={`text-sm font-bold ${getRating(reactionTime).color}`}>{getRating(reactionTime).label}</div>
                <div className="text-xs text-muted-foreground mt-2">Click to try again</div>
              </>
            )}
          </button>
        </div>

        {tooEarly && (
          <div className="text-center mb-6">
            <span className="glass-card rounded-full px-4 py-2 text-sm text-rose-400">⚠️ Too early! Wait for the green signal.</span>
          </div>
        )}

        {history.length > 0 && (
          <div className="glass-card rounded-2xl p-6 mb-8">
            <h3 className="text-sm font-semibold text-foreground mb-4">History</h3>
            <div className="flex flex-wrap gap-2">
              {history.map((t, i) => (
                <span key={i} className={`font-mono text-sm px-3 py-1.5 rounded-full glass-card ${
                  i === 0 ? 'text-primary border-primary/30' : 'text-muted-foreground'
                }`}>{t}ms</span>
              ))}
            </div>
          </div>
        )}

        <div className="glass-card rounded-2xl p-6">
          <h2 className="text-lg font-bold text-foreground mb-4">Reaction Time Scale</h2>
          <div className="space-y-2">
            {[
              { range: '< 150ms', label: 'Superhuman', color: 'text-primary' },
              { range: '150–200ms', label: 'Pro Gamer', color: 'text-violet-400' },
              { range: '200–250ms', label: 'Fast', color: 'text-emerald-400' },
              { range: '250–300ms', label: 'Average', color: 'text-amber-400' },
              { range: '> 300ms', label: 'Slow', color: 'text-rose-400' },
            ].map(r => (
              <div key={r.range} className="flex items-center gap-4 py-2 border-b border-border last:border-0">
                <span className={`font-mono text-sm font-bold ${r.color} w-24`}>{r.range}</span>
                <span className={`text-xs font-semibold ${r.color}`}>{r.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
