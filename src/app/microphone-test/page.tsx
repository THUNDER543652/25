'use client';
import React, { useState, useRef, useEffect } from 'react';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import Link from 'next/link';

export default function MicrophoneTestPage() {
  const [status, setStatus] = useState<'idle' | 'requesting' | 'active' | 'error'>('idle');
  const [error, setError] = useState('');
  const [volume, setVolume] = useState(0);
  const [peakVolume, setPeakVolume] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [waveformData, setWaveformData] = useState<number[]>(new Array(60).fill(0));
  const streamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef<number>(0);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const stopMic = () => {
    cancelAnimationFrame(rafRef.current);
    if (streamRef.current) { streamRef.current.getTracks().forEach(t => t.stop()); streamRef.current = null; }
    if (audioCtxRef.current) { audioCtxRef.current.close(); audioCtxRef.current = null; }
    setStatus('idle');
    setVolume(0);
    setPeakVolume(0);
    setWaveformData(new Array(60).fill(0));
  };

  const startMic = async () => {
    setStatus('requesting');
    setError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const ctx = new AudioContext();
      audioCtxRef.current = ctx;
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;
      setStatus('active');

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const tick = () => {
        analyser.getByteTimeDomainData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          const v = (dataArray[i] - 128) / 128;
          sum += v * v;
        }
        const rms = Math.sqrt(sum / dataArray.length);
        const vol = Math.round(rms * 200);
        setVolume(vol);
        setPeakVolume(prev => Math.max(prev, vol));
        setWaveformData(prev => {
          const slice = Array.from(dataArray.slice(0, 60)).map(v => ((v - 128) / 128) * 50);
          return slice;
        });
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Microphone access denied');
      setStatus('error');
    }
  };

  const startRecording = () => {
    if (!streamRef.current) return;
    chunksRef.current = [];
    const recorder = new MediaRecorder(streamRef.current);
    recorder.ondataavailable = e => chunksRef.current.push(e.data);
    recorder.onstop = () => setRecordedBlob(new Blob(chunksRef.current, { type: 'audio/webm' }));
    recorder.start();
    recorderRef.current = recorder;
    setIsRecording(true);
  };

  const stopRecording = () => {
    recorderRef.current?.stop();
    setIsRecording(false);
  };

  useEffect(() => () => stopMic(), []);

  const volPercent = Math.min(100, volume);
  const volColor = volPercent > 80 ? '#f43f5e' : volPercent > 50 ? '#f59e0b' : '#00D4FF';

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="max-w-3xl mx-auto px-6 lg:px-8 pt-28 pb-20">
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Link href="/" className="text-xs text-muted-foreground hover:text-primary transition-colors">Home</Link>
            <span className="text-muted-foreground/40">/</span>
            <span className="text-xs text-primary">Microphone Test</span>
          </div>
          <span className="inline-flex items-center gap-2 glass-card rounded-full px-3 py-1.5 text-xs font-semibold text-sky-400 uppercase tracking-widest mb-4">Audio</span>
          <h1 className="text-section-title font-bold text-foreground mb-3">
            Microphone <span className="text-primary">Test</span>
          </h1>
          <p className="text-muted-foreground text-base leading-relaxed max-w-xl">
            Test your microphone with a live audio waveform, volume meter, and playback recording.
          </p>
        </div>

        {/* Waveform */}
        <div className="glass-card rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-foreground">Audio Waveform</h3>
            {status === 'active' && <span className="flex items-center gap-1.5 text-xs text-emerald-400"><span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>Live</span>}
          </div>
          <div className="flex items-center justify-center gap-0.5 h-24">
            {waveformData.map((v, i) => (
              <div
                key={i}
                className="w-1 rounded-full transition-all duration-75"
                style={{
                  height: `${Math.max(4, Math.abs(v) * 2)}px`,
                  background: status === 'active' ? volColor : 'rgba(255,255,255,0.1)',
                  opacity: status === 'active' ? 0.8 + (Math.abs(v) / 50) * 0.2 : 0.3,
                }}
              />
            ))}
          </div>
        </div>

        {/* Volume Meter */}
        <div className="glass-card rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-foreground">Volume Level</h3>
            <span className="font-mono text-sm" style={{ color: volColor }}>{volPercent}%</span>
          </div>
          <div className="glass-card rounded-full h-4 overflow-hidden mb-2">
            <div
              className="h-full rounded-full transition-all duration-75"
              style={{ width: `${volPercent}%`, background: volColor, boxShadow: `0 0 10px ${volColor}` }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Silent</span>
            <span>Peak: {peakVolume}%</span>
            <span>Loud</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {status !== 'active' ? (
            <button
              onClick={startMic}
              disabled={status === 'requesting'}
              className="inline-flex items-center gap-2 bg-primary text-black font-bold rounded-full px-8 py-3.5 hover:opacity-90 active:scale-95 transition-all glow-cyan disabled:opacity-50"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
              </svg>
              {status === 'requesting' ? 'Requesting...' : 'Start Microphone'}
            </button>
          ) : (
            <>
              {!isRecording ? (
                <button onClick={startRecording} className="inline-flex items-center gap-2 glass-card rounded-full px-6 py-3 text-sm font-semibold text-rose-400 border-rose-500/30 hover:border-rose-400/50 transition-all">
                  <span className="w-2 h-2 rounded-full bg-rose-400"></span>
                  Record
                </button>
              ) : (
                <button onClick={stopRecording} className="inline-flex items-center gap-2 bg-rose-500/20 border border-rose-400 rounded-full px-6 py-3 text-sm font-semibold text-rose-400 transition-all">
                  <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse"></span>
                  Stop Recording
                </button>
              )}
              <button onClick={stopMic} className="inline-flex items-center gap-2 glass-card rounded-full px-6 py-3 text-sm font-semibold text-muted-foreground hover:text-foreground transition-all">
                Stop Mic
              </button>
            </>
          )}
        </div>

        {/* Playback */}
        {recordedBlob && (
          <div className="glass-card rounded-2xl p-6 mb-8">
            <h3 className="text-sm font-semibold text-foreground mb-3">Playback Recording</h3>
            <audio controls src={URL.createObjectURL(recordedBlob)} className="w-full" />
          </div>
        )}

        {error && (
          <div className="glass-card rounded-2xl p-4 mb-6 border-rose-500/30">
            <p className="text-rose-400 text-sm">{error}</p>
          </div>
        )}

        <div className="glass-card rounded-2xl p-6">
          <h2 className="text-lg font-bold text-foreground mb-3">Privacy Notice</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">Audio is processed entirely in your browser using the Web Audio API. No audio data is sent to any server. Recording stays local to your device.</p>
        </div>
      </div>
      <Footer />
    </main>
  );
}
