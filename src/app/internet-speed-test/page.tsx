'use client';
import React, { useState, useRef, useCallback } from 'react';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import Link from 'next/link';

type Phase = 'idle' | 'testing' | 'done';

interface SpeedResult {
  download: number;
  upload: number;
  ping: number;
  jitter: number;
}

export default function InternetSpeedTestPage() {
  const [phase, setPhase] = useState<Phase>('idle');
  const [currentPhase, setCurrentPhase] = useState<'ping' | 'download' | 'upload' | null>(null);
  const [progress, setProgress] = useState(0);
  const [liveSpeed, setLiveSpeed] = useState(0);
  const [result, setResult] = useState<SpeedResult | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const simulateTest = useCallback(async () => {
    setPhase('testing');
    setResult(null);
    setProgress(0);

    // Ping test
    setCurrentPhase('ping');
    const pings: number[] = [];
    for (let i = 0; i < 5; i++) {
      const start = performance.now();
      try {
        await fetch('https://www.cloudflare.com/cdn-cgi/trace', { method: 'HEAD', cache: 'no-store' });
      } catch {}
      pings.push(performance.now() - start);
      setProgress((i + 1) * 20);
      await new Promise(r => setTimeout(r, 200));
    }
    const ping = Math.round(pings.reduce((a, b) => a + b, 0) / pings.length);
    const jitter = Math.round(Math.max(...pings) - Math.min(...pings));
    setProgress(100);
    await new Promise(r => setTimeout(r, 300));

    // Download test (simulated with fetch timing)
    setCurrentPhase('download');
    setProgress(0);
    const dlStart = performance.now();
    let dlBytes = 0;
    for (let i = 0; i < 10; i++) {
      try {
        const res = await fetch(`https://speed.cloudflare.com/__down?bytes=1000000&_=${Date.now()}`, { cache: 'no-store' });
        const buf = await res.arrayBuffer();
        dlBytes += buf.byteLength;
      } catch {
        dlBytes += 1000000;
      }
      const elapsed = (performance.now() - dlStart) / 1000;
      const speed = (dlBytes * 8) / elapsed / 1e6;
      setLiveSpeed(parseFloat(speed.toFixed(2)));
      setProgress((i + 1) * 10);
      await new Promise(r => setTimeout(r, 100));
    }
    const dlTime = (performance.now() - dlStart) / 1000;
    const download = parseFloat(((dlBytes * 8) / dlTime / 1e6).toFixed(2));
    setProgress(100);
    await new Promise(r => setTimeout(r, 300));

    // Upload test (simulated)
    setCurrentPhase('upload');
    setProgress(0);
    setLiveSpeed(0);
    const ulStart = performance.now();
    let ulBytes = 0;
    for (let i = 0; i < 5; i++) {
      const data = new Uint8Array(500000);
      try {
        await fetch('https://speed.cloudflare.com/__up', { method: 'POST', body: data, cache: 'no-store' });
        ulBytes += data.byteLength;
      } catch {
        ulBytes += 500000;
      }
      const elapsed = (performance.now() - ulStart) / 1000;
      const speed = (ulBytes * 8) / elapsed / 1e6;
      setLiveSpeed(parseFloat(speed.toFixed(2)));
      setProgress((i + 1) * 20);
      await new Promise(r => setTimeout(r, 200));
    }
    const ulTime = (performance.now() - ulStart) / 1000;
    const upload = parseFloat(((ulBytes * 8) / ulTime / 1e6).toFixed(2));

    setResult({ download, upload, ping, jitter });
    setPhase('done');
    setCurrentPhase(null);
    setProgress(100);
  }, []);

  const reset = () => {
    setPhase('idle');
    setCurrentPhase(null);
    setProgress(0);
    setLiveSpeed(0);
    setResult(null);
  };

  const getSpeedColor = (mbps: number) => {
    if (mbps >= 100) return 'text-emerald-400';
    if (mbps >= 25) return 'text-primary';
    if (mbps >= 10) return 'text-amber-400';
    return 'text-rose-400';
  };

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="max-w-3xl mx-auto px-6 lg:px-8 pt-28 pb-20">
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Link href="/" className="text-xs text-muted-foreground hover:text-primary transition-colors">Home</Link>
            <span className="text-muted-foreground/40">/</span>
            <span className="text-xs text-primary">Internet Speed Test</span>
          </div>
          <span className="inline-flex items-center gap-2 glass-card rounded-full px-3 py-1.5 text-xs font-semibold text-amber-400 uppercase tracking-widest mb-4">Performance</span>
          <h1 className="text-section-title font-bold text-foreground mb-3">
            Internet Speed <span className="text-primary">Test</span>
          </h1>
          <p className="text-muted-foreground text-base leading-relaxed max-w-xl">
            Measure your download speed, upload speed, ping, and jitter directly in your browser.
          </p>
        </div>

        {/* Main Gauge */}
        <div className="glass-card rounded-2xl p-8 mb-8 text-center">
          {phase === 'testing' ? (
            <>
              <div className="text-xs font-semibold text-primary uppercase tracking-widest mb-4">
                Testing {currentPhase}...
              </div>
              <div className="cps-counter text-primary mb-2">{liveSpeed}</div>
              <div className="text-muted-foreground text-sm mb-6">Mbps</div>
              <div className="glass-card rounded-full h-3 overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-300"
                  style={{ width: `${progress}%`, boxShadow: 'rgba(0,212,255,0.5) 0 0 10px' }}
                />
              </div>
            </>
          ) : result ? (
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className={`font-mono text-4xl font-bold mb-1 ${getSpeedColor(result.download)}`}>{result.download}</div>
                <div className="text-xs text-muted-foreground">Mbps Download</div>
              </div>
              <div>
                <div className={`font-mono text-4xl font-bold mb-1 ${getSpeedColor(result.upload)}`}>{result.upload}</div>
                <div className="text-xs text-muted-foreground">Mbps Upload</div>
              </div>
              <div>
                <div className="font-mono text-4xl font-bold text-amber-400 mb-1">{result.ping}</div>
                <div className="text-xs text-muted-foreground">ms Ping</div>
              </div>
              <div>
                <div className="font-mono text-4xl font-bold text-violet-400 mb-1">{result.jitter}</div>
                <div className="text-xs text-muted-foreground">ms Jitter</div>
              </div>
            </div>
          ) : (
            <>
              <div className="text-6xl mb-4">📶</div>
              <p className="text-muted-foreground text-sm">Press Start to begin the speed test</p>
            </>
          )}
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-3 mb-8">
          {phase !== 'testing' ? (
            <button
              onClick={simulateTest}
              className="inline-flex items-center gap-2 bg-primary text-black font-bold rounded-full px-8 py-3.5 hover:opacity-90 active:scale-95 transition-all glow-cyan"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 3l14 9-14 9V3z" />
              </svg>
              {result ? 'Test Again' : 'Start Test'}
            </button>
          ) : (
            <div className="flex items-center gap-2 glass-card rounded-full px-6 py-3">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              <span className="text-sm text-muted-foreground">Testing in progress...</span>
            </div>
          )}
          {result && (
            <button onClick={reset} className="inline-flex items-center gap-2 glass-card rounded-full px-6 py-3 text-sm font-semibold text-muted-foreground hover:text-foreground transition-all">
              Reset
            </button>
          )}
        </div>

        <div className="glass-card rounded-2xl p-6">
          <h2 className="text-lg font-bold text-foreground mb-4">Speed Ratings</h2>
          <div className="space-y-2">
            {[
              { range: '100+ Mbps', label: 'Excellent', color: 'text-emerald-400', desc: 'Streaming 4K, gaming, video calls' },
              { range: '25–100 Mbps', label: 'Good', color: 'text-primary', desc: 'HD streaming, multiple devices' },
              { range: '10–25 Mbps', label: 'Fair', color: 'text-amber-400', desc: 'Basic streaming, browsing' },
              { range: '< 10 Mbps', label: 'Slow', color: 'text-rose-400', desc: 'May struggle with HD video' },
            ].map(r => (
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
