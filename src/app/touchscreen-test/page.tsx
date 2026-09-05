'use client';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import Link from 'next/link';

interface TouchPoint {
  id: number;
  x: number;
  y: number;
  color: string;
}

const COLORS = ['#00D4FF', '#f43f5e', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1'];

export default function TouchscreenTestPage() {
  const [touchPoints, setTouchPoints] = useState<TouchPoint[]>([]);
  const [maxTouches, setMaxTouches] = useState(0);
  const [totalTouches, setTotalTouches] = useState(0);
  const [gestures, setGestures] = useState<string[]>([]);
  const [isSupported, setIsSupported] = useState<boolean | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pathsRef = useRef<Map<number, { x: number; y: number; color: string }[]>>(new Map());

  useEffect(() => {
    setIsSupported('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pathsRef.current.forEach((points, id) => {
      if (points.length < 2) return;
      ctx.beginPath();
      ctx.strokeStyle = points[0].color;
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.moveTo(points[0].x, points[0].y);
      points.forEach(p => ctx.lineTo(p.x, p.y));
      ctx.stroke();
    });
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    const touches = Array.from(e.changedTouches);
    setTotalTouches(prev => prev + touches.length);
    setMaxTouches(prev => Math.max(prev, e.touches.length));
    const newPoints: TouchPoint[] = Array.from(e.touches).map(t => ({
      id: t.identifier,
      x: t.clientX,
      y: t.clientY,
      color: COLORS[t.identifier % COLORS.length],
    }));
    setTouchPoints(newPoints);
    touches.forEach(t => {
      pathsRef.current.set(t.identifier, [{ x: t.clientX, y: t.clientY, color: COLORS[t.identifier % COLORS.length] }]);
    });
    if (e.touches.length === 2) setGestures(prev => ['Pinch/Zoom gesture detected', ...prev.slice(0, 4)]);
    if (e.touches.length === 3) setGestures(prev => ['3-finger gesture detected', ...prev.slice(0, 4)]);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    const newPoints: TouchPoint[] = Array.from(e.touches).map(t => ({
      id: t.identifier,
      x: t.clientX,
      y: t.clientY,
      color: COLORS[t.identifier % COLORS.length],
    }));
    setTouchPoints(newPoints);
    Array.from(e.changedTouches).forEach(t => {
      const path = pathsRef.current.get(t.identifier) ?? [];
      path.push({ x: t.clientX, y: t.clientY, color: COLORS[t.identifier % COLORS.length] });
      pathsRef.current.set(t.identifier, path);
    });
    drawCanvas();
  }, [drawCanvas]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    const newPoints: TouchPoint[] = Array.from(e.touches).map(t => ({
      id: t.identifier,
      x: t.clientX,
      y: t.clientY,
      color: COLORS[t.identifier % COLORS.length],
    }));
    setTouchPoints(newPoints);
  }, []);

  const clearCanvas = () => {
    pathsRef.current.clear();
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
    }
    setTouchPoints([]);
    setTotalTouches(0);
    setMaxTouches(0);
    setGestures([]);
  };

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="max-w-4xl mx-auto px-6 lg:px-8 pt-28 pb-20">
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Link href="/" className="text-xs text-muted-foreground hover:text-primary transition-colors">Home</Link>
            <span className="text-muted-foreground/40">/</span>
            <span className="text-xs text-primary">Touchscreen Test</span>
          </div>
          <span className="inline-flex items-center gap-2 glass-card rounded-full px-3 py-1.5 text-xs font-semibold text-emerald-400 uppercase tracking-widest mb-4">Display</span>
          <h1 className="text-section-title font-bold text-foreground mb-3">
            Touchscreen <span className="text-primary">Test</span>
          </h1>
          <p className="text-muted-foreground text-base leading-relaxed max-w-xl">
            Test multi-touch support, touch points, and gesture detection on your touchscreen device.
          </p>
        </div>

        {isSupported === false && (
          <div className="glass-card rounded-2xl p-6 mb-8 border-amber-500/30">
            <p className="text-amber-400 text-sm">⚠️ No touchscreen detected. This test requires a touch-enabled device.</p>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="glass-card rounded-2xl p-4 text-center">
            <div className="font-mono text-2xl font-bold text-primary mb-1">{touchPoints.length}</div>
            <div className="text-xs text-muted-foreground">Active Touches</div>
          </div>
          <div className="glass-card rounded-2xl p-4 text-center">
            <div className="font-mono text-2xl font-bold text-violet-400 mb-1">{maxTouches}</div>
            <div className="text-xs text-muted-foreground">Max Touches</div>
          </div>
          <div className="glass-card rounded-2xl p-4 text-center">
            <div className="font-mono text-2xl font-bold text-emerald-400 mb-1">{totalTouches}</div>
            <div className="text-xs text-muted-foreground">Total Taps</div>
          </div>
          <div className="glass-card rounded-2xl p-4 text-center">
            <div className="font-mono text-2xl font-bold text-amber-400 mb-1">{navigator.maxTouchPoints ?? 0}</div>
            <div className="text-xs text-muted-foreground">Max Supported</div>
          </div>
        </div>

        {/* Touch Canvas */}
        <div className="relative glass-card rounded-2xl overflow-hidden mb-6" style={{ height: '350px' }}>
          <canvas
            ref={canvasRef}
            width={800}
            height={350}
            className="absolute inset-0 w-full h-full"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{ touchAction: 'none' }}
          />
          {touchPoints.map(tp => (
            <div
              key={tp.id}
              className="absolute w-12 h-12 rounded-full border-2 flex items-center justify-center text-xs font-mono font-bold pointer-events-none -translate-x-1/2 -translate-y-1/2"
              style={{
                left: tp.x,
                top: tp.y - 64,
                borderColor: tp.color,
                color: tp.color,
                background: `${tp.color}20`,
              }}
            >
              {tp.id}
            </div>
          ))}
          {touchPoints.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <div className="text-4xl mb-2">👆</div>
                <p className="text-muted-foreground text-sm">Touch here to test</p>
                <p className="text-xs text-muted-foreground/60 mt-1">Draw with multiple fingers</p>
              </div>
            </div>
          )}
        </div>

        {/* Gestures */}
        {gestures.length > 0 && (
          <div className="glass-card rounded-2xl p-4 mb-6">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2">Detected Gestures</h3>
            {gestures.map((g, i) => (
              <div key={i} className="text-sm text-emerald-400 py-1">✓ {g}</div>
            ))}
          </div>
        )}

        <div className="flex justify-center mb-8">
          <button onClick={clearCanvas} className="inline-flex items-center gap-2 glass-card rounded-full px-6 py-3 text-sm font-semibold text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all">
            Clear Canvas
          </button>
        </div>
      </div>
      <Footer />
    </main>
  );
}
