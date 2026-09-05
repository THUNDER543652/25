'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import { jsPDF } from 'jspdf';

type Status = 'pending' | 'running' | 'passed' | 'warning' | 'failed' | 'skipped';
type DeviceKind = 'laptop' | 'mobile';

type Result = {
  id: string;
  title: string;
  category: string;
  status: Status;
  details: Record<string, string>;
  startedAt?: string;
  durationMs?: number;
};

type Step = {
  id: string;
  title: string;
  category: string;
  description: string;
  devices: DeviceKind[];
};

const LAPTOP_STEPS: Step[] = [
  { id: 'device', title: 'Device Overview', category: 'Device', description: 'Identify the computer, browser, display and input capabilities.', devices: ['laptop'] },
  { id: 'browser', title: 'Browser Test', category: 'Browser', description: 'Check browser APIs and capabilities used by modern web applications.', devices: ['laptop'] },
  { id: 'keyboard', title: 'Keyboard Test', category: 'Keyboard', description: 'Press physical keys and record exactly which keys are detected.', devices: ['laptop'] },
  { id: 'spacebar', title: 'Spacebar Test', category: 'Keyboard', description: 'Press the physical spacebar and record every detected press.', devices: ['laptop'] },
  { id: 'mouse', title: 'Mouse Test', category: 'Mouse', description: 'Check pointer movement, buttons and scroll wheel.', devices: ['laptop'] },
  { id: 'cps', title: 'CPS Test', category: 'Mouse', description: 'Measure clicks per second over a five-second window.', devices: ['laptop'] },
  { id: 'accuracy', title: 'Mouse Accuracy', category: 'Mouse', description: 'Hit moving targets and record hits and misses.', devices: ['laptop'] },
  { id: 'dpi', title: 'DPI Estimator', category: 'Mouse', description: 'Record pointer travel; browser APIs cannot directly read hardware DPI.', devices: ['laptop'] },
  { id: 'polling', title: 'Polling Rate', category: 'Mouse', description: 'Measure observed pointer-event frequency in the browser.', devices: ['laptop'] },
  { id: 'internet', title: 'Internet Speed Test', category: 'Network', description: 'Measure ping, jitter, download and upload speed.', devices: ['laptop'] },
  { id: 'latency', title: 'Latency Test', category: 'Network', description: 'Measure repeated request round-trip latency.', devices: ['laptop'] },
  { id: 'dead-pixel', title: 'Dead Pixel Test', category: 'Display', description: 'Use the original-style full-screen color sweep to inspect every pixel.', devices: ['laptop'] },
  { id: 'reaction', title: 'Reaction Time Test', category: 'Display', description: 'Measure visual reaction time over five rounds.', devices: ['laptop'] },
  { id: 'speaker', title: 'Speaker Test', category: 'Audio', description: 'Play a browser-generated test tone and record the playback result.', devices: ['laptop'] },
  { id: 'microphone', title: 'Microphone Test', category: 'Audio', description: 'Measure microphone input level from the browser.', devices: ['laptop'] },
  { id: 'camera', title: 'Camera Test', category: 'Camera', description: 'Test every camera the browser exposes, one at a time.', devices: ['laptop'] },
];

const MOBILE_STEPS: Step[] = [
  { id: 'device', title: 'Device Overview', category: 'Device', description: 'Identify the phone/tablet, browser, display and touch capabilities.', devices: ['mobile'] },
  { id: 'browser', title: 'Browser Test', category: 'Browser', description: 'Check browser APIs and capabilities used by modern web applications.', devices: ['mobile'] },
  { id: 'internet', title: 'Internet Speed Test', category: 'Network', description: 'Measure ping, jitter, download and upload speed.', devices: ['mobile'] },
  { id: 'latency', title: 'Latency Test', category: 'Network', description: 'Measure repeated request round-trip latency.', devices: ['mobile'] },
  { id: 'dead-pixel', title: 'Dead Pixel Test', category: 'Display', description: 'Use true browser fullscreen for a full-panel color inspection.', devices: ['mobile'] },
  { id: 'reaction', title: 'Reaction Time Test', category: 'Display', description: 'Measure visual reaction time over five rounds.', devices: ['mobile'] },
  { id: 'speaker', title: 'Speaker Test', category: 'Audio', description: 'Play a browser-generated test tone and record the playback result.', devices: ['mobile'] },
  { id: 'microphone', title: 'Microphone Test', category: 'Audio', description: 'Measure microphone input level from the browser.', devices: ['mobile'] },
  { id: 'camera', title: 'Camera Test', category: 'Camera', description: 'Test every camera the browser exposes, including front and rear cameras when available.', devices: ['mobile'] },
  { id: 'touch', title: 'Touchscreen Test', category: 'Touch', description: 'Measure touch points, simultaneous touches and multi-touch events.', devices: ['mobile'] },
];


const makeResults = (steps: Step[]) => steps.map(s => ({ id: s.id, title: s.title, category: s.category, status: 'pending' as Status, details: {} }));

const fmt = (value: number, digits = 2) => Number.isFinite(value) ? value.toFixed(digits) : '—';
const statusLabel = (s: Status) => s.charAt(0).toUpperCase() + s.slice(1);

export default function DeviceTestSeriesPage() {
  const [mode, setMode] = useState<DeviceKind | null>(null);
  const steps = mode === 'mobile' ? MOBILE_STEPS : LAPTOP_STEPS;
  const [index, setIndex] = useState(0);
  const [results, setResults] = useState<Result[]>([]);
  const [started, setStarted] = useState(false);
  const [running, setRunning] = useState(false);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [deviceInfo, setDeviceInfo] = useState<Record<string, string>>({});

  const [keys, setKeys] = useState<string[]>([]);
  const [mouse, setMouse] = useState({ moves: 0, clicks: 0, wheel: 0, buttons: [] as number[] });
  const [cps, setCps] = useState(0);
  const [accuracy, setAccuracy] = useState({ hits: 0, misses: 0, target: { x: 50, y: 50 } });
  const [pointerDistance, setPointerDistance] = useState(0);
  const [pollingIntervals, setPollingIntervals] = useState<number[]>([]);
  const [typing, setTyping] = useState({ text: '', chars: 0, correct: 0, elapsed: 0 });
  const [spaceCount, setSpaceCount] = useState(0);
  const [internet, setInternet] = useState<Record<string, string>>({});
  const [internetProgress, setInternetProgress] = useState({ phase: 'Preparing test…', percent: 0 });
  const [latency, setLatency] = useState<number[]>([]);
  const [mic, setMic] = useState({ level: 0, sampleRate: 0, channels: 0 });
  const [cameraDevices, setCameraDevices] = useState<MediaDeviceInfo[]>([]);
  const [cameraIndex, setCameraIndex] = useState(0);
  const [cameraResults, setCameraResults] = useState<Record<string, string>[]>([]);
  const [touch, setTouch] = useState({ total: 0, max: 0, multi: 0, gestures: 0 });
  const [reactionRound, setReactionRound] = useState(0);
  const [reactionResults, setReactionResults] = useState<number[]>([]);
  const [reactionReadyAt, setReactionReadyAt] = useState<number | null>(null);
  const [reactionTimer, setReactionTimer] = useState<ReturnType<typeof setTimeout> | null>(null);
  const [deadPixelActive, setDeadPixelActive] = useState(false);
  const [deadPixelIndex, setDeadPixelIndex] = useState(0);
  const [deadPixelCompleted, setDeadPixelCompleted] = useState(false);
  const [speakerPlayed, setSpeakerPlayed] = useState(false);
  const [speakerChannel, setSpeakerChannel] = useState<'left' | 'right' | 'both'>('both');

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const micAudioRef = useRef<AudioContext | null>(null);
  const micAnalyserRef = useRef<AnalyserNode | null>(null);
  const micFrameRef = useRef<number | null>(null);
  const cpsStartRef = useRef<number | null>(null);
  const typingStartRef = useRef<number | null>(null);
  const pointerLastRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const autoNextTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cameraAutoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const speakerCtxRef = useRef<AudioContext | null>(null);
  const speakerOscRef = useRef<OscillatorNode | null>(null);
  const speakerTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const step = steps[index];
  const currentResult = results[index];
  const finished = started && results.length > 0 && results.every(r => r.status !== 'pending' && r.status !== 'running');
  const completedCount = results.filter(r => r.status !== 'pending' && r.status !== 'running').length;

  const cleanupMedia = useCallback(() => {
    if (speakerTimeoutRef.current) clearTimeout(speakerTimeoutRef.current);
    speakerTimeoutRef.current = null;
    try { speakerOscRef.current?.stop(); } catch {}
    speakerOscRef.current = null;
    void speakerCtxRef.current?.close().catch(() => undefined);
    speakerCtxRef.current = null;
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    micStreamRef.current?.getTracks().forEach(t => t.stop());
    micStreamRef.current = null;
    if (micFrameRef.current) cancelAnimationFrame(micFrameRef.current);
    micFrameRef.current = null;
    void micAudioRef.current?.close();
    micAudioRef.current = null;
    micAnalyserRef.current = null;
  }, []);

  useEffect(() => () => {
    cleanupMedia();
    if (reactionTimer) clearTimeout(reactionTimer);
    if (autoNextTimerRef.current) clearTimeout(autoNextTimerRef.current);
    autoNextTimerRef.current = null;
    if (cameraAutoTimerRef.current) clearTimeout(cameraAutoTimerRef.current);
    cameraAutoTimerRef.current = null;
    if (document.fullscreenElement) void document.exitFullscreen().catch(() => undefined);
  }, [cleanupMedia, reactionTimer]);

  useEffect(() => {
    if (!started || !mode) return;
    const onKey = (event: KeyboardEvent) => {
      if (step?.id === 'keyboard' && running) {
        event.preventDefault();
        setKeys(prev => prev.includes(event.code) ? prev : [...prev, event.code]);
      }
      if (step?.id === 'spacebar' && running && event.code === 'Space') {
        event.preventDefault();
        setSpaceCount(v => v + 1);
      }
    };
    const onPointer = (event: PointerEvent) => {
      if (!running) return;
      if (step?.id === 'mouse') {
        setMouse(prev => ({ ...prev, moves: prev.moves + 1, clicks: prev.clicks + (event.type === 'pointerdown' ? 1 : 0), buttons: event.type === 'pointerdown' && !prev.buttons.includes(event.button) ? [...prev.buttons, event.button] : prev.buttons }));
      }
      if (step?.id === 'dpi') {
        const last = pointerLastRef.current;
        if (last) setPointerDistance(v => v + Math.hypot(event.clientX - last.x, event.clientY - last.y));
        pointerLastRef.current = { x: event.clientX, y: event.clientY, time: performance.now() };
      }
      if (step?.id === 'polling') {
        const now = performance.now();
        if (pointerLastRef.current) setPollingIntervals(v => [...v.slice(-199), now - pointerLastRef.current!.time]);
        pointerLastRef.current = { x: event.clientX, y: event.clientY, time: now };
      }
      if (step?.id === 'cps' && event.type === 'pointerdown' && (event.target as HTMLElement)?.closest('[data-cps-zone]')) {
        const now = performance.now();
        if (!cpsStartRef.current) cpsStartRef.current = now;
        setCps(v => v + 1);
      }
    };
    const onWheel = () => { if (running && step?.id === 'mouse') setMouse(prev => ({ ...prev, wheel: prev.wheel + 1 })); };
    const onTouch = (event: TouchEvent) => {
      if (!running || step?.id !== 'touch') return;
      setTouch(prev => ({ total: prev.total + event.changedTouches.length, max: Math.max(prev.max, event.touches.length), multi: prev.multi + (event.touches.length > 1 ? 1 : 0), gestures: prev.gestures + 1 }));
    };
    window.addEventListener('keydown', onKey, { passive: false });
    window.addEventListener('pointermove', onPointer);
    window.addEventListener('pointerdown', onPointer);
    window.addEventListener('wheel', onWheel, { passive: true });
    window.addEventListener('touchstart', onTouch, { passive: true });
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('pointermove', onPointer);
      window.removeEventListener('pointerdown', onPointer);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouch);
    };
  }, [started, mode, step?.id, running]);

  const detectDevice = () => {
    const ua = navigator.userAgent;
    const mobile = /Android|iPhone|iPad|iPod|Mobile/i.test(ua) || (navigator.maxTouchPoints > 1 && /Macintosh/i.test(ua));
    const browser = /Edg\//.test(ua) ? 'Microsoft Edge' : /Chrome\//.test(ua) ? 'Google Chrome' : /Firefox\//.test(ua) ? 'Mozilla Firefox' : /Safari\//.test(ua) ? 'Safari' : 'Other';
    const os = /Windows/i.test(ua) ? 'Windows' : /Mac OS/i.test(ua) ? 'macOS' : /Android/i.test(ua) ? 'Android' : /iPhone|iPad|iPod/i.test(ua) ? 'iOS / iPadOS' : /Linux/i.test(ua) ? 'Linux' : 'Other';
    const nav = navigator as Navigator & { deviceMemory?: number; hardwareConcurrency?: number; connection?: { effectiveType?: string; downlink?: number; rtt?: number } };
    return {
      'Device type': mobile ? 'Mobile / Tablet' : 'Laptop / Desktop',
      'Operating system': os,
      'Browser': browser,
      'Browser version': navigator.userAgent.match(/(?:Chrome|Firefox|Version|Edg)\/?([\d.]+)/)?.[1] ?? 'Unknown',
      'Viewport': `${window.innerWidth} × ${window.innerHeight}px`,
      'Screen': `${window.screen.width} × ${window.screen.height}px`,
      'Device pixel ratio': String(window.devicePixelRatio || 1),
      'Touch points': String(navigator.maxTouchPoints),
      'Touch capable': navigator.maxTouchPoints > 0 || 'ontouchstart' in window ? 'Yes' : 'No',
      'CPU threads': String(nav.hardwareConcurrency ?? 'Unavailable'),
      'Device memory': nav.deviceMemory ? `${nav.deviceMemory} GB (browser-reported)` : 'Unavailable',
      'Connection type': nav.connection?.effectiveType ?? 'Unavailable',
    };
  };

  const resetInteractive = () => {
    cleanupMedia();
    setKeys([]); setMouse({ moves: 0, clicks: 0, wheel: 0, buttons: [] }); setCps(0); cpsStartRef.current = null;
    setAccuracy({ hits: 0, misses: 0, target: { x: 50, y: 50 } }); setPointerDistance(0); setPollingIntervals([]); pointerLastRef.current = null;
    setTyping({ text: '', chars: 0, correct: 0, elapsed: 0 }); typingStartRef.current = null; setSpaceCount(0);
    setInternet({}); setInternetProgress({ phase: 'Preparing test…', percent: 0 }); setLatency([]); setMic({ level: 0, sampleRate: 0, channels: 0 }); setCameraDevices([]); setCameraIndex(0); setCameraResults([]);
    setTouch({ total: 0, max: 0, multi: 0, gestures: 0 }); setReactionRound(0); setReactionResults([]); setReactionReadyAt(null); setDeadPixelActive(false); setDeadPixelIndex(0); setDeadPixelCompleted(false); setSpeakerPlayed(false); setSpeakerChannel('both');
  };

  const startSeries = (kind: DeviceKind) => {
    if (autoNextTimerRef.current) clearTimeout(autoNextTimerRef.current);
    autoNextTimerRef.current = null;
    if (cameraAutoTimerRef.current) clearTimeout(cameraAutoTimerRef.current);
    cameraAutoTimerRef.current = null;
    setMode(kind);
    setIndex(0);
    setResults(makeResults(kind === 'mobile' ? MOBILE_STEPS : LAPTOP_STEPS));
    setDeviceInfo(detectDevice());
    setStarted(true);
    setRunning(false);
    resetInteractive();
  };

  const mark = useCallback((status: Status, details: Record<string, string>) => {
    setResults(prev => prev.map((r, i) => i === index ? { ...r, status, details, startedAt: startedAt ? new Date(startedAt).toLocaleString() : undefined, durationMs: startedAt ? Date.now() - startedAt : undefined } : r));
    setRunning(false);

    // The series advances automatically after every completed/skipped test.
    // A short pause lets the user see the saved result before the next test begins.
    if (status !== 'pending' && status !== 'running' && index < steps.length - 1) {
      if (autoNextTimerRef.current) clearTimeout(autoNextTimerRef.current);
      autoNextTimerRef.current = setTimeout(() => {
        autoNextTimerRef.current = null;
        cleanupMedia();
        setIndex(i => i + 1);
        setRunning(false);
        setStartedAt(null);
        resetInteractive();
      }, 1200);
    }
  }, [cleanupMedia, index, startedAt, steps.length]);

  const goToNextTestNow = () => {
    if (autoNextTimerRef.current) clearTimeout(autoNextTimerRef.current);
    autoNextTimerRef.current = null;
    if (index >= steps.length - 1) return;
    cleanupMedia();
    setIndex(i => i + 1);
    setRunning(false);
    setStartedAt(null);
    resetInteractive();
  };

  const startReaction = () => {
    setReactionRound(1);
    setReactionResults([]);
    setReactionReadyAt(null);
    const wait = 900 + Math.random() * 2200;
    const timer = setTimeout(() => setReactionReadyAt(performance.now()), wait);
    setReactionTimer(timer);
  };

  const reactionClick = () => {
    if (!reactionReadyAt) return;
    const value = performance.now() - reactionReadyAt;
    const next = [...reactionResults, value];
    if (next.length >= 5) {
      setReactionResults(next);
      mark('passed', { 'Rounds': '5', 'Times': next.map(v => `${Math.round(v)} ms`).join(', '), 'Average': `${Math.round(next.reduce((a,b)=>a+b,0)/next.length)} ms`, 'Best': `${Math.round(Math.min(...next))} ms`, 'Worst': `${Math.round(Math.max(...next))} ms` });
      return;
    }
    setReactionResults(next); setReactionRound(next.length + 1); setReactionReadyAt(null);
    const timer = setTimeout(() => setReactionReadyAt(performance.now()), 900 + Math.random() * 2200);
    setReactionTimer(timer);
  };

  const startDeadPixel = async () => {
    setDeadPixelIndex(0); setDeadPixelCompleted(false); setDeadPixelActive(true); setRunning(true);
    try { await document.documentElement.requestFullscreen?.(); } catch {}
  };

  const exitDeadPixel = async (completed = false) => {
    setDeadPixelActive(false);
    setDeadPixelCompleted(completed);
    if (document.fullscreenElement) { try { await document.exitFullscreen(); } catch {} }
    if (completed) mark('passed', { 'Mode': 'True browser fullscreen', 'Patterns checked': 'Black, White, Red, Green, Blue, Gray, Gradient', 'User inspection': 'Completed' });
    else mark('skipped', { 'Mode': 'True browser fullscreen', 'Patterns reached': String(deadPixelIndex + 1), 'Result': 'User exited before completing the sweep' });
  };

  const startMic = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;
      const track = stream.getAudioTracks()[0];
      const settings = track.getSettings();
      const ctx = new AudioContext();
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser(); analyser.fftSize = 2048;
      source.connect(analyser); micAudioRef.current = ctx; micAnalyserRef.current = analyser;
      setMic({ level: 0, sampleRate: ctx.sampleRate, channels: settings.channelCount ?? 1 });
      const data = new Uint8Array(analyser.fftSize);
      const loop = () => {
        analyser.getByteTimeDomainData(data);
        let sum = 0; for (const x of data) { const n = (x - 128) / 128; sum += n * n; }
        const level = Math.min(100, Math.round(Math.sqrt(sum / data.length) * 100 * 2));
        setMic(v => ({ ...v, level }));
        micFrameRef.current = requestAnimationFrame(loop);
      };
      loop();
    } catch {
      mark('failed', { 'Permission': 'Denied or unavailable', 'Input level': 'Unavailable' });
    }
  };

  const confirmMic = () => mark(mic.level > 0 ? 'passed' : 'warning', { 'Input level observed': `${mic.level}%`, 'Sample rate': mic.sampleRate ? `${mic.sampleRate} Hz` : 'Unavailable', 'Channels': mic.channels ? String(mic.channels) : 'Unavailable', 'Permission': 'Granted' });

  const playSpeaker = async (channel: 'left' | 'right' | 'both' = speakerChannel) => {
    try {
      setSpeakerChannel(channel);
      setSpeakerPlayed(false);
      if (speakerTimeoutRef.current) clearTimeout(speakerTimeoutRef.current);
      speakerTimeoutRef.current = null;
      try { speakerOscRef.current?.stop(); } catch {}
      speakerOscRef.current = null;
      await speakerCtxRef.current?.close().catch(() => undefined);
      speakerCtxRef.current = null;

      const AudioCtx = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) throw new Error('Web Audio is unavailable');
      const ctx = new AudioCtx();
      await ctx.resume();

      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      const panner = typeof ctx.createStereoPanner === 'function' ? ctx.createStereoPanner() : null;
      const merger = panner ? null : ctx.createChannelMerger(2);
      oscillator.type = 'sine';
      // A clear 1 kHz test tone is easier to hear while remaining comfortable.
      oscillator.frequency.value = 1000;
      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.05);
      oscillator.connect(gain);

      if (panner) {
        panner.pan.setValueAtTime(channel === 'left' ? -1 : channel === 'right' ? 1 : 0, ctx.currentTime);
        gain.connect(panner);
        panner.connect(ctx.destination);
      } else if (merger) {
        if (channel === 'left') gain.connect(merger, 0, 0);
        else if (channel === 'right') gain.connect(merger, 0, 1);
        else {
          gain.connect(merger, 0, 0);
          gain.connect(merger, 0, 1);
        }
        merger.connect(ctx.destination);
      }

      oscillator.start();
      speakerCtxRef.current = ctx;
      speakerOscRef.current = oscillator;
      setSpeakerPlayed(true);
      speakerTimeoutRef.current = setTimeout(() => {
        try { oscillator.stop(); } catch {}
        speakerOscRef.current = null;
        void ctx.close().catch(() => undefined);
        speakerCtxRef.current = null;
        speakerTimeoutRef.current = null;
      }, 1150);
    } catch {
      setSpeakerPlayed(false);
    }
  };

  const confirmSpeaker = () => mark(speakerPlayed ? 'passed' : 'warning', {
    'Tone': '1000 Hz',
    'Channel': speakerChannel === 'both' ? 'Left + Right' : speakerChannel === 'left' ? 'Left' : 'Right',
    'Duration': '1 second',
    'Browser playback': speakerPlayed ? 'Started successfully' : 'Unavailable',
    'User confirmation': 'User confirmed the selected speaker channel was audible.'
  });

  const startCamera = async (device?: MediaDeviceInfo, targetIndex = cameraIndex) => {
    try {
      streamRef.current?.getTracks().forEach(t => t.stop());
      const constraints: MediaStreamConstraints = { video: device?.deviceId ? { deviceId: { exact: device.deviceId }, width: { ideal: 1920 }, height: { ideal: 1080 } } : { width: { ideal: 1920 }, height: { ideal: 1080 } } };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      if (videoRef.current) { videoRef.current.srcObject = stream; await videoRef.current.play().catch(() => undefined); }
      const track = stream.getVideoTracks()[0]; const settings = track.getSettings();
      setCameraResults(prev => {
        const next = [...prev]; next[targetIndex] = { 'Camera': device?.label || `Camera ${targetIndex + 1}`, 'Facing mode': settings.facingMode || 'Browser did not expose', 'Resolution': `${settings.width ?? videoRef.current?.videoWidth ?? '—'} × ${settings.height ?? videoRef.current?.videoHeight ?? '—'} px`, 'Frame rate': settings.frameRate ? `${fmt(settings.frameRate, 1)} FPS` : 'Unavailable', 'Permission': 'Granted' }; return next;
      });
    } catch {
      setCameraResults(prev => { const next = [...prev]; next[targetIndex] = { 'Camera': device?.label || `Camera ${targetIndex + 1}`, 'Permission': 'Denied or unavailable' }; return next; });
    }
  };

  const discoverCameras = async () => {
    try {
      const temp = await navigator.mediaDevices.getUserMedia({ video: true });
      temp.getTracks().forEach(t => t.stop());
      const devices = (await navigator.mediaDevices.enumerateDevices()).filter(d => d.kind === 'videoinput');
      setCameraDevices(devices); setCameraIndex(0); setCameraResults([]);
      if (devices[0]) await startCamera(devices[0], 0);
      else mark('warning', { 'Cameras found': '0', 'Result': 'No camera exposed by the browser' });
    } catch {
      mark('failed', { 'Camera access': 'Denied or unavailable' });
    }
  };

  const nextCamera = async () => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    const nextIndex = cameraIndex + 1;
    if (nextIndex < cameraDevices.length) { setCameraIndex(nextIndex); await startCamera(cameraDevices[nextIndex], nextIndex); }
    else {
      const details: Record<string, string> = { 'Cameras detected': String(cameraDevices.length), 'Cameras tested': String(cameraResults.filter(Boolean).length), 'Requirement': 'Every browser-exposed camera tested' };
      cameraResults.forEach((r, i) => { details[`Camera ${i + 1}`] = Object.entries(r || {}).map(([k,v]) => `${k}: ${v}`).join(' · '); });
      cleanupMedia();
      mark(cameraResults.length === cameraDevices.length && cameraDevices.length > 0 ? 'passed' : 'warning', details);
    }
  };

  // Cameras are also advanced automatically, so the user never has to click
  // a separate Next Camera button. Each camera remains visible briefly before
  // the next exposed camera is tested.
  useEffect(() => {
    if (step?.id !== 'camera' || !running || !cameraDevices.length || !cameraResults[cameraIndex]) return;
    if (cameraAutoTimerRef.current) clearTimeout(cameraAutoTimerRef.current);
    if (cameraIndex < cameraDevices.length - 1) {
      cameraAutoTimerRef.current = setTimeout(() => {
        cameraAutoTimerRef.current = null;
        void startCamera(cameraDevices[cameraIndex + 1], cameraIndex + 1);
        setCameraIndex(i => i + 1);
      }, 1800);
    } else {
      cameraAutoTimerRef.current = setTimeout(() => {
        cameraAutoTimerRef.current = null;
        const details: Record<string, string> = {
          'Cameras detected': String(cameraDevices.length),
          'Cameras tested': String(cameraResults.filter(Boolean).length),
          'Requirement': 'Every browser-exposed camera tested'
        };
        cameraResults.forEach((r, i) => { details[`Camera ${i + 1}`] = Object.entries(r || {}).map(([k,v]) => `${k}: ${v}`).join(' · '); });
        cleanupMedia();
        mark(cameraResults.length === cameraDevices.length && cameraDevices.length > 0 ? 'passed' : 'warning', details);
      }, 1800);
    }
    return () => {
      if (cameraAutoTimerRef.current) clearTimeout(cameraAutoTimerRef.current);
      cameraAutoTimerRef.current = null;
    };
  }, [cameraDevices, cameraIndex, cameraResults, running, step?.id, mark]);

  const runLatency = async () => {
    const samples: number[] = [];
    for (let i = 0; i < 5; i++) {
      const start = performance.now();
      try { await fetch('https://www.cloudflare.com/cdn-cgi/trace', { method: 'HEAD', cache: 'no-store' }); } catch {}
      samples.push(performance.now() - start); await new Promise(r => setTimeout(r, 180));
      setLatency([...samples]);
    }
    const avg = samples.reduce((a,b)=>a+b,0)/samples.length;
    mark('passed', { 'Samples': samples.map(v => `${Math.round(v)} ms`).join(', '), 'Average': `${Math.round(avg)} ms`, 'Minimum': `${Math.round(Math.min(...samples))} ms`, 'Maximum': `${Math.round(Math.max(...samples))} ms`, 'Jitter': `${Math.round(Math.max(...samples)-Math.min(...samples))} ms` });
  };

  const runInternet = async () => {
    const pings: number[] = [];
    setInternetProgress({ phase: 'Finding the fastest response…', percent: 8 });
    for (let i = 0; i < 5; i++) {
      const s = performance.now();
      try { await fetch('https://www.cloudflare.com/cdn-cgi/trace', { method: 'HEAD', cache: 'no-store' }); } catch {}
      pings.push(performance.now() - s);
      setInternetProgress({ phase: `Measuring ping… ${i + 1}/5`, percent: 10 + ((i + 1) / 5) * 15 });
      await new Promise(r => setTimeout(r, 120));
    }
    const ping = pings.reduce((a, b) => a + b, 0) / pings.length;
    const jitter = Math.max(...pings) - Math.min(...pings);

    setInternetProgress({ phase: 'Measuring download speed…', percent: 32 });
    const dlStart = performance.now(); let dlBytes = 0;
    for (let i = 0; i < 5; i++) {
      try {
        const res = await fetch(`https://speed.cloudflare.com/__down?bytes=1000000&_=${Date.now()}-${i}`, { cache: 'no-store' });
        const buf = await res.arrayBuffer();
        dlBytes += buf.byteLength;
      } catch {}
      setInternetProgress({ phase: `Testing download… ${i + 1}/5`, percent: 32 + ((i + 1) / 5) * 28 });
    }
    const dlTime = (performance.now() - dlStart) / 1000;
    const download = dlBytes ? dlBytes * 8 / dlTime / 1e6 : 0;

    setInternetProgress({ phase: 'Measuring upload speed…', percent: 64 });
    const ulStart = performance.now(); let ulBytes = 0;
    for (let i = 0; i < 3; i++) {
      const data = new Uint8Array(500000);
      try { await fetch('https://speed.cloudflare.com/__up', { method: 'POST', body: data, cache: 'no-store' }); ulBytes += data.byteLength; } catch {}
      setInternetProgress({ phase: `Testing upload… ${i + 1}/3`, percent: 64 + ((i + 1) / 3) * 26 });
    }
    const ulTime = (performance.now() - ulStart) / 1000;
    const upload = ulBytes ? ulBytes * 8 / ulTime / 1e6 : 0;
    const details = {
      'Download': `${fmt(download)} Mbps`,
      'Upload': `${fmt(upload)} Mbps`,
      'Ping': `${Math.round(ping)} ms`,
      'Jitter': `${Math.round(jitter)} ms`,
      'Ping samples': pings.map(v => `${Math.round(v)} ms`).join(', '),
      'Download bytes': String(dlBytes),
      'Upload bytes': String(ulBytes),
    };
    setInternetProgress({ phase: 'Test complete — preparing results…', percent: 100 });
    setInternet(details);
    mark('passed', details);
  };

  const startStep = async () => {
    if (!step) return;
    resetInteractive(); setRunning(true); setStartedAt(Date.now());
    if (step.id === 'device') { mark('passed', deviceInfo); return; }
    if (step.id === 'browser') {
      const details = { 'JavaScript': 'Supported', 'Local Storage': typeof localStorage !== 'undefined' ? 'Supported' : 'Unavailable', 'Web Audio': 'AudioContext' in window ? 'Supported' : 'Unavailable', 'Media Devices': navigator.mediaDevices ? 'Supported' : 'Unavailable', 'Fullscreen API': document.fullscreenEnabled ? 'Available' : 'Unavailable', 'Touch points': String(navigator.maxTouchPoints), 'Online': navigator.onLine ? 'Yes' : 'No' };
      mark('passed', details); return;
    }
    if (step.id === 'dead-pixel') { await startDeadPixel(); return; }
    if (step.id === 'reaction') { startReaction(); return; }
    if (step.id === 'speaker') { await playSpeaker('both'); return; }
    if (step.id === 'microphone') { await startMic(); return; }
    if (step.id === 'camera') { await discoverCameras(); return; }
    if (step.id === 'internet') { await runInternet(); return; }
    if (step.id === 'latency') { await runLatency(); return; }
  };

  const finishCurrent = () => {
    if (!step) return;
    if (step.id === 'keyboard') mark(keys.length ? 'passed' : 'warning', { 'Unique physical key codes detected': String(keys.length), 'Detected keys': keys.join(', ') || 'None', 'Note': 'Only keys pressed during this step are listed.' });
    else if (step.id === 'typing') { const elapsed = typingStartRef.current ? (performance.now()-typingStartRef.current)/1000 : typing.elapsed; const words = typing.text.trim() ? typing.text.trim().split(/\s+/).length : 0; const wpm = elapsed ? words/(elapsed/60) : 0; mark(typing.chars ? 'passed' : 'warning', { 'Characters typed': String(typing.chars), 'Correct characters': String(typing.correct), 'Accuracy': typing.chars ? `${fmt(typing.correct/typing.chars*100,1)}%` : '0%', 'Elapsed': `${fmt(elapsed,1)} s`, 'Estimated WPM': fmt(wpm,1), 'Text entered': typing.text || 'None' }); }
    else if (step.id === 'spacebar') mark(spaceCount ? 'passed' : 'warning', { 'Spacebar presses detected': String(spaceCount), 'Key code': 'Space' });
    else if (step.id === 'mouse') mark(mouse.moves || mouse.clicks || mouse.wheel ? 'passed' : 'warning', { 'Pointer moves': String(mouse.moves), 'Clicks': String(mouse.clicks), 'Wheel events': String(mouse.wheel), 'Buttons detected': mouse.buttons.map(b => ['Left','Middle','Right','Back','Forward'][b] || `Button ${b}`).join(', ') || 'None' });
    else if (step.id === 'cps') { const elapsed = cpsStartRef.current ? (performance.now()-cpsStartRef.current)/1000 : 0; mark(cps ? 'passed' : 'warning', { 'Clicks': String(cps), 'Elapsed': `${fmt(elapsed,2)} s`, 'Observed CPS': elapsed ? fmt(cps/elapsed,2) : '0', 'Test window': '5 seconds (user-controlled finish)' }); }
    else if (step.id === 'accuracy') mark(accuracy.hits ? 'passed' : 'warning', { 'Hits': String(accuracy.hits), 'Misses': String(accuracy.misses), 'Accuracy': `${fmt(accuracy.hits+accuracy.misses ? accuracy.hits/(accuracy.hits+accuracy.misses)*100 : 0,1)}%` });
    else if (step.id === 'dpi') mark(pointerDistance ? 'passed' : 'warning', { 'Observed pointer travel': `${fmt(pointerDistance,1)} CSS px`, 'Estimated hardware DPI': 'Not readable by standard browser APIs', 'Method': 'Browser pointer-event travel' });
    else if (step.id === 'polling') { const valid=pollingIntervals.filter(v=>v>0); const rate=valid.length ? 1000/(valid.reduce((a,b)=>a+b,0)/valid.length) : 0; mark(valid.length ? 'passed' : 'warning', { 'Pointer events sampled': String(valid.length), 'Average interval': valid.length ? `${fmt(valid.reduce((a,b)=>a+b,0)/valid.length,2)} ms` : '—', 'Observed browser event rate': rate ? `${fmt(rate,1)} Hz` : '—', 'Hardware polling rate': 'Not directly readable by browser' }); }
    else if (step.id === 'touch') mark(touch.total ? 'passed' : 'warning', { 'Touch events': String(touch.total), 'Maximum simultaneous touches': String(touch.max), 'Multi-touch events': String(touch.multi), 'Touch gestures': String(touch.gestures) });
  };

  const skipCurrent = () => {
    cleanupMedia();
    if (reactionTimer) clearTimeout(reactionTimer);
    setReactionTimer(null);
    mark('skipped', { 'Reason': 'Skipped by user' });
  };

  const goNext = () => {
    if (autoNextTimerRef.current) clearTimeout(autoNextTimerRef.current);
    autoNextTimerRef.current = null;
    cleanupMedia();
    if (index < steps.length - 1) { setIndex(i => i + 1); setRunning(false); setStartedAt(null); resetInteractive(); }
  };

  const startTyping = (value: string) => {
    if (!typingStartRef.current) typingStartRef.current = performance.now();
    const target = 'The quick brown fox jumps over the lazy dog.';
    const correct = value.split('').reduce((n,c,i)=>n+(c===target[i]?1:0),0);
    setTyping({ text: value, chars: value.length, correct, elapsed: (performance.now()-(typingStartRef.current||performance.now()))/1000 });
  };

  const accuracyClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!running) return;
    const rect=event.currentTarget.getBoundingClientRect(); const x=(event.clientX-rect.left)/rect.width*100; const y=(event.clientY-rect.top)/rect.height*100;
    const dx=x-accuracy.target.x,dy=y-accuracy.target.y; const hit=Math.hypot(dx,dy)<10;
    setAccuracy(v=>hit?{...v,hits:v.hits+1,target:{x:10+Math.random()*80,y:15+Math.random()*70}}:{...v,misses:v.misses+1});
  };

  const accuracyHit = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (!running) return;
    setAccuracy(v => ({ ...v, hits: v.hits + 1, target: { x: 10 + Math.random() * 80, y: 15 + Math.random() * 70 } }));
  };

  const generatePdf = async () => {
    const pdf = new jsPDF({ unit: 'mm', format: 'a4' });
    const light = typeof document !== 'undefined' && document.documentElement.dataset.theme === 'light';
    const bg = light ? [255, 249, 240] : [8, 10, 14];
    const panel = light ? [255, 242, 226] : [18, 22, 30];
    const text = light ? [48, 42, 35] : [236, 241, 248];
    const muted = light ? [112, 96, 78] : [150, 162, 180];
    const accent = light ? [224, 116, 45] : [20, 200, 240];
    const green = [47, 160, 96]; const red = [208, 70, 70]; const amber = [205, 143, 45];
    const W = 210, H = 297; let y = 0;
    const logoData = await new Promise<string | null>((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || 128; canvas.height = img.naturalHeight || 128;
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve(null);
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      };
      img.onerror = () => resolve(null);
      img.src = '/assests/images/testappara-logo.png';
    });
    const pageBg = () => { pdf.setFillColor(...(bg as [number,number,number])); pdf.rect(0,0,W,H,'F'); };
    const header = () => {
      pageBg(); pdf.setFillColor(...(panel as [number,number,number])); pdf.rect(0,0,W,34,'F');
      if (logoData) pdf.addImage(logoData, 'PNG', 15, 5, 21, 14);
      pdf.setTextColor(...(text as [number,number,number])); pdf.setFontSize(13); pdf.text('Full Device Test Report',16,25);
      pdf.setTextColor(...(muted as [number,number,number])); pdf.setFontSize(7); pdf.text('testappara.tools@gmail.com',194,10,{align:'right'}); pdf.setFontSize(7); pdf.text(`${mode === 'mobile' ? 'Mobile / Tablet' : 'Laptop / Desktop'} · ${new Date().toLocaleString()}`,194,17,{align:'right'});
      y=45;
    };
    const footer = (pageNo:number) => {
      pdf.setDrawColor(...(light?[232,218,200]:[42,48,58]) as [number,number,number]); pdf.setLineWidth(0.3); pdf.line(15,284,195,284);
      pdf.setFont('helvetica','normal'); pdf.setFontSize(7.5); pdf.setTextColor(...(muted as [number,number,number]));
      pdf.text('TestAppara',15,290);
      pdf.setTextColor(...(accent as [number,number,number])); pdf.setFont('helvetica','bold');
      pdf.text('testappara.tools.com',105,290,{align:'center'});
      pdf.link(80,285,50,8,{url:'https://testappara.tools.com'});
      pdf.setTextColor(...(muted as [number,number,number])); pdf.setFont('helvetica','normal');
      pdf.text(`Page ${pageNo}`,195,290,{align:'right'});
    };
    let pageNo=1; header();
    pdf.setTextColor(...(text as [number,number,number])); pdf.setFont('helvetica','bold'); pdf.setFontSize(18); pdf.text('Device Summary',15,y); y+=9;
    pdf.setFillColor(...(panel as [number,number,number])); pdf.roundedRect(15,y,180,Math.max(38, Object.keys(deviceInfo).length*6+8),4,4,'F');
    pdf.setFont('helvetica','normal'); pdf.setFontSize(8); let sy=y+8; Object.entries(deviceInfo).forEach(([k,v])=>{ pdf.setTextColor(...(muted as [number,number,number])); pdf.text(k,20,sy); pdf.setTextColor(...(text as [number,number,number])); pdf.text(v,75,sy,{maxWidth:112}); sy+=6; }); y=sy+8;
    const counts={passed:results.filter(r=>r.status==='passed').length,warning:results.filter(r=>r.status==='warning').length,failed:results.filter(r=>r.status==='failed').length,skipped:results.filter(r=>r.status==='skipped').length};
    pdf.setFont('helvetica','bold'); pdf.setFontSize(14); pdf.setTextColor(...(text as [number,number,number])); pdf.text('Overall Results',15,y); y+=7;
    pdf.setFontSize(10); pdf.setTextColor(...(green as [number,number,number])); pdf.text(`Passed: ${counts.passed}`,18,y); pdf.setTextColor(...(amber as [number,number,number])); pdf.text(`Warnings: ${counts.warning}`,65,y); pdf.setTextColor(...(red as [number,number,number])); pdf.text(`Failed: ${counts.failed}`,113,y); pdf.setTextColor(...(muted as [number,number,number])); pdf.text(`Skipped: ${counts.skipped}`,160,y); y+=13;
    pdf.setFont('helvetica','normal'); pdf.setFontSize(8); pdf.setTextColor(...(muted as [number,number,number])); pdf.text('Each section below contains the actual measurements captured by the series. Skipped tests are explicitly recorded.',15,y,{maxWidth:180}); y+=10;
    const addPageIfNeeded=(height:number)=>{ if(y+height>276){footer(pageNo);pdf.addPage();pageNo++;header();} };
    results.forEach((r,ri)=>{
      const entries=Object.entries(r.details); const h=Math.max(24, 17+entries.length*6);
      addPageIfNeeded(h); pdf.setFillColor(...(panel as [number,number,number])); pdf.roundedRect(15,y,180,h,4,4,'F');
      pdf.setTextColor(...(accent as [number,number,number])); pdf.setFont('helvetica','bold'); pdf.setFontSize(11); pdf.text(`${ri+1}. ${r.title}`,20,y+8);
      const col=r.status==='passed'?green:r.status==='failed'?red:r.status==='warning'?amber:muted; pdf.setTextColor(...(col as [number,number,number])); pdf.setFontSize(8); pdf.text(statusLabel(r.status),190,y+8,{align:'right'});
      let ry=y+15; pdf.setFont('helvetica','normal'); pdf.setFontSize(7.8); entries.forEach(([k,v])=>{ pdf.setTextColor(...(muted as [number,number,number])); pdf.text(k,20,ry); pdf.setTextColor(...(text as [number,number,number])); const lines=pdf.splitTextToSize(v,112); pdf.text(lines,75,ry); ry+=Math.max(6,lines.length*4.2); });
      if(!entries.length){pdf.setTextColor(...(muted as [number,number,number]));pdf.text('No measurement data recorded.',20,y+17);} y+=h+6;
    });
    footer(pageNo); pdf.save(`testappara-full-device-test-${Date.now()}.pdf`);
  };

  if (deadPixelActive) {
    const patterns = [
      { name:'Black', bg:'#000000', fg:'#ffffff' }, { name:'White', bg:'#ffffff', fg:'#000000' }, { name:'Red', bg:'#ff0000', fg:'#ffffff' },
      { name:'Green', bg:'#00ff00', fg:'#000000' }, { name:'Blue', bg:'#0000ff', fg:'#ffffff' }, { name:'Gray', bg:'#808080', fg:'#ffffff' },
      { name:'Gradient', bg:'linear-gradient(135deg,#000 0%,#fff 100%)', fg:'#ffffff' },
    ];
    const p=patterns[deadPixelIndex];
    const advanceColor = () => {
      if (deadPixelIndex === patterns.length - 1) void exitDeadPixel(true);
      else setDeadPixelIndex(v => v + 1);
    };
    return <div
      onTouchStart={(event) => { event.preventDefault(); advanceColor(); }}
      style={{position:'fixed',inset:0,width:'100vw',height:'100vh',minHeight:'100dvh',zIndex:2147483647,background:p.bg,color:p.fg,display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden',cursor:'default',touchAction:'manipulation'}}
    >
      <div style={{position:'absolute',top:16,left:16,right:16,display:'flex',justifyContent:'space-between',alignItems:'center',gap:10,zIndex:2}}>
        <span style={{background:'rgba(0,0,0,.45)',padding:'9px 14px',borderRadius:999,font:'600 13px system-ui'}}>{p.name} · {deadPixelIndex+1}/{patterns.length}</span>
        <button onTouchStart={(e)=>e.stopPropagation()} onPointerDown={(e)=>e.stopPropagation()} onClick={(e)=>{e.stopPropagation();void exitDeadPixel(false)}} style={{background:'rgba(220,50,50,.72)',color:'#fff',border:0,borderRadius:999,padding:'9px 15px',font:'700 13px system-ui',cursor:'pointer'}}>Exit / Skip</button>
      </div>
      <div style={{position:'absolute',bottom:20,left:16,right:16,textAlign:'center',font:'500 13px system-ui',opacity:.55,pointerEvents:'none'}}>Touch anywhere to show the next color · Inspect the entire display for abnormal pixels</div>
      <button onTouchStart={(e)=>e.stopPropagation()} onPointerDown={(e)=>e.stopPropagation()} onClick={(e)=>{e.stopPropagation();advanceColor()}} style={{position:'absolute',bottom:52,left:'50%',transform:'translateX(-50%)',background:'rgba(0,0,0,.48)',color:'#fff',border:0,borderRadius:999,padding:'11px 20px',font:'700 13px system-ui',cursor:'pointer'}}>{deadPixelIndex===patterns.length-1?'Finish Sweep':'Next Color →'}</button>
    </div>;
  }

  if (!started || !mode) {
    return <main className="min-h-screen bg-background"><Header /><div className="max-w-5xl mx-auto px-6 lg:px-8 pt-28 pb-20">
      <div className="max-w-3xl mb-12"><div className="text-xs uppercase tracking-[.22em] text-primary font-bold mb-4">TestAppara Diagnostics</div><h1 className="text-section-title font-bold text-foreground mb-4">Full Device <span className="text-primary">Test</span></h1><p className="text-muted-foreground text-base leading-relaxed">Choose the device set that matches what you are testing. The series runs only the relevant component tests, keeps every detailed measurement, and creates one complete PDF report.</p></div>
      <div className="grid md:grid-cols-2 gap-5">
        <button onClick={()=>startSeries('laptop')} className="glass-card-hover rounded-3xl p-7 text-left group"><div className="text-4xl mb-5">💻</div><h2 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">Laptop / PC Test</h2><p className="text-sm text-muted-foreground mt-2 leading-relaxed">Keyboard, spacebar, mouse, CPS, accuracy, DPI, polling, network, display, audio, camera and browser checks.</p><div className="mt-6 text-sm font-bold text-primary">Start Laptop / PC Test →</div></button>
        <button onClick={()=>startSeries('mobile')} className="glass-card-hover rounded-3xl p-7 text-left group"><div className="text-4xl mb-5">📱</div><h2 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">Mobile / Tablet Test</h2><p className="text-sm text-muted-foreground mt-2 leading-relaxed">Touchscreen, display, network, audio, microphone, every browser-exposed camera, reaction time and browser checks.</p><div className="mt-6 text-sm font-bold text-primary">Start Mobile / Tablet Test →</div></button>
      </div>
    </div><Footer /></main>;
  }

  return <main className="min-h-screen bg-background"><Header /><div className="max-w-5xl mx-auto px-6 lg:px-8 pt-24 pb-20">
    <div className="flex flex-wrap items-end justify-between gap-5 mb-8"><div><div className="text-xs uppercase tracking-[.2em] text-primary font-bold mb-2">{mode==='mobile'?'Mobile / Tablet':'Laptop / PC'} Test Set</div><h1 className="text-3xl md:text-4xl font-bold text-foreground">Full Device <span className="text-primary">Test</span></h1><p className="text-sm text-muted-foreground mt-2">Test {index+1} of {steps.length} · {completedCount} completed</p></div><button onClick={() => void generatePdf()} disabled={!finished} className="rounded-full bg-primary px-6 py-3 font-bold text-black disabled:opacity-40">Generate PDF Report</button></div>
    <div className="grid lg:grid-cols-[260px_1fr] gap-6">
      <aside className="glass-card rounded-2xl p-4 h-fit lg:sticky lg:top-24 select-none" aria-label="Test progress"><div className="text-xs uppercase tracking-widest text-muted-foreground font-bold mb-3">Test Progress</div><div className="space-y-1">{steps.map((s,i)=>{const r=results[i];return <div key={s.id} aria-current={i===index?'step':undefined} className={`w-full rounded-xl px-3 py-2.5 ${i===index?'bg-primary/10 text-primary':'text-muted-foreground'} ${r.status==='pending'?'opacity-60':''}`}><div className="flex items-center gap-2 pointer-events-none"><span className="text-xs font-mono w-5">{i+1}</span><span className="text-sm font-semibold flex-1">{s.title}</span><span className="text-[10px] uppercase">{r.status==='pending'?'—':statusLabel(r.status)}</span></div></div>})}</div><div className="mt-4 border-t border-border pt-3 text-[11px] leading-5 text-muted-foreground">Tests run in order. The list is for progress only and cannot be used to jump ahead.</div></aside>
      <section className="glass-card rounded-3xl p-6 md:p-8">
        <div className="flex flex-wrap gap-2 mb-4"><span className="rounded-full border border-border px-3 py-1 text-xs text-primary">{step.category}</span><span className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">{step.title}</span></div>
        <h2 className="text-2xl md:text-3xl font-bold text-foreground">{step.title}</h2><p className="text-muted-foreground mt-2 max-w-2xl leading-relaxed">{step.description}</p>

        {step.id==='device' && <div className="mt-7 grid sm:grid-cols-2 gap-3">{Object.entries(deviceInfo).map(([k,v])=><div key={k} className="rounded-xl border border-border p-4"><div className="text-xs text-muted-foreground">{k}</div><div className="mt-1 text-sm font-semibold text-foreground break-words">{v}</div></div>)}</div>}
        {step.id==='browser' && <div className="mt-7 grid sm:grid-cols-2 gap-3">{Object.entries(currentResult?.details||{}).length ? Object.entries(currentResult!.details).map(([k,v])=><div key={k} className="rounded-xl border border-border p-4"><div className="text-xs text-muted-foreground">{k}</div><div className="mt-1 font-semibold text-foreground">{v}</div></div>) : <div className="rounded-xl border border-dashed border-border p-7 text-sm text-muted-foreground sm:col-span-2">Start the browser test to capture capability data.</div>}</div>}
        {step.id==='keyboard' && <div className="mt-7 rounded-2xl border border-dashed border-border p-7"><p className="text-sm text-muted-foreground">Press as many physical keys as you want. The series records the actual browser key codes received.</p><div className="mt-5 flex flex-wrap gap-2 min-h-20">{keys.map(k=><span key={k} className="rounded-lg border border-border px-3 py-2 text-xs font-mono text-foreground">{k}</span>)}{!keys.length&&<span className="text-sm text-muted-foreground">No keys detected yet.</span>}</div></div>}
        {step.id==='typing' && <div className="mt-7"><p className="text-sm text-muted-foreground mb-3">Type the sentence below. Your text, character count, correct characters, accuracy and estimated WPM are stored in the report.</p><div className="rounded-xl border border-border p-4 text-sm text-foreground mb-3">The quick brown fox jumps over the lazy dog.</div><textarea disabled={!running} value={typing.text} onChange={e=>startTyping(e.target.value)} className="w-full min-h-36 rounded-2xl border border-border bg-transparent p-4 text-foreground outline-none focus:border-primary" placeholder="Start typing here…"/><div className="grid grid-cols-3 gap-3 mt-4 text-center"><div><b className="text-2xl text-primary">{typing.chars}</b><span className="block text-xs text-muted-foreground">Characters</span></div><div><b className="text-2xl text-primary">{typing.correct}</b><span className="block text-xs text-muted-foreground">Correct</span></div><div><b className="text-2xl text-primary">{typing.elapsed.toFixed(1)}s</b><span className="block text-xs text-muted-foreground">Elapsed</span></div></div></div>}
        {step.id==='spacebar' && <div className="mt-7 rounded-2xl border-2 border-dashed border-border p-12 text-center"><div className="text-6xl font-mono font-bold text-primary">{spaceCount}</div><div className="text-sm text-muted-foreground mt-2">Spacebar presses detected</div><div className="mt-7 text-7xl opacity-15 font-bold">SPACE</div></div>}
        {step.id==='mouse' && <div className="mt-7 rounded-2xl border border-dashed border-border p-8 text-center"><div className="text-5xl">🖱️</div><p className="text-sm text-muted-foreground mt-3">Move the pointer, click every available button and scroll the wheel.</p><div className="grid grid-cols-3 gap-4 mt-7"><div><b className="text-2xl text-primary">{mouse.moves}</b><span className="block text-xs text-muted-foreground">Moves</span></div><div><b className="text-2xl text-primary">{mouse.clicks}</b><span className="block text-xs text-muted-foreground">Clicks</span></div><div><b className="text-2xl text-primary">{mouse.wheel}</b><span className="block text-xs text-muted-foreground">Wheel</span></div></div></div>}
        {step.id==='cps' && <div data-cps-zone onPointerDown={()=>{}} className="mt-7 rounded-2xl border-2 border-dashed border-border p-14 text-center select-none cursor-pointer"><div className="text-6xl font-bold text-primary">{cps}</div><div className="text-sm text-muted-foreground mt-2">Click this area repeatedly</div><div className="text-xs text-muted-foreground mt-2">Observed clicks are recorded for the report.</div></div>}
        {step.id==='accuracy' && <div onClick={accuracyClick} className="mt-7 relative h-72 rounded-2xl border border-border bg-muted/10 overflow-hidden cursor-crosshair"><button onClick={accuracyHit} style={{left:`${accuracy.target.x}%`,top:`${accuracy.target.y}%`,transform:'translate(-50%,-50%)'}} className="absolute w-20 h-20 rounded-full border-4 border-primary bg-primary/10 text-primary font-bold">TARGET</button><div className="absolute left-4 bottom-4 text-sm text-muted-foreground">Click the target. Other clicks count as misses.</div><div className="absolute right-4 top-4 text-sm text-foreground">Hits: <b>{accuracy.hits}</b> · Misses: <b>{accuracy.misses}</b></div></div>}
        {step.id==='dpi' && <div className="mt-7 rounded-2xl border border-border p-8"><p className="text-sm text-muted-foreground">Move the mouse continuously inside this area. The browser can measure CSS-pixel pointer travel, but it cannot directly read the physical mouse DPI value.</p><div className="mt-7 h-40 rounded-xl border border-dashed border-border grid place-items-center"><span className="font-mono text-primary">{fmt(pointerDistance,1)} CSS px observed</span></div></div>}
        {step.id==='polling' && <div className="mt-7 rounded-2xl border border-border p-8 text-center"><div className="text-5xl font-bold text-primary">{pollingIntervals.length}</div><div className="text-sm text-muted-foreground mt-2">pointer intervals sampled</div><p className="text-xs text-muted-foreground mt-4">Keep moving the mouse. The final report distinguishes browser event rate from hardware polling rate.</p></div>}
        {step.id==='internet' && <div className="mt-7">
          {running && !internet.Download && <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 mb-5">
            <div className="flex items-center justify-between gap-4 mb-4"><div><div className="font-semibold text-foreground">Testing your internet connection…</div><div className="text-xs text-muted-foreground mt-1">{internetProgress.phase}</div></div><div className="h-10 w-10 rounded-full border-4 border-primary/20 border-t-primary animate-spin shrink-0" /></div>
            <div className="h-2 rounded-full bg-border overflow-hidden"><div className="h-full bg-primary transition-all duration-500 rounded-full" style={{width:`${internetProgress.percent}%`}} /></div>
            <div className="mt-2 text-right text-xs font-mono text-primary">{Math.round(internetProgress.percent)}%</div>
          </div>}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">{['Download','Upload','Ping','Jitter'].map(k=><div key={k} className="rounded-xl border border-border p-5 text-center"><div className="text-2xl font-bold text-primary">{internet[k]||'—'}</div><div className="text-xs text-muted-foreground mt-1">{k}</div></div>)}</div>
        </div>}
        {step.id==='latency' && <div className="mt-7 rounded-2xl border border-border p-7"><div className="flex flex-wrap gap-3">{latency.map((v,i)=><span key={i} className="rounded-full border border-border px-4 py-2 text-sm font-mono">{Math.round(v)} ms</span>)}</div><p className="text-sm text-muted-foreground mt-5">Five request round-trip samples are stored in the final report.</p></div>}
        {step.id==='dead-pixel' && <div className="mt-7 rounded-2xl border border-border p-7"><h3 className="font-bold text-foreground">True Fullscreen Display Sweep</h3><p className="text-sm text-muted-foreground mt-2">Only the display test enters fullscreen. The whole website does not. The actual color surface fills the entire browser display so you can inspect every pixel.</p><div className="mt-5 grid grid-cols-4 sm:grid-cols-7 gap-2">{['#000','#fff','#f00','#0f0','#00f','#808080','linear-gradient(135deg,#000,#fff)'].map((bg,i)=><div key={i} style={{background:bg}} className="h-12 rounded-lg border border-border" />)}</div></div>}
        {step.id==='reaction' && <div className="mt-7"><button disabled={!running} onClick={reactionClick} className={`w-full h-64 rounded-3xl border-2 ${reactionReadyAt?'border-emerald-400 bg-emerald-500/10':'border-border bg-muted/10'}`}>{reactionReadyAt?<><div className="text-5xl font-bold text-emerald-400">CLICK!</div><div className="text-sm text-muted-foreground mt-2">Round {reactionRound}/5</div></>:<><div className="text-4xl font-bold text-foreground">WAIT…</div><div className="text-sm text-muted-foreground mt-2">Wait for the panel to change.</div></>}</button><div className="mt-4 text-center text-sm text-muted-foreground">Completed: {reactionResults.length}/5</div></div>}
        {step.id==='speaker' && <div className="mt-7 rounded-2xl border border-border p-7">
          <div className="text-center"><div className="text-5xl">🔊</div><p className="text-sm text-muted-foreground mt-3">Choose a speaker channel. A clear 1000 Hz tone plays immediately when you select it.</p></div>
          <div className="grid grid-cols-3 gap-3 mt-6">
            {([['left','Left Speaker'],['both','Both Speakers'],['right','Right Speaker']] as const).map(([channel,label]) => <button key={channel} type="button" onClick={()=>void playSpeaker(channel)} className={`rounded-xl border px-4 py-4 text-sm font-semibold transition ${speakerChannel===channel?'border-primary bg-primary/10 text-primary':'border-border text-foreground hover:border-primary/50'}`}>{label}</button>)}
          </div>
          <div className="mt-5 text-center text-sm"><span className="text-muted-foreground">Selected: </span><span className="font-semibold text-primary">{speakerChannel==='both'?'Left + Right':speakerChannel==='left'?'Left':'Right'}</span><span className="text-muted-foreground"> · Playback: {speakerPlayed?'Started':'Ready'}</span></div>
        </div>}
        {step.id==='microphone' && <div className="mt-7 rounded-2xl border border-border p-8 text-center"><div className="text-6xl font-bold text-primary">{mic.level}%</div><div className="text-sm text-muted-foreground mt-2">Live microphone input level</div><div className="mt-5 text-xs text-muted-foreground">Sample rate: {mic.sampleRate||'—'} Hz · Channels: {mic.channels||'—'}</div></div>}
        {step.id==='camera' && <div className="mt-7"><video ref={videoRef} autoPlay playsInline muted className="w-full aspect-video rounded-2xl bg-black object-contain"/><div className="mt-4 flex flex-wrap gap-2">{cameraDevices.map((c,i)=><span key={c.deviceId||i} className={`rounded-full border px-3 py-1.5 text-xs ${i===cameraIndex?'border-primary text-primary':'border-border text-muted-foreground'}`}>Camera {i+1}{c.label?` · ${c.label}`:''}</span>)}</div><p className="text-xs text-muted-foreground mt-4">Every camera exposed by the browser is tested individually. The camera stream is stopped automatically when the camera test finishes or you leave the step.</p></div>}
        {step.id==='touch' && <div onTouchStart={()=>{}} className="mt-7 rounded-2xl border-2 border-dashed border-border p-12 text-center"><div className="text-5xl">👆</div><p className="text-sm text-muted-foreground mt-3">Touch this area with one or multiple fingers.</p><div className="grid grid-cols-4 gap-3 mt-7"><div><b>{touch.total}</b><span className="block text-xs text-muted-foreground">Events</span></div><div><b>{touch.max}</b><span className="block text-xs text-muted-foreground">Max touches</span></div><div><b>{touch.multi}</b><span className="block text-xs text-muted-foreground">Multi-touch</span></div><div><b>{touch.gestures}</b><span className="block text-xs text-muted-foreground">Gestures</span></div></div></div>}

        <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-border pt-6">
          {!running && currentResult?.status==='pending' && <button onClick={()=>void startStep()} className="rounded-full bg-primary px-7 py-3.5 font-bold text-black">Start Test</button>}
          {running && !['device','browser','internet','latency','dead-pixel','reaction','microphone','camera'].includes(step.id) && <button onClick={finishCurrent} className="rounded-full bg-primary px-7 py-3.5 font-bold text-black">Finish & Save Result</button>}
          {running && step.id==='speaker' && <button onClick={confirmSpeaker} className="rounded-full bg-primary px-7 py-3.5 font-bold text-black">I Heard It — Save Result</button>}
          {running && step.id==='microphone' && <button onClick={confirmMic} className="rounded-full bg-primary px-7 py-3.5 font-bold text-black">Finish & Save Result</button>}
          {running && step.id==='camera' && cameraDevices.length>0 && <div className="rounded-full border border-primary/20 bg-primary/5 px-5 py-3.5 text-sm font-semibold text-primary">Camera {cameraIndex + 1} of {cameraDevices.length} · next camera starts automatically…</div>}
          {running && step.id==='dead-pixel' && <button onClick={()=>void startDeadPixel()} className="rounded-full bg-primary px-7 py-3.5 font-bold text-black">Open Fullscreen Color Test</button>}
          {running && step.id==='reaction' && <span className="text-sm text-muted-foreground">Complete all 5 rounds.</span>}
          {(currentResult?.status==='pending' || running) && <button onClick={skipCurrent} className="rounded-full border border-border px-6 py-3.5 font-semibold text-foreground hover:border-primary/50">Skip Test</button>}
          {currentResult?.status!=='pending' && currentResult?.status!=='running' && index<steps.length-1 && <><div className="rounded-full border border-primary/20 bg-primary/5 px-5 py-3.5 text-sm font-semibold text-primary">Next test starts automatically…</div><button onClick={goToNextTestNow} className="rounded-full border border-primary/50 px-6 py-3.5 font-semibold text-primary transition hover:bg-primary/10">Next Test Now →</button></>}
          {finished && <button onClick={() => void generatePdf()} className="rounded-full bg-primary px-6 py-3.5 font-bold text-black">Download Full PDF Report</button>}
          {finished && <button onClick={()=>{setStarted(false);setMode(null);setResults([]);}} className="rounded-full border border-border px-6 py-3.5 font-semibold text-foreground">Choose Another Set</button>}
        </div>
        {finished && <p className="mt-4 text-center text-xs leading-relaxed text-muted-foreground">For the most accurate results, use the individual TestAppara tests separately when you need a focused check and more detailed measurements.</p>}
      </section>
    </div>
  </div><Footer /></main>;
}
