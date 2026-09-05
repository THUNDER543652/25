'use client';

import React, { useState, useEffect, useCallback } from 'react';

interface KeyState {
  code: string;
  key: string;
  pressed: boolean;
  count: number;
}

interface KeyHistory {
  key: string;
  code: string;
  time: number;
}

// Keyboard layout definition
const keyboardRows = [
  [
    { label: 'Esc', code: 'Escape', w: 'w-10' },
    { label: 'F1', code: 'F1', w: 'w-9' },
    { label: 'F2', code: 'F2', w: 'w-9' },
    { label: 'F3', code: 'F3', w: 'w-9' },
    { label: 'F4', code: 'F4', w: 'w-9' },
    { label: 'F5', code: 'F5', w: 'w-9' },
    { label: 'F6', code: 'F6', w: 'w-9' },
    { label: 'F7', code: 'F7', w: 'w-9' },
    { label: 'F8', code: 'F8', w: 'w-9' },
    { label: 'F9', code: 'F9', w: 'w-9' },
    { label: 'F10', code: 'F10', w: 'w-9' },
    { label: 'F11', code: 'F11', w: 'w-9' },
    { label: 'F12', code: 'F12', w: 'w-9' },
  ],
  [
    { label: '`', code: 'Backquote', w: 'w-10' },
    { label: '1', code: 'Digit1', w: 'w-10' },
    { label: '2', code: 'Digit2', w: 'w-10' },
    { label: '3', code: 'Digit3', w: 'w-10' },
    { label: '4', code: 'Digit4', w: 'w-10' },
    { label: '5', code: 'Digit5', w: 'w-10' },
    { label: '6', code: 'Digit6', w: 'w-10' },
    { label: '7', code: 'Digit7', w: 'w-10' },
    { label: '8', code: 'Digit8', w: 'w-10' },
    { label: '9', code: 'Digit9', w: 'w-10' },
    { label: '0', code: 'Digit0', w: 'w-10' },
    { label: '-', code: 'Minus', w: 'w-10' },
    { label: '=', code: 'Equal', w: 'w-10' },
    { label: '⌫', code: 'Backspace', w: 'w-16' },
  ],
  [
    { label: 'Tab', code: 'Tab', w: 'w-14' },
    { label: 'Q', code: 'KeyQ', w: 'w-10' },
    { label: 'W', code: 'KeyW', w: 'w-10' },
    { label: 'E', code: 'KeyE', w: 'w-10' },
    { label: 'R', code: 'KeyR', w: 'w-10' },
    { label: 'T', code: 'KeyT', w: 'w-10' },
    { label: 'Y', code: 'KeyY', w: 'w-10' },
    { label: 'U', code: 'KeyU', w: 'w-10' },
    { label: 'I', code: 'KeyI', w: 'w-10' },
    { label: 'O', code: 'KeyO', w: 'w-10' },
    { label: 'P', code: 'KeyP', w: 'w-10' },
    { label: '[', code: 'BracketLeft', w: 'w-10' },
    { label: ']', code: 'BracketRight', w: 'w-10' },
    { label: '\\', code: 'Backslash', w: 'w-12' },
  ],
  [
    { label: 'Caps', code: 'CapsLock', w: 'w-16' },
    { label: 'A', code: 'KeyA', w: 'w-10' },
    { label: 'S', code: 'KeyS', w: 'w-10' },
    { label: 'D', code: 'KeyD', w: 'w-10' },
    { label: 'F', code: 'KeyF', w: 'w-10' },
    { label: 'G', code: 'KeyG', w: 'w-10' },
    { label: 'H', code: 'KeyH', w: 'w-10' },
    { label: 'J', code: 'KeyJ', w: 'w-10' },
    { label: 'K', code: 'KeyK', w: 'w-10' },
    { label: 'L', code: 'KeyL', w: 'w-10' },
    { label: ';', code: 'Semicolon', w: 'w-10' },
    { label: "'", code: 'Quote', w: 'w-10' },
    { label: '↵', code: 'Enter', w: 'w-20' },
  ],
  [
    { label: '⇧', code: 'ShiftLeft', w: 'w-20' },
    { label: 'Z', code: 'KeyZ', w: 'w-10' },
    { label: 'X', code: 'KeyX', w: 'w-10' },
    { label: 'C', code: 'KeyC', w: 'w-10' },
    { label: 'V', code: 'KeyV', w: 'w-10' },
    { label: 'B', code: 'KeyB', w: 'w-10' },
    { label: 'N', code: 'KeyN', w: 'w-10' },
    { label: 'M', code: 'KeyM', w: 'w-10' },
    { label: ',', code: 'Comma', w: 'w-10' },
    { label: '.', code: 'Period', w: 'w-10' },
    { label: '/', code: 'Slash', w: 'w-10' },
    { label: '⇧', code: 'ShiftRight', w: 'w-24' },
  ],
  [
    { label: 'Ctrl', code: 'ControlLeft', w: 'w-14' },
    { label: '⌘', code: 'MetaLeft', w: 'w-12' },
    { label: 'Alt', code: 'AltLeft', w: 'w-12' },
    { label: 'Space', code: 'Space', w: 'w-52' },
    { label: 'Alt', code: 'AltRight', w: 'w-12' },
    { label: '⌘', code: 'MetaRight', w: 'w-12' },
    { label: 'Ctrl', code: 'ControlRight', w: 'w-14' },
  ],
];

export default function KeyboardTester() {
  const [pressedKeys, setPressedKeys] = useState<Record<string, KeyState>>({});
  const [keyHistory, setKeyHistory] = useState<KeyHistory[]>([]);
  const [totalPresses, setTotalPresses] = useState(0);
  const [simultaneousMax, setSimultaneousMax] = useState(0);
  const [currentSimultaneous, setCurrentSimultaneous] = useState(0);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    e.preventDefault();
    const code = e.code;
    const key = e.key;

    setPressedKeys((prev) => {
      const existing = prev[code];
      const updated = {
        ...prev,
        [code]: {
          code,
          key,
          pressed: true,
          count: (existing?.count || 0) + 1,
        },
      };
      const simCount = Object.values(updated).filter((k) => k.pressed).length;
      setCurrentSimultaneous(simCount);
      setSimultaneousMax((m) => Math.max(m, simCount));
      return updated;
    });

    setTotalPresses((t) => t + 1);
    setKeyHistory((h) => [{ key, code, time: Date.now() }, ...h.slice(0, 19)]);
  }, []);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    e.preventDefault();
    const code = e.code;
    setPressedKeys((prev) => {
      if (!prev[code]) return prev;
      const updated = { ...prev, [code]: { ...prev[code], pressed: false } };
      const simCount = Object.values(updated).filter((k) => k.pressed).length;
      setCurrentSimultaneous(simCount);
      return updated;
    });
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  const handleReset = () => {
    setPressedKeys({});
    setKeyHistory([]);
    setTotalPresses(0);
    setSimultaneousMax(0);
    setCurrentSimultaneous(0);
  };

  const testedCount = Object.keys(pressedKeys).length;

  return (
    <div className="glass-card rounded-2xl p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0H3" />
            </svg>
            Keyboard Test
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">Press any key to test. Keys light up cyan when pressed.</p>
        </div>
        <button
          onClick={handleReset}
          className="inline-flex items-center gap-2 glass-card rounded-full px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:border-border transition-all"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
          Reset
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Keys Tested', value: testedCount, color: 'text-primary' },
          { label: 'Total Presses', value: totalPresses, color: 'text-violet-400' },
          { label: 'Simultaneous', value: currentSimultaneous, color: 'text-amber-400' },
          { label: 'Max Simultaneous', value: simultaneousMax, color: 'text-emerald-400' },
        ].map((stat) => (
          <div key={stat.label} className="glass-card rounded-xl p-3 text-center">
            <div className={`font-mono text-2xl font-bold ${stat.color}`}>{stat.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Keyboard visual */}
      <div className="overflow-x-auto pb-2">
        <div className="inline-block min-w-max space-y-1.5">
          {keyboardRows.map((row, ri) => (
            <div key={ri} className="flex gap-1.5 items-center">
              {row.map((key) => {
                const state = pressedKeys[key.code];
                const isPressed = state?.pressed || false;
                const wasPressed = !!state;
                return (
                  <div
                    key={key.code}
                    className={`${key.w} h-9 flex items-center justify-center text-xs font-mono font-medium transition-all duration-75 select-none
                      ${isPressed ? 'key-cap-pressed' : wasPressed ? 'key-cap text-primary/80 border-primary/30' : 'key-cap text-foreground/60'}
                    `}
                  >
                    {key.label}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Key history */}
      {keyHistory.length > 0 && (
        <div className="mt-5">
          <p className="text-xs text-muted-foreground mb-2 font-semibold uppercase tracking-wider">Key History</p>
          <div className="flex flex-wrap gap-1.5 max-h-20 overflow-hidden">
            {keyHistory.map((item, i) => (
              <span
                key={i}
                className="font-mono text-xs px-2 py-1 glass-card rounded-md text-primary/80"
                style={{ opacity: Math.max(0.3, 1 - i * 0.04) }}
              >
                {item.key.length > 3 ? item.code.replace('Key', '').replace('Digit', '') : item.key}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Instructions */}
      {testedCount === 0 && (
        <div className="mt-6 text-center py-8 border-t border-border">
          <div className="text-4xl mb-3 opacity-30">⌨️</div>
          <p className="text-muted-foreground text-sm">Click on this area and start pressing keys on your keyboard</p>
          <p className="text-xs text-muted-foreground/60 mt-1">Keys will highlight in cyan as you press them</p>
        </div>
      )}
    </div>
  );
}