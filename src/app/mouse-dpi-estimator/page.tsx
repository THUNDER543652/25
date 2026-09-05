'use client';
import React, { useState, useRef, useCallback } from 'react';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import Link from 'next/link';

export default function MouseDPIEstimatorPage() {
  const [dpi, setDpi] = useState<number | null>(null);
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null);
  const [endPos, setEndPos] = useState<{ x: number; y: number } | null>(null);
  const [physicalInches, setPhysicalInches] = useState('6');
  const [sensitivity, setSensitivity] = useState<number | null>(null);
  const areaRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!isCalibrating) return;
    setStartPos({ x: e.clientX, y: e.clientY });
    setEndPos(null);
  }, [isCalibrating]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isCalibrating || !startPos) return;
    setEndPos({ x: e.clientX, y: e.clientY });
  }, [isCalibrating, startPos]);

  const handleMouseUp = useCallback((e: React.MouseEvent) => {
    if (!isCalibrating || !startPos) return;
    const dx = e.clientX - startPos.x;
    const dy = e.clientY - startPos.y;
    const pixelDistance = Math.sqrt(dx * dx + dy * dy);
    const inches = parseFloat(physicalInches);
    if (inches > 0 && pixelDistance > 10) {
      const estimatedDpi = Math.round(pixelDistance / inches);
      setDpi(estimatedDpi);
      setSensitivity(parseFloat((inches / pixelDistance * 100).toFixed(2)));
    }
    setIsCalibrating(false);
    setStartPos(null);
  }, [isCalibrating, startPos, physicalInches]);

  const pixelDistance = startPos && endPos
    ? Math.round(Math.sqrt(Math.pow(endPos.x - startPos.x, 2) + Math.pow(endPos.y - startPos.y, 2)))
    : 0;

  const getDPICategory = (d: number) => {
    if (d >= 16000) return { label: 'Ultra High', color: 'text-violet-400' };
    if (d >= 3200) return { label: 'High', color: 'text-primary' };
    if (d >= 800) return { label: 'Medium', color: 'text-emerald-400' };
    if (d >= 400) return { label: 'Low', color: 'text-amber-400' };
    return { label: 'Very Low', color: 'text-rose-400' };
  };

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="max-w-3xl mx-auto px-6 lg:px-8 pt-28 pb-20">
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Link href="/" className="text-xs text-muted-foreground hover:text-primary transition-colors">Home</Link>
            <span className="text-muted-foreground/40">/</span>
            <span className="text-xs text-primary">Mouse DPI Estimator</span>
          </div>
          <span className="inline-flex items-center gap-2 glass-card rounded-full px-3 py-1.5 text-xs font-semibold text-primary uppercase tracking-widest mb-4">Mouse Testing</span>
          <h1 className="text-section-title font-bold text-foreground mb-3">
            Mouse DPI <span className="text-primary">Estimator</span>
          </h1>
          <p className="text-muted-foreground text-base leading-relaxed max-w-xl">
            Estimate your mouse DPI by moving it a known physical distance and measuring the pixel movement.
          </p>
        </div>

        {dpi && (
          <div className="glass-card rounded-2xl p-8 mb-8 text-center">
            <div className="cps-counter text-primary mb-2">{dpi}</div>
            <div className="text-muted-foreground text-sm mb-3">Estimated DPI</div>
            <span className={`text-sm font-bold ${getDPICategory(dpi).color}`}>{getDPICategory(dpi).label}</span>
          </div>
        )}

        <div className="glass-card rounded-2xl p-6 mb-6">
          <h3 className="text-sm font-semibold text-foreground mb-4">Calibration Setup</h3>
          <div className="mb-4">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2 block">
              Physical Distance to Move Mouse (inches)
            </label>
            <input
              type="number"
              value={physicalInches}
              onChange={e => setPhysicalInches(e.target.value)}
              min="1"
              max="24"
              step="0.5"
              className="glass-card rounded-xl px-4 py-2.5 text-sm text-foreground bg-transparent border w-32"
            />
            <p className="text-xs text-muted-foreground mt-2">Place a ruler next to your mouse. You will move the mouse exactly this many inches.</p>
          </div>
        </div>

        <div
          ref={areaRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          className={`glass-card rounded-2xl p-8 mb-6 min-h-[250px] flex items-center justify-center cursor-crosshair relative ${
            isCalibrating ? 'border-primary/40' : ''
          }`}
        >
          {startPos && endPos && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <line
                x1={startPos.x - (areaRef.current?.getBoundingClientRect().left ?? 0)}
                y1={startPos.y - (areaRef.current?.getBoundingClientRect().top ?? 0)}
                x2={endPos.x - (areaRef.current?.getBoundingClientRect().left ?? 0)}
                y2={endPos.y - (areaRef.current?.getBoundingClientRect().top ?? 0)}
                stroke="#00D4FF"
                strokeWidth="2"
                strokeDasharray="5,5"
              />
            </svg>
          )}
          <div className="text-center">
            {!isCalibrating ? (
              <>
                <div className="text-4xl mb-3">🖱️</div>
                <p className="text-muted-foreground text-sm">Click Start Calibration, then drag your mouse exactly {physicalInches} inches</p>
              </>
            ) : (
              <>
                <p className="text-primary font-semibold mb-2">Click and drag {physicalInches} inches</p>
                <p className="font-mono text-sm text-muted-foreground">Pixels moved: {pixelDistance}</p>
              </>
            )}
          </div>
        </div>

        <div className="flex justify-center gap-3 mb-8">
          <button
            onClick={() => { setIsCalibrating(true); setDpi(null); setStartPos(null); setEndPos(null); }}
            className="inline-flex items-center gap-2 bg-primary text-black font-bold rounded-full px-8 py-3.5 hover:opacity-90 active:scale-95 transition-all glow-cyan"
          >
            Start Calibration
          </button>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4">Common DPI Settings</h3>
          <div className="space-y-2">
            {[
              { range: '400–800 DPI', use: 'FPS games, precision aiming', color: 'text-amber-400' },
              { range: '800–1600 DPI', use: 'General gaming, balanced', color: 'text-emerald-400' },
              { range: '1600–3200 DPI', use: 'Fast-paced games, large monitors', color: 'text-primary' },
              { range: '3200+ DPI', use: 'High-res displays, creative work', color: 'text-violet-400' },
            ].map(r => (
              <div key={r.range} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <span className={`font-mono text-sm font-bold ${r.color}`}>{r.range}</span>
                <span className="text-xs text-muted-foreground">{r.use}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
