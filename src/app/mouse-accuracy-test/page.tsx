'use client';
import React, { useState, useRef, useCallback, useEffect } from 'react';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import Link from 'next/link';

interface Target {
  id: number;
  x: number;
  y: number;
  size: number;
}

export default function MouseAccuracyTestPage() {
  const [targets, setTargets] = useState<Target[]>([]);
  const [score, setScore] = useState(0);
  const [misses, setMisses] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [accuracy, setAccuracy] = useState(100);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const areaRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(0);

  const spawnTarget = useCallback(() => {
    const area = areaRef.current;
    if (!area) return;
    const rect = area.getBoundingClientRect();
    const size = 30 + Math.random() * 40;
    const x = size + Math.random() * (rect.width - size * 2);
    const y = size + Math.random() * (rect.height - size * 2);
    idRef.current += 1;
    setTargets(prev => [...prev.slice(-4), { id: idRef.current, x, y, size }]);
  }, []);

  const startTest = () => {
    setIsRunning(true);
    setScore(0);
    setMisses(0);
    setTimeLeft(30);
    setAccuracy(100);
    spawnTarget();
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setIsRunning(false);
          setTargets([]);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleTargetClick = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setScore(s => s + 1);
    setTargets(prev => prev.filter(t => t.id !== id));
    spawnTarget();
    setAccuracy(prev => {
      const total = score + misses + 1;
      return Math.round(((score + 1) / total) * 100);
    });
  };

  const handleMiss = () => {
    if (!isRunning) return;
    setMisses(m => m + 1);
    setAccuracy(prev => {
      const total = score + misses + 1;
      return Math.round((score / total) * 100);
    });
  };

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="max-w-4xl mx-auto px-6 lg:px-8 pt-28 pb-20">
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Link href="/" className="text-xs text-muted-foreground hover:text-primary transition-colors">Home</Link>
            <span className="text-muted-foreground/40">/</span>
            <span className="text-xs text-primary">Mouse Accuracy Test</span>
          </div>
          <span className="inline-flex items-center gap-2 glass-card rounded-full px-3 py-1.5 text-xs font-semibold text-emerald-400 uppercase tracking-widest mb-4">Gaming</span>
          <h1 className="text-section-title font-bold text-foreground mb-3">
            Mouse Accuracy <span className="text-primary">Test</span>
          </h1>
          <p className="text-muted-foreground text-base leading-relaxed max-w-xl">
            Test your mouse accuracy by clicking targets as fast and accurately as possible.
          </p>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { val: score, label: 'Hits', color: 'text-emerald-400' },
            { val: misses, label: 'Misses', color: 'text-rose-400' },
            { val: `${accuracy}%`, label: 'Accuracy', color: 'text-primary' },
            { val: `${timeLeft}s`, label: 'Time', color: 'text-amber-400' },
          ].map(s => (
            <div key={s.label} className="glass-card rounded-2xl p-4 text-center">
              <div className={`font-mono text-2xl font-bold ${s.color} mb-1`}>{s.val}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>

        <div
          ref={areaRef}
          onClick={handleMiss}
          className="glass-card rounded-2xl relative overflow-hidden mb-6 cursor-crosshair"
          style={{ height: '400px' }}
        >
          {!isRunning && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                {timeLeft === 0 ? (
                  <>
                    <div className="text-2xl font-bold text-foreground mb-2">Score: {score}</div>
                    <div className="text-muted-foreground text-sm mb-4">Accuracy: {accuracy}%</div>
                    <button onClick={startTest} className="bg-primary text-black font-bold rounded-full px-8 py-3 hover:opacity-90 transition-all glow-cyan">Play Again</button>
                  </>
                ) : (
                  <button onClick={startTest} className="bg-primary text-black font-bold rounded-full px-8 py-4 text-lg hover:opacity-90 transition-all glow-cyan">
                    Start Accuracy Test
                  </button>
                )}
              </div>
            </div>
          )}
          {targets.map(target => (
            <button
              key={target.id}
              onClick={(e) => handleTargetClick(target.id, e)}
              className="absolute rounded-full bg-primary/20 border-2 border-primary hover:bg-primary/40 transition-all active:scale-90"
              style={{
                left: target.x - target.size / 2,
                top: target.y - target.size / 2,
                width: target.size,
                height: target.size,
                boxShadow: 'rgba(0,212,255,0.4) 0 0 15px',
              }}
            />
          ))}
        </div>
      </div>
      <Footer />
    </main>
  );
}
