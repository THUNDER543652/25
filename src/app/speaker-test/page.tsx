'use client';
import React, { useState, useRef, useEffect } from 'react';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import Link from 'next/link';

const TONES = [
  { freq: 440, label: 'Left Channel', channel: 'left', color: 'text-primary' },
  { freq: 440, label: 'Right Channel', channel: 'right', color: 'text-violet-400' },
  { freq: 440, label: 'Both Channels', channel: 'both', color: 'text-emerald-400' },
  { freq: 1000, label: 'High Freq (1kHz)', channel: 'both', color: 'text-amber-400' },
  { freq: 100, label: 'Low Freq (100Hz)', channel: 'both', color: 'text-rose-400' },
];

export default function SpeakerTestPage() {
  const [playing, setPlaying] = useState<number | null>(null);
  const [volume, setVolume] = useState(0.7);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const nodesRef = useRef<{ osc: OscillatorNode; gain: GainNode; panner: StereoPannerNode } | null>(null);

  const stopTone = () => {
    if (nodesRef.current) {
      nodesRef.current.gain.gain.setTargetAtTime(0, audioCtxRef.current!.currentTime, 0.05);
      setTimeout(() => {
        nodesRef.current?.osc.stop();
        nodesRef.current = null;
      }, 200);
    }
    setPlaying(null);
  };

  const playTone = (index: number) => {
    if (playing === index) { stopTone(); return; }
    stopTone();

    if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
      audioCtxRef.current = new AudioContext();
    }
    const ctx = audioCtxRef.current;
    const tone = TONES[index];

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const panner = ctx.createStereoPanner();

    osc.frequency.value = tone.freq;
    osc.type = 'sine';
    gain.gain.value = volume;
    panner.pan.value = tone.channel === 'left' ? -1 : tone.channel === 'right' ? 1 : 0;

    osc.connect(gain);
    gain.connect(panner);
    panner.connect(ctx.destination);
    osc.start();

    nodesRef.current = { osc, gain, panner };
    setPlaying(index);
  };

  useEffect(() => () => stopTone(), []);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    if (nodesRef.current) nodesRef.current.gain.gain.value = v;
  };

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="max-w-3xl mx-auto px-6 lg:px-8 pt-28 pb-20">
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Link href="/" className="text-xs text-muted-foreground hover:text-primary transition-colors">Home</Link>
            <span className="text-muted-foreground/40">/</span>
            <span className="text-xs text-primary">Speaker Test</span>
          </div>
          <span className="inline-flex items-center gap-2 glass-card rounded-full px-3 py-1.5 text-xs font-semibold text-sky-400 uppercase tracking-widest mb-4">Audio</span>
          <h1 className="text-section-title font-bold text-foreground mb-3">
            Speaker <span className="text-primary">Test</span>
          </h1>
          <p className="text-muted-foreground text-base leading-relaxed max-w-xl">
            Test left/right audio channels, stereo separation, and frequency response of your speakers or headphones.
          </p>
        </div>

        {/* Volume Control */}
        <div className="glass-card rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-semibold text-foreground">Volume</label>
            <span className="font-mono text-sm text-primary">{Math.round(volume * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="w-full accent-primary"
          />
        </div>

        {/* Stereo Indicator */}
        <div className="glass-card rounded-2xl p-6 mb-6">
          <h3 className="text-sm font-semibold text-foreground mb-4">Stereo Channel Indicator</h3>
          <div className="flex items-center gap-4">
            <div className={`flex-1 glass-card rounded-xl p-4 text-center transition-all ${
              playing !== null && TONES[playing]?.channel !== 'right' ? 'border-primary/50 bg-primary/10' : ''
            }`}>
              <div className={`text-2xl font-bold mb-1 ${playing !== null && TONES[playing]?.channel !== 'right' ? 'text-primary' : 'text-muted-foreground'}`}>L</div>
              <div className="text-xs text-muted-foreground">Left</div>
            </div>
            <div className="text-muted-foreground">↔</div>
            <div className={`flex-1 glass-card rounded-xl p-4 text-center transition-all ${
              playing !== null && TONES[playing]?.channel !== 'left' ? 'border-violet-400/50 bg-violet-500/10' : ''
            }`}>
              <div className={`text-2xl font-bold mb-1 ${playing !== null && TONES[playing]?.channel !== 'left' ? 'text-violet-400' : 'text-muted-foreground'}`}>R</div>
              <div className="text-xs text-muted-foreground">Right</div>
            </div>
          </div>
        </div>

        {/* Test Tones */}
        <div className="space-y-3 mb-8">
          {TONES.map((tone, i) => (
            <button
              key={i}
              onClick={() => playTone(i)}
              className={`w-full glass-card-hover rounded-2xl p-5 flex items-center justify-between transition-all ${
                playing === i ? 'border-primary/50 bg-primary/10' : ''
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl glass-card flex items-center justify-center ${tone.color}`}>
                  {playing === i ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 7.5A2.25 2.25 0 017.5 5.25h9a2.25 2.25 0 012.25 2.25v9a2.25 2.25 0 01-2.25 2.25h-9a2.25 2.25 0 01-2.25-2.25v-9z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 3l14 9-14 9V3z" />
                    </svg>
                  )}
                </div>
                <div className="text-left">
                  <div className="text-sm font-semibold text-foreground">{tone.label}</div>
                  <div className="text-xs text-muted-foreground">{tone.freq}Hz · {tone.channel === 'left' ? 'Left only' : tone.channel === 'right' ? 'Right only' : 'Both channels'}</div>
                </div>
              </div>
              <span className={`text-xs font-semibold ${playing === i ? 'text-primary' : 'text-muted-foreground'}`}>
                {playing === i ? 'PLAYING' : 'PLAY'}
              </span>
            </button>
          ))}
        </div>

        <div className="glass-card rounded-2xl p-6">
          <h2 className="text-lg font-bold text-foreground mb-4">Speaker Test Guide</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
            <div>
              <h3 className="text-foreground font-semibold mb-2">Stereo Check</h3>
              <p>Play Left and Right channel tests separately. You should only hear sound from the respective side. If both play from one side, your stereo is reversed or mono.</p>
            </div>
            <div>
              <h3 className="text-foreground font-semibold mb-2">Frequency Test</h3>
              <p>Test high and low frequencies to check your speaker range. If you can\'t hear the 100Hz tone, your speakers may lack bass response.</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
