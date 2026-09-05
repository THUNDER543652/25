'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import Link from 'next/link';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DataPoint {
  time: number;
  hz: number;
}

export default function MousePollingRateTestPage() {
  const [hz, setHz] = useState<number>(0);
  const [peakHz, setPeakHz] = useState<number>(0);
  const [avgHz, setAvgHz] = useState<number>(0);
  const [chartData, setChartData] = useState<DataPoint[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [category, setCategory] = useState<string>('—');
  const moveTimes = useRef<number[]>([]);
  const rafRef = useRef<number>(0);
  const startRef = useRef<number>(0);
  const sampleCountRef = useRef(0);

  const handleMouseMove = useCallback(() => {
    moveTimes.current.push(performance.now());
  }, []);

  const calcHz = useCallback(() => {
    const now = performance.now();
    const windowMs = 1000;
    const recent = moveTimes.current.filter(t => now - t < windowMs);
    moveTimes.current = recent;
    const currentHz = recent.length;
    setHz(currentHz);
    setPeakHz(prev => Math.max(prev, currentHz));

    sampleCountRef.current += 1;
    setChartData(prev => {
      const newPoint = { time: sampleCountRef.current, hz: currentHz };
      return [...prev.slice(-30), newPoint];
    });

    setAvgHz(prev => {
      const total = prev * (sampleCountRef.current - 1) + currentHz;
      return Math.round(total / sampleCountRef.current);
    });

    const cat = currentHz >= 1800 ? '2000Hz+' : currentHz >= 900 ? '1000Hz' : currentHz >= 450 ? '500Hz' : currentHz >= 200 ? '250Hz' : '125Hz';
    setCategory(cat);

    rafRef.current = requestAnimationFrame(calcHz);
  }, []);

  const startTest = () => {
    setIsRunning(true);
    setChartData([]);
    setPeakHz(0);
    setAvgHz(0);
    sampleCountRef.current = 0;
    moveTimes.current = [];
    startRef.current = performance.now();
    rafRef.current = requestAnimationFrame(calcHz);
    window.addEventListener('mousemove', handleMouseMove);
  };

  const stopTest = () => {
    setIsRunning(false);
    cancelAnimationFrame(rafRef.current);
    window.removeEventListener('mousemove', handleMouseMove);
  };

  useEffect(() => {
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [handleMouseMove]);

  const hzLevels = [
    { hz: 125, label: '125Hz', desc: 'Standard mice', color: 'text-muted-foreground' },
    { hz: 250, label: '250Hz', desc: 'Mid-range gaming', color: 'text-amber-400' },
    { hz: 500, label: '500Hz', desc: 'Gaming mice', color: 'text-emerald-400' },
    { hz: 1000, label: '1000Hz', desc: 'High-end gaming', color: 'text-primary' },
    { hz: 2000, label: '2000Hz+', desc: 'Pro gaming', color: 'text-violet-400' },
  ];

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="max-w-4xl mx-auto px-6 lg:px-8 pt-28 pb-20">
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Link href="/" className="text-xs text-muted-foreground hover:text-primary transition-colors">Home</Link>
            <span className="text-muted-foreground/40">/</span>
            <span className="text-xs text-primary">Mouse Polling Rate Test</span>
          </div>
          <span className="inline-flex items-center gap-2 glass-card rounded-full px-3 py-1.5 text-xs font-semibold text-primary uppercase tracking-widest mb-4">Mouse Testing</span>
          <h1 className="text-section-title font-bold text-foreground mb-3">
            Mouse Polling Rate <span className="text-primary">Test</span>
          </h1>
          <p className="text-muted-foreground text-base leading-relaxed max-w-xl">
            Measure your mouse polling rate in Hz. Move your mouse continuously to get an accurate reading.
          </p>
        </div>

        {/* Main Display */}
        <div className="glass-card rounded-2xl p-8 mb-8 text-center">
          <div className="cps-counter text-primary mb-2">{hz}</div>
          <div className="text-muted-foreground text-sm mb-4">Hz (polls/second)</div>
          <div className="inline-flex items-center gap-2 glass-card rounded-full px-4 py-2 mb-6">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse-glow"></span>
            <span className="font-mono text-sm font-bold text-primary">{category}</span>
          </div>
          <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto">
            <div>
              <div className="font-mono text-xl font-bold text-amber-400">{peakHz}</div>
              <div className="text-xs text-muted-foreground">Peak Hz</div>
            </div>
            <div>
              <div className="font-mono text-xl font-bold text-emerald-400">{avgHz}</div>
              <div className="text-xs text-muted-foreground">Avg Hz</div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-3 mb-8">
          {!isRunning ? (
            <button
              onClick={startTest}
              className="inline-flex items-center gap-2 bg-primary text-black font-bold rounded-full px-8 py-3.5 hover:opacity-90 active:scale-95 transition-all glow-cyan"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 3l14 9-14 9V3z" />
              </svg>
              Start Test
            </button>
          ) : (
            <button
              onClick={stopTest}
              className="inline-flex items-center gap-2 glass-card rounded-full px-8 py-3.5 text-sm font-semibold text-rose-400 border-rose-500/30 hover:border-rose-400/50 transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 7.5A2.25 2.25 0 017.5 5.25h9a2.25 2.25 0 012.25 2.25v9a2.25 2.25 0 01-2.25 2.25h-9a2.25 2.25 0 01-2.25-2.25v-9z" />
              </svg>
              Stop
            </button>
          )}
        </div>

        {/* Move Area */}
        {isRunning && (
          <div className="glass-card rounded-2xl p-6 mb-8 text-center border-primary/20">
            <div className="text-4xl mb-2">🖱️</div>
            <p className="text-muted-foreground text-sm">Move your mouse here for accurate readings</p>
          </div>
        )}

        {/* Live Chart */}
        {chartData.length > 2 && (
          <div className="glass-card rounded-2xl p-6 mb-8">
            <h3 className="text-sm font-semibold text-foreground mb-4">Live Polling Rate Graph</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="time" hide />
                <YAxis domain={[0, Math.max(2100, peakHz + 100)]} tick={{ fill: '#6B7A99', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ background: '#111118', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', color: '#F0F4FF' }}
                  formatter={(v: number) => [`${v} Hz`, 'Polling Rate']}
                />
                <Line type="monotone" dataKey="hz" stroke="#00D4FF" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Hz Levels */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4">Polling Rate Levels</h3>
          <div className="space-y-3">
            {hzLevels.map((level) => (
              <div key={level.hz} className={`flex items-center justify-between py-2 border-b border-border last:border-0 ${
                hz >= level.hz && hz < (level.hz * 2) ? 'opacity-100' : 'opacity-60'
              }`}>
                <div className="flex items-center gap-3">
                  <span className={`font-mono text-sm font-bold ${level.color}`}>{level.label}</span>
                  <span className="text-xs text-muted-foreground">{level.desc}</span>
                </div>
                {hz >= level.hz && hz < (level.hz * 2) && (
                  <span className="text-xs font-semibold text-primary">Your Mouse</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
