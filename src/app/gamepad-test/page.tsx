'use client';
import React, { useState, useEffect, useCallback } from 'react';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import Link from 'next/link';

interface GamepadState {
  id: string;
  index: number;
  buttons: boolean[];
  axes: number[];
  connected: boolean;
  type: 'xbox' | 'playstation' | 'generic';
}

const XBOX_BUTTONS = ['A', 'B', 'X', 'Y', 'LB', 'RB', 'LT', 'RT', 'Back', 'Start', 'LS', 'RS', 'Up', 'Down', 'Left', 'Right', 'Xbox'];
const PS_BUTTONS = ['Cross', 'Circle', 'Square', 'Triangle', 'L1', 'R1', 'L2', 'R2', 'Share', 'Options', 'L3', 'R3', 'Up', 'Down', 'Left', 'Right', 'PS'];

function detectType(id: string): 'xbox' | 'playstation' | 'generic' {
  const lower = id.toLowerCase();
  if (lower.includes('xbox') || lower.includes('xinput')) return 'xbox';
  if (lower.includes('playstation') || lower.includes('dualshock') || lower.includes('dualsense') || lower.includes('054c')) return 'playstation';
  return 'generic';
}

export default function GamepadTestPage() {
  const [gamepads, setGamepads] = useState<GamepadState[]>([]);
  const rafRef = React.useRef<number>(0);

  const pollGamepads = useCallback(() => {
    const pads = navigator.getGamepads ? Array.from(navigator.getGamepads()).filter(Boolean) : [];
    const states: GamepadState[] = pads.map((pad) => ({
      id: pad!.id,
      index: pad!.index,
      buttons: Array.from(pad!.buttons).map(b => b.pressed),
      axes: Array.from(pad!.axes).map(a => parseFloat(a.toFixed(3))),
      connected: pad!.connected,
      type: detectType(pad!.id),
    }));
    setGamepads(states);
    rafRef.current = requestAnimationFrame(pollGamepads);
  }, []);

  useEffect(() => {
    const onConnect = () => { rafRef.current = requestAnimationFrame(pollGamepads); };
    const onDisconnect = () => setGamepads([]);
    window.addEventListener('gamepadconnected', onConnect);
    window.addEventListener('gamepaddisconnected', onDisconnect);
    rafRef.current = requestAnimationFrame(pollGamepads);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('gamepadconnected', onConnect);
      window.removeEventListener('gamepaddisconnected', onDisconnect);
    };
  }, [pollGamepads]);

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="max-w-4xl mx-auto px-6 lg:px-8 pt-28 pb-20">
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Link href="/" className="text-xs text-muted-foreground hover:text-primary transition-colors">Home</Link>
            <span className="text-muted-foreground/40">/</span>
            <span className="text-xs text-primary">Gamepad Test</span>
          </div>
          <span className="inline-flex items-center gap-2 glass-card rounded-full px-3 py-1.5 text-xs font-semibold text-amber-400 uppercase tracking-widest mb-4">Gaming</span>
          <h1 className="text-section-title font-bold text-foreground mb-3">
            Gamepad <span className="text-primary">Test</span>
          </h1>
          <p className="text-muted-foreground text-base leading-relaxed max-w-xl">
            Test Xbox, PlayStation, and generic USB controllers. Connect your gamepad and press buttons to see real-time input.
          </p>
        </div>

        {gamepads.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center mb-8">
            <div className="text-6xl mb-4">🎮</div>
            <h3 className="text-lg font-bold text-foreground mb-2">No Gamepad Detected</h3>
            <p className="text-muted-foreground text-sm mb-4">Connect a controller and press any button to activate it.</p>
            <div className="flex flex-wrap justify-center gap-3">
              {['Xbox', 'PlayStation', 'Generic USB'].map(t => (
                <span key={t} className="glass-card rounded-full px-4 py-2 text-xs text-muted-foreground">{t}</span>
              ))}
            </div>
          </div>
        ) : (
          gamepads.map((pad) => {
            const btnLabels = pad.type === 'xbox' ? XBOX_BUTTONS : pad.type === 'playstation' ? PS_BUTTONS : pad.buttons.map((_, i) => `B${i}`);
            return (
              <div key={pad.index} className="glass-card rounded-2xl p-6 mb-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 glass-card rounded-lg text-primary">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 01-.657.643 48.39 48.39 0 01-4.163-.3c.186 1.613.293 3.25.315 4.907a.656.656 0 01-.658.663v0c-.355 0-.676-.186-.959-.401a1.647 1.647 0 00-1.003-.349c-1.036 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401v0c.31 0 .555.26.532.57a48.039 48.039 0 01-.642 5.056c1.518.19 3.058.309 4.616.354a.64.64 0 00.657-.643v0c0-.355-.186-.676-.401-.959a1.647 1.647 0 01-.349-1.003c0-1.035 1.008-1.875 2.25-1.875 1.243 0 2.25.84 2.25 1.875 0 .369-.128.713-.349 1.003-.215.283-.401.604-.401.959v0c0 .333.277.599.61.58a48.1 48.1 0 005.427-.63 48.05 48.05 0 00.582-4.717.532.532 0 00-.533-.57v0c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.035 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.37 0 .713.128 1.003.349.283.215.604.401.959.401v0a.656.656 0 00.658-.663 48.422 48.422 0 00-.37-5.36c-1.886.342-3.81.574-5.766.689a.578.578 0 01-.61-.58v0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-foreground">{pad.type.charAt(0).toUpperCase() + pad.type.slice(1)} Controller</div>
                    <div className="text-xs text-muted-foreground truncate max-w-xs">{pad.id}</div>
                  </div>
                  <span className="ml-auto text-xs font-semibold text-emerald-400 glass-card rounded-full px-3 py-1">Connected</span>
                </div>

                {/* Buttons */}
                <div className="mb-6">
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">Buttons</div>
                  <div className="flex flex-wrap gap-2">
                    {pad.buttons.map((pressed, i) => (
                      <div
                        key={i}
                        className={`key-cap flex items-center justify-center h-9 px-3 text-xs font-mono font-bold transition-all ${
                          pressed ? 'key-cap-pressed' : ''
                        }`}
                      >
                        {btnLabels[i] ?? `B${i}`}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Axes */}
                <div>
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">Axes / Sticks</div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {pad.axes.map((val, i) => (
                      <div key={i} className="glass-card rounded-xl p-3">
                        <div className="text-xs text-muted-foreground mb-2">Axis {i}</div>
                        <div className="glass-card rounded-full h-2 mb-1 overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full transition-all duration-75"
                            style={{ width: `${((val + 1) / 2) * 100}%` }}
                          />
                        </div>
                        <div className="font-mono text-xs text-primary text-right">{val.toFixed(3)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })
        )}

        <div className="glass-card rounded-2xl p-6">
          <h2 className="text-lg font-bold text-foreground mb-4">Supported Controllers</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
            {[
              { name: 'Xbox Controllers', desc: 'Xbox One, Series X/S, 360 (via USB or Bluetooth)', icon: '🎮' },
              { name: 'PlayStation Controllers', desc: 'DualShock 4, DualSense (PS4/PS5)', icon: '🕹️' },
              { name: 'Generic USB', desc: 'Any HID-compliant gamepad or joystick', icon: '🔌' },
            ].map(c => (
              <div key={c.name} className="glass-card rounded-xl p-4">
                <div className="text-2xl mb-2">{c.icon}</div>
                <div className="font-semibold text-foreground mb-1">{c.name}</div>
                <div className="text-xs">{c.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
