'use client';
import React, { useState, useRef, useEffect } from 'react';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import Link from 'next/link';

export default function WebcamTestPage() {
  const [status, setStatus] = useState<'idle' | 'requesting' | 'active' | 'error'>('idle');
  const [error, setError] = useState<string>('');
  const [resolution, setResolution] = useState<{ w: number; h: number } | null>(null);
  const [fps, setFps] = useState<number>(0);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string>('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fpsCountRef = useRef(0);
  const lastFpsTime = useRef(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    navigator.mediaDevices?.enumerateDevices().then(devs => {
      const cams = devs.filter(d => d.kind === 'videoinput');
      setDevices(cams);
      if (cams.length > 0) setSelectedDevice(cams[0].deviceId);
    }).catch(() => {});
    return () => stopCamera();
  }, []);

  const stopCamera = () => {
    cancelAnimationFrame(rafRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;
    setStatus('idle');
    setFps(0);
    setResolution(null);
  };

  const startCamera = async () => {
    setStatus('requesting');
    setError('');
    try {
      const constraints: MediaStreamConstraints = {
        video: selectedDevice ? { deviceId: { exact: selectedDevice }, width: { ideal: 1920 }, height: { ideal: 1080 } } : { width: { ideal: 1920 }, height: { ideal: 1080 } },
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          setResolution({ w: videoRef.current!.videoWidth, h: videoRef.current!.videoHeight });
        };
      }
      setStatus('active');

      // FPS counter
      const countFps = () => {
        fpsCountRef.current += 1;
        const now = performance.now();
        if (now - lastFpsTime.current >= 1000) {
          setFps(fpsCountRef.current);
          fpsCountRef.current = 0;
          lastFpsTime.current = now;
        }
        rafRef.current = requestAnimationFrame(countFps);
      };
      lastFpsTime.current = performance.now();
      rafRef.current = requestAnimationFrame(countFps);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Camera access denied');
      setStatus('error');
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="max-w-3xl mx-auto px-6 lg:px-8 pt-28 pb-20">
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Link href="/" className="text-xs text-muted-foreground hover:text-primary transition-colors">Home</Link>
            <span className="text-muted-foreground/40">/</span>
            <span className="text-xs text-primary">Webcam Test</span>
          </div>
          <span className="inline-flex items-center gap-2 glass-card rounded-full px-3 py-1.5 text-xs font-semibold text-sky-400 uppercase tracking-widest mb-4">Audio & Video</span>
          <h1 className="text-section-title font-bold text-foreground mb-3">
            Webcam <span className="text-primary">Test</span>
          </h1>
          <p className="text-muted-foreground text-base leading-relaxed max-w-xl">
            Test your webcam resolution, FPS, and preview the camera feed directly in your browser.
          </p>
        </div>

        {/* Device Selector */}
        {devices.length > 1 && (
          <div className="mb-6">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2 block">Camera Device</label>
            <select
              value={selectedDevice}
              onChange={e => setSelectedDevice(e.target.value)}
              className="glass-card rounded-xl px-4 py-2.5 text-sm text-foreground bg-transparent border w-full max-w-sm"
            >
              {devices.map(d => (
                <option key={d.deviceId} value={d.deviceId} style={{ background: '#111118' }}>{d.label || `Camera ${d.deviceId.slice(0, 8)}`}</option>
              ))}
            </select>
          </div>
        )}

        {/* Video Preview */}
        <div className="glass-card rounded-2xl overflow-hidden mb-6 aspect-video relative">
          {status !== 'active' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-5xl mb-4">📷</div>
              {status === 'error' ? (
                <p className="text-rose-400 text-sm text-center px-4">{error}</p>
              ) : (
                <p className="text-muted-foreground text-sm">Camera preview will appear here</p>
              )}
            </div>
          )}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`w-full h-full object-cover ${status === 'active' ? 'opacity-100' : 'opacity-0'}`}
          />
          {status === 'active' && (
            <div className="absolute top-3 right-3 flex gap-2">
              <span className="glass-card rounded-full px-3 py-1 text-xs font-mono text-primary">{fps} FPS</span>
              {resolution && <span className="glass-card rounded-full px-3 py-1 text-xs font-mono text-emerald-400">{resolution.w}x{resolution.h}</span>}
            </div>
          )}
        </div>

        {/* Stats */}
        {status === 'active' && (
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="glass-card rounded-2xl p-4 text-center">
              <div className="font-mono text-xl font-bold text-primary mb-1">{fps}</div>
              <div className="text-xs text-muted-foreground">FPS</div>
            </div>
            <div className="glass-card rounded-2xl p-4 text-center">
              <div className="font-mono text-xl font-bold text-emerald-400 mb-1">{resolution?.w ?? '—'}</div>
              <div className="text-xs text-muted-foreground">Width (px)</div>
            </div>
            <div className="glass-card rounded-2xl p-4 text-center">
              <div className="font-mono text-xl font-bold text-amber-400 mb-1">{resolution?.h ?? '—'}</div>
              <div className="text-xs text-muted-foreground">Height (px)</div>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="flex justify-center gap-3 mb-8">
          {status !== 'active' ? (
            <button
              onClick={startCamera}
              disabled={status === 'requesting'}
              className="inline-flex items-center gap-2 bg-primary text-black font-bold rounded-full px-8 py-3.5 hover:opacity-90 active:scale-95 transition-all glow-cyan disabled:opacity-50"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 3l14 9-14 9V3z" />
              </svg>
              {status === 'requesting' ? 'Requesting...' : 'Start Camera'}
            </button>
          ) : (
            <button
              onClick={stopCamera}
              className="inline-flex items-center gap-2 glass-card rounded-full px-8 py-3.5 text-sm font-semibold text-rose-400 border-rose-500/30 hover:border-rose-400/50 transition-all"
            >
              Stop Camera
            </button>
          )}
        </div>

        <div className="glass-card rounded-2xl p-6">
          <h2 className="text-lg font-bold text-foreground mb-3">Privacy Notice</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">Your camera feed is processed entirely in your browser. No video data is transmitted to any server. The stream is only visible to you and stops when you close this page.</p>
        </div>
      </div>
      <Footer />
    </main>
  );
}
