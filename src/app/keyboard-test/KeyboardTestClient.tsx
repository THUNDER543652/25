'use client';
import React, { useState, useEffect, useCallback } from 'react';

const KEY_ROWS = [
  ['Escape','F1','F2','F3','F4','F5','F6','F7','F8','F9','F10','F11','F12'],
  ['Backquote','Digit1','Digit2','Digit3','Digit4','Digit5','Digit6','Digit7','Digit8','Digit9','Digit0','Minus','Equal','Backspace'],
  ['Tab','KeyQ','KeyW','KeyE','KeyR','KeyT','KeyY','KeyU','KeyI','KeyO','KeyP','BracketLeft','BracketRight','Backslash'],
  ['CapsLock','KeyA','KeyS','KeyD','KeyF','KeyG','KeyH','KeyJ','KeyK','KeyL','Semicolon','Quote','Enter'],
  ['ShiftLeft','KeyZ','KeyX','KeyC','KeyV','KeyB','KeyN','KeyM','Comma','Period','Slash','ShiftRight'],
  ['ControlLeft','MetaLeft','AltLeft','Space','AltRight','MetaRight','ContextMenu','ControlRight'],
];

const KEY_LABELS: Record<string, string> = {
  Escape: 'Esc', Backspace: '⌫', Tab: 'Tab', CapsLock: 'Caps', Enter: '↵',
  ShiftLeft: 'Shift', ShiftRight: 'Shift', ControlLeft: 'Ctrl', ControlRight: 'Ctrl',
  AltLeft: 'Alt', AltRight: 'Alt', MetaLeft: '⊞', MetaRight: '⊞', Space: 'Space',
  ContextMenu: '☰', Backquote: '`', Minus: '-', Equal: '=', BracketLeft: '[',
  BracketRight: ']', Backslash: '\\', Semicolon: ';', Quote: "'", Comma: ',',
  Period: '.', Slash: '/',
  Digit1:'1',Digit2:'2',Digit3:'3',Digit4:'4',Digit5:'5',Digit6:'6',Digit7:'7',Digit8:'8',Digit9:'9',Digit0:'0',
  KeyQ:'Q',KeyW:'W',KeyE:'E',KeyR:'R',KeyT:'T',KeyY:'Y',KeyU:'U',KeyI:'I',KeyO:'O',KeyP:'P',
  KeyA:'A',KeyS:'S',KeyD:'D',KeyF:'F',KeyG:'G',KeyH:'H',KeyJ:'J',KeyK:'K',KeyL:'L',
  KeyZ:'Z',KeyX:'X',KeyC:'C',KeyV:'V',KeyB:'B',KeyN:'N',KeyM:'M',
};

export default function KeyboardTestClient() {
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  const [testedKeys, setTestedKeys] = useState<Set<string>>(new Set());

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    e.preventDefault();
    setPressedKeys(prev => new Set([...prev, e.code]));
    setTestedKeys(prev => new Set([...prev, e.code]));
  }, []);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    setPressedKeys(prev => { const n = new Set(prev); n.delete(e.code); return n; });
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  const reset = () => { setPressedKeys(new Set()); setTestedKeys(new Set()); };

  return (
    <div>
      <div className="glass-card rounded-2xl p-6 mb-6">
        <p className="text-muted-foreground text-sm text-center mb-6">Press any key to test it. Green = tested, Cyan = currently pressed.</p>
        <div className="space-y-2 overflow-x-auto">
          {KEY_ROWS.map((row, ri) => (
            <div key={ri} className="flex gap-1 justify-center">
              {row.map((code) => (
                <div
                  key={code}
                  className={`key-cap flex items-center justify-center h-9 px-2 text-xs font-mono min-w-[36px] transition-all ${
                    pressedKeys.has(code) ? 'key-cap-pressed' : testedKeys.has(code) ?'bg-emerald-500/20 border-emerald-400/60 text-emerald-400' : ''
                  } ${code === 'Space' ? 'min-w-[200px]' : code === 'Backspace' || code === 'Enter' ? 'min-w-[64px]' : ''}`}
                >
                  {KEY_LABELS[code] ?? code.replace('Key','').replace('Digit','')}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-muted-foreground">{testedKeys.size} keys tested</span>
        <button onClick={reset} className="text-xs text-muted-foreground hover:text-primary transition-colors">Reset</button>
      </div>
    </div>
  );
}
