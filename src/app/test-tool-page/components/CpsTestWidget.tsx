'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';

type TestState = 'idle' | 'running' | 'done';

export default function CpsTestWidget() {
  const [testState, setTestState] = useState<TestState>('idle');
  const [clicks, setClicks] = useState(0);
  const [cps, setCps] = useState(0);
  const [timeLeft, setTimeLeft] = useState(5);
  const [bestCps, setBestCps] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);
  const clicksRef = useRef(0);

  const DURATION = 5;

  const endTest = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    const elapsed = (Date.now() - startTimeRef.current) / 1000;
    const finalCps = elapsed > 0 ? parseFloat((clicksRef.current / elapsed).toFixed(2)) : 0;
    setCps(finalCps);
    setBestCps((b) => Math.max(b, finalCps));
    setTestState('done');
  }, []);

  const startTest = useCallback(() => {
    setClicks(0);
    setCps(0);
    setTimeLeft(DURATION);
    clicksRef.current = 0;
    startTimeRef.current = Date.now();
    setTestState('running');

    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          endTest();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }, [endTest]);

  const handleClick = useCallback(() => {
    if (testState === 'idle' || testState === 'done') {
      startTest();
      clicksRef.current = 1;
      setClicks(1);
      return;
    }
    if (testState === 'running') {
      clicksRef.current += 1;
      setClicks(clicksRef.current);
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      if (elapsed > 0) {
        setCps(parseFloat((clicksRef.current / elapsed).toFixed(1)));
      }
    }
  }, [testState, startTest]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const getCpsRating = (c: number) => {
    if (c >= 14) return { label: 'Butterfly Click', color: 'text-primary' };
    if (c >= 10) return { label: 'Jitter Click', color: 'text-violet-400' };
    if (c >= 7) return { label: 'Pro Gamer', color: 'text-amber-400' };
    if (c >= 4) return { label: 'Average', color: 'text-emerald-400' };
    return { label: 'Beginner', color: 'text-muted-foreground' };
  };

  const rating = getCpsRating(cps);

  return (
    <div className="glass-card rounded-2xl p-6 md:p-8">
      <div className="flex flex-col md:flex-row gap-8 items-center">
        {/* Left: info */}
        <div className="flex-1">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2 mb-1">
            <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
            </svg>
            CPS Test
          </h2>
          <p className="text-sm text-muted-foreground mb-6">Click as fast as you can for {DURATION} seconds</p>

          <div className="grid grid-cols-2 gap-3">
            <div className="glass-card rounded-xl p-4 text-center">
              <div className="font-mono text-3xl font-bold text-amber-400">{clicks}</div>
              <div className="text-xs text-muted-foreground mt-1">Clicks</div>
            </div>
            <div className="glass-card rounded-xl p-4 text-center">
              <div className="font-mono text-3xl font-bold text-primary">{testState === 'running' ? timeLeft : DURATION}</div>
              <div className="text-xs text-muted-foreground mt-1">Seconds Left</div>
            </div>
            <div className="glass-card rounded-xl p-4 text-center">
              <div className={`font-mono text-3xl font-bold ${rating.color}`}>{cps}</div>
              <div className="text-xs text-muted-foreground mt-1">CPS</div>
            </div>
            <div className="glass-card rounded-xl p-4 text-center">
              <div className="font-mono text-3xl font-bold text-emerald-400">{bestCps}</div>
              <div className="text-xs text-muted-foreground mt-1">Best CPS</div>
            </div>
          </div>

          {testState === 'done' && (
            <div className="mt-4 glass-card rounded-xl p-4 border border-primary/20">
              <p className="text-sm font-semibold text-foreground">
                Result: <span className={rating.color}>{cps} CPS — {rating.label}</span>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {clicks} total clicks in {DURATION} seconds
              </p>
            </div>
          )}
        </div>

        {/* Right: click zone */}
        <div className="flex-shrink-0">
          <button
            onClick={handleClick}
            className={`w-52 h-52 rounded-full font-bold text-lg transition-all duration-100 select-none relative overflow-hidden
              ${testState === 'running' ?'bg-primary text-primary-foreground glow-cyan scale-100 active:scale-95'
                : testState === 'done' ?'bg-emerald-500/20 border-2 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/30' :'glass-card border-2 border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/60'
              }
            `}
            aria-label="Click to test CPS"
          >
            <span className="relative z-10 flex flex-col items-center gap-1">
              {testState === 'idle' && (
                <>
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                  </svg>
                  <span className="text-sm">Click to Start</span>
                </>
              )}
              {testState === 'running' && (
                <>
                  <span className="cps-counter">{cps}</span>
                  <span className="text-sm font-medium opacity-80">CPS</span>
                </>
              )}
              {testState === 'done' && (
                <>
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                  </svg>
                  <span className="text-sm">Try Again</span>
                </>
              )}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}