'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';

// ─── Word Banks ───────────────────────────────────────────────────────────────
const EASY_WORDS = [
  'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'it', 'for', 'not', 'on', 'with', 'he',
  'as', 'you', 'do', 'at', 'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she', 'or',
  'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what', 'so', 'up', 'out', 'if', 'about',
  'who', 'get', 'which', 'go', 'me', 'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know',
  'take', 'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other', 'than', 'then',
  'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also', 'back', 'after', 'use', 'two', 'how', 'our',
  'work', 'first', 'well', 'way', 'even', 'new', 'want', 'because', 'any', 'these', 'give', 'day', 'most', 'us',
  'great', 'between', 'need', 'large', 'often', 'hand', 'high', 'place', 'hold', 'turn', 'help', 'press',
  'problem', 'move', 'play', 'small', 'number', 'off', 'always', 'next', 'food', 'keep', 'children', 'feet',
  'land', 'side', 'without', 'boy', 'once', 'animal', 'life', 'enough', 'took', 'four', 'head', 'above',
];

const MEDIUM_WORDS = [
  'The', 'Quick', 'Brown', 'Fox', 'Jumps', 'Over', 'Lazy', 'Dog', 'Hello', 'World',
  'JavaScript', 'Python', 'React', 'Next.js', 'TypeScript', 'HTML', 'CSS', 'API',
  'function', 'return', 'const', 'let', 'var', 'class', 'import', 'export',
  'Hello!', 'World?', 'Great.', 'Fast,', 'Quick;', 'Type:', 'Code!', 'Test?',
  'Alpha', 'Beta', 'Gamma', 'Delta', 'Sigma', 'Omega', 'Lambda', 'Theta',
  'Running', 'Jumping', 'Flying', 'Coding', 'Testing', 'Building', 'Creating',
  'Database', 'Network', 'Server', 'Client', 'Browser', 'Interface', 'Component',
  'Array', 'Object', 'String', 'Number', 'Boolean', 'Promise', 'Async', 'Await',
  'Error!', 'Debug?', 'Fix:', 'Build.', 'Deploy!', 'Launch?', 'Ship;', 'Done.',
  'Performance', 'Optimization', 'Algorithm', 'Structure', 'Framework', 'Library',
  'Variable', 'Constant', 'Function', 'Method', 'Property', 'Parameter', 'Argument',
  'Module', 'Package', 'Version', 'Update', 'Install', 'Configure', 'Setup',
];

const HARD_WORDS = [
  'Th3', 'qu1ck', 'Br0wn', 'F0x!', 'Jump5', '0ver', 'L@zy', 'D0g.',
  'H3ll0!', 'W0rld?', 'J@v@Script', 'Pyth0n3', 'R3@ct18', 'N3xt.js',
  'Typ3Script5', 'HTM5!', 'CSS3?', '@PI_v2',
  'func710n()', 'r3turn;', 'c0nst_1', 'l3t_2', 'v@r_3', 'cl@ss{}',
  '1mp0rt*', 'exp0rt{};',
  'H3ll0!W0rld', 'Qu1ck#Br0wn', 'F0x$Jump5', '0ver@L@zy',
  '@lph@1', 'B3t@2', 'G@mm@3', 'D3lt@4', 'S1gm@5', '0m3g@6',
  'R#nn1ng!', 'Jump1ng?', 'Fly1ng:', 'C0d1ng;', 'T3st1ng.',
  'D@t@b@se1', 'N3tw0rk2', 'S3rv3r3', 'Cl13nt4', 'Br0ws3r5',
  '@rr@y[]', '0bj3ct{}', 'Str1ng""', 'Numb3r42', 'B00l3@n',
  'Pr0m1se()', '@sync/Aw@1t', '3rr0r!', 'D3bug?', 'F1x:',
  'P3rf0rm@nc3', '0pt1m1z@t10n', '@lg0r1thm', 'Fr@m3w0rk',
  'V@r1@bl3_1', 'C0nst@nt_2', 'Funct10n_3', 'M3th0d_4',
  'M0dul3#1', 'P@ck@g3#2', 'V3rs10n#3', 'Upd@t3!', '1nst@ll?',
];

const PASSAGES: Record<Difficulty, string[]> = {
  easy: [
    'it was a bright cold day and the clocks were striking thirteen the small town waited for the morning sun and every window held a quiet light',
    'the road went on through the wood where leaves turned in the wind and a river moved beside the fields under a clear sky',
    'there was once a little garden behind an old house and every day the child watched new flowers open in the warm air',
  ],
  medium: [
    'Alice was beginning to get very tired of sitting by her sister on the bank. The afternoon was warm and still.',
    'The evening was calm. A traveler watched the lights appear beyond the bridge. The road ahead looked familiar.',
    'Call me Ishmael. Some years ago I thought I would sail about a little and see the watery part of the world.',
  ],
  hard: [
    '“At 7:45 p.m.,” the captain wrote, “we counted 12 bright stars; however, the north-west wind rose to 18 km/h.”',
    'Mrs. Grey asked, “Can 3 friends carry 2 bags, a map, and a lantern?” The answer was: “Yes—if they walk slowly.”',
    'In Chapter 4, the note read: [Keep left; cross at 9:30; bring £5.00.] Nobody questioned the unusual instructions.',
  ],
};

// ─── Types ────────────────────────────────────────────────────────────────────
type Difficulty = 'easy' | 'medium' | 'hard';
type Duration = 2 | 5 | 10;
type TestState = 'idle' | 'running' | 'finished';

interface TestResults {
  grossWpm: number;
  netWpm: number;
  cpm: number;
  accuracy: number;
  correctChars: number;
  incorrectChars: number;
  totalChars: number;
  mistakes: number;
  elapsedTime: number;
  timeRemaining: number;
  testDuration: number;
  wordsTyped: number;
  correctWords: number;
  incorrectWords: number;
  backspacesUsed: number;
  longestStreak: number;
  currentStreak: number;
  grade: string;
  difficulty: Difficulty;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function generateText(difficulty: Difficulty, count: number = 120): string {
  const passages = PASSAGES[difficulty];
  const words: string[] = [];
  while (words.length < count) words.push(...passages[Math.floor(Math.random() * passages.length)].split(' '));
  return words.slice(0, count).join(' ');
}

function getGrade(netWpm: number, accuracy: number): string {
  const score = netWpm * (accuracy / 100);
  if (score >= 100) return 'A+';
  if (score >= 80) return 'A';
  if (score >= 65) return 'B+';
  if (score >= 50) return 'B';
  if (score >= 35) return 'C+';
  if (score >= 20) return 'C';
  return 'D';
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

// ─── Certificate Generator ───────────────────────────────────────────────────
function openCertificateGenerator(results: TestResults) {
  try {
    sessionStorage.setItem('testappara:typing-result', JSON.stringify(results));
  } catch {}
  window.location.href = '/certificate-generator';
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function TypingTest() {
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [duration, setDuration] = useState<Duration>(1 as Duration);
  const [testState, setTestState] = useState<TestState>('idle');
  const [text, setText] = useState<string>('');
  const [typed, setTyped] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [startTime, setStartTime] = useState<number>(0);
  const [results, setResults] = useState<TestResults | null>(null);
  const [backspaces, setBackspaces] = useState<number>(0);
  const [currentStreak, setCurrentStreak] = useState<number>(0);
  const [longestStreak, setLongestStreak] = useState<number>(0);
  const [liveWpm, setLiveWpm] = useState<number>(0);
  const [wpmHistory, setWpmHistory] = useState<number[]>([]);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const testAreaRef = useRef<HTMLDivElement>(null);
  const activeCharRef = useRef<HTMLSpanElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const durationSeconds = (duration as number) * 60;

  // Bring the actual test area into view when the page opens so users can start immediately.
  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const textViewport = testAreaRef.current?.querySelector<HTMLElement>('[data-typing-text]');
      textViewport?.scrollIntoView({ behavior: 'auto', block: 'start' });
      inputRef.current?.focus({ preventScroll: true });
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  // Keep the current typing position visible inside the text viewport, especially on mobile.
  useEffect(() => {
    const container = testAreaRef.current?.querySelector<HTMLElement>('[data-typing-text]');
    const active = activeCharRef.current;
    if (!container || !active) return;

    const padding = Math.max(16, container.clientHeight * 0.2);
    const containerRect = container.getBoundingClientRect();
    const activeRect = active.getBoundingClientRect();
    const activeTop = activeRect.top - containerRect.top + container.scrollTop;
    const activeBottom = activeRect.bottom - containerRect.top + container.scrollTop;
    const visibleTop = container.scrollTop + padding;
    const visibleBottom = container.scrollTop + container.clientHeight - padding;

    if (activeBottom > visibleBottom) {
      container.scrollTop = Math.max(0, activeBottom - container.clientHeight + padding);
    } else if (activeTop < visibleTop) {
      container.scrollTop = Math.max(0, activeTop - padding);
    }
  }, [typed, text]);

  // Initialize text
  useEffect(() => {
    setText(generateText(difficulty, 200));
  }, [difficulty]);

  // Timer
  useEffect(() => {
    if (testState === 'running') {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            finishTest();
            return 0;
          }
          return prev - 1;
        });
        // Live WPM update every second
        setWpmHistory((prev) => {
          const elapsed = (durationSeconds - timeLeft + 1) / 60;
          if (elapsed <= 0) return prev;
          const grossWpm = Math.round((typed.length / 5) / elapsed);
          setLiveWpm(grossWpm);
          return [...prev, grossWpm].slice(-60);
        });
      }, 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [testState]);

  const finishTest = useCallback(() => {
    setTestState('finished');
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  // Compute results when finished
  useEffect(() => {
    if (testState !== 'finished') return;
    const elapsed = durationSeconds - timeLeft;
    const minutes = Math.max(elapsed / 60, 0.01);

    // Character analysis
    let correctChars = 0;
    let incorrectChars = 0;
    for (let i = 0; i < typed.length; i++) {
      if (typed[i] === text[i]) correctChars++;
      else incorrectChars++;
    }
    const totalChars = typed.length;
    const mistakes = incorrectChars;

    // WPM calculations
    const grossWpm = Math.round((totalChars / 5) / minutes);
    const errorsPerMinute = mistakes / minutes;
    const netWpm = Math.max(0, Math.round(grossWpm - errorsPerMinute));
    const cpm = Math.round(correctChars / minutes);
    const accuracy = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 0;

    // Word analysis
    const typedWords = typed.trim().split(/\s+/).filter(Boolean);
    const textWords = text.split(/\s+/);
    let correctWords = 0;
    let incorrectWords = 0;
    typedWords.forEach((w, i) => {
      if (w === textWords[i]) correctWords++;
      else incorrectWords++;
    });

    const grade = getGrade(netWpm, accuracy);

    setResults({
      grossWpm, netWpm, cpm, accuracy,
      correctChars, incorrectChars, totalChars, mistakes,
      elapsedTime: elapsed, timeRemaining: timeLeft,
      testDuration: duration as number,
      wordsTyped: typedWords.length,
      correctWords, incorrectWords,
      backspacesUsed: backspaces,
      longestStreak, currentStreak,
      grade, difficulty,
    });
  }, [testState]);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;

    if (testState === 'idle' && val.length > 0) {
      setTestState('running');
      setStartTime(Date.now());
    }

    if (testState !== 'running' && testState !== 'idle') return;

    // Detect backspace
    if (val.length < typed.length) {
      setBackspaces((b) => b + 1);
      setCurrentStreak(0);
    } else {
      // Check if new char is correct
      const idx = val.length - 1;
      if (val[idx] === text[idx]) {
        setCurrentStreak((s) => {
          const next = s + 1;
          setLongestStreak((l) => Math.max(l, next));
          return next;
        });
      } else {
        setCurrentStreak(0);
      }
    }

    setTyped(val);

    // Auto-finish if all text typed
    if (val.length >= text.length) {
      finishTest();
    }
  };

  const handleReset = () => {
    setTestState('idle');
    setTyped('');
    setTimeLeft(durationSeconds);
    setResults(null);
    setBackspaces(0);
    setCurrentStreak(0);
    setLongestStreak(0);
    setLiveWpm(0);
    setWpmHistory([]);
    setText(generateText(difficulty, 200));
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  // Reset when difficulty/duration changes
  useEffect(() => {
    handleReset();
  }, [difficulty, duration]);

  // Render text with color coding
  const renderText = () => {
    const tokens = text.split(/(\s+)/);
    let charIndex = 0;

    return tokens.map((token, tokenIndex) => {
      if (!token) return null;

      const isWhitespace = /^\s+$/.test(token);
      if (isWhitespace) {
        const start = charIndex;
        charIndex += token.length;
        return (
          <span key={`space-${tokenIndex}`} className="whitespace-pre">
            {token.split('').map((char, offset) => {
              const i = start + offset;
              const cls = i < typed.length
                ? (typed[i] === char ? 'text-emerald-400' : 'text-rose-400 bg-rose-500/20 rounded-sm')
                : i === typed.length ? 'text-foreground border-b-2 border-primary animate-pulse' : 'text-muted-foreground/50';
              return <span key={i} ref={i === typed.length ? activeCharRef : undefined} className={cls}>{char}</span>;
            })}
          </span>
        );
      }

      const start = charIndex;
      charIndex += token.length;
      return (
        <span key={`word-${tokenIndex}`} className="inline-block whitespace-nowrap">
          {token.split('').map((char, offset) => {
            const i = start + offset;
            let cls = 'text-muted-foreground/50';
            if (i < typed.length) {
              cls = typed[i] === char ? 'text-emerald-400' : 'text-rose-400 bg-rose-500/20 rounded-sm';
            } else if (i === typed.length) {
              cls = 'text-foreground border-b-2 border-primary animate-pulse';
            }
            return <span key={i} ref={i === typed.length ? activeCharRef : undefined} className={cls}>{char}</span>;
          })}
        </span>
      );
    });
  };

  const progressPct = ((durationSeconds - timeLeft) / durationSeconds) * 100;

  return (
    <div ref={testAreaRef} className="space-y-6 scroll-mt-[84px]">
      {/* Controls */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <span className="text-2xl">⌨️</span> Typing Speed Test
            </h2>
            <p className="text-sm text-muted-foreground mt-0.5">Start typing to begin the test automatically</p>
          </div>
          {/* Live WPM */}
          {testState === 'running' && (
            <div className="glass-card rounded-xl px-5 py-2 text-center">
              <div className="font-mono text-3xl font-bold text-primary">{liveWpm}</div>
              <div className="text-xs text-muted-foreground">Live WPM</div>
            </div>
          )}
        </div>

        {/* Difficulty + Duration selectors */}
        <div className="flex flex-wrap gap-4 mt-5">
          <div>
            <p className="text-xs text-muted-foreground mb-2 font-semibold uppercase tracking-wider">Difficulty</p>
            <div className="flex gap-2">
              {(['easy', 'medium', 'hard'] as Difficulty[]).map((d) => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  disabled={testState === 'running'}
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all capitalize
                    ${difficulty === d
                      ? d === 'easy' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : d === 'medium'? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' :'bg-rose-500/20 text-rose-400 border border-rose-500/40' :'glass-card text-muted-foreground hover:text-foreground'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-2 font-semibold uppercase tracking-wider">Duration</p>
            <div className="flex gap-2">
              {([2, 5, 10] as Duration[]).map((d) => (
                <button
                  key={d}
                  onClick={() => setDuration(d)}
                  disabled={testState === 'running'}
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all
                    ${duration === d
                      ? 'bg-primary/20 text-primary border border-primary/40' :'glass-card text-muted-foreground hover:text-foreground'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {d}m
                </button>
              ))}
            </div>
          </div>
          <div className="ml-auto flex items-end">
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 glass-card rounded-full px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
              Reset
            </button>
          </div>
        </div>

        {/* Timer + Progress */}
        <div className="mt-5">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-2xl font-bold text-primary">{formatTime(timeLeft)}</span>
            <span className="text-xs text-muted-foreground font-mono">
              {testState === 'idle' ? 'Ready' : testState === 'running' ? 'Running...' : 'Finished'}
            </span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-1000"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Test Area */}
      {testState !== 'finished' && (
        <div className="glass-card rounded-2xl p-6">
          {/* Text display */}
          <div
            data-typing-text
            className="font-mono text-base leading-8 mb-4 p-4 bg-muted/30 rounded-xl max-h-40 overflow-y-auto overflow-x-hidden select-none overscroll-contain"
            style={{ wordBreak: 'normal', overflowWrap: 'normal' }}
          >
            {renderText()}
          </div>
          {/* Input */}
          <textarea
            ref={inputRef}
            value={typed}
            onChange={handleInput}
            disabled={testState === 'finished'}
            placeholder={testState === 'idle' ? 'Start typing here to begin the test...' : ''}
            className="w-full rounded-xl border border-slate-300 bg-white p-4 font-mono text-sm text-black placeholder:text-slate-500 shadow-inner resize-none transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            rows={3}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
          />
          {/* Live stats */}
          {testState === 'running' && (
            <div className="flex flex-wrap gap-4 mt-3">
              {[
                { label: 'Characters', value: typed.length },
                { label: 'Backspaces', value: backspaces },
                { label: 'Streak', value: currentStreak },
                { label: 'Best Streak', value: longestStreak },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <div className="font-mono text-lg font-bold text-foreground">{s.value}</div>
                  <div className="text-xs text-muted-foreground">{s.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Results */}
      {testState === 'finished' && results && (
        <ResultsPanel results={results} onRetry={handleReset} />
      )}
    </div>
  );
}

// ─── Results Panel ────────────────────────────────────────────────────────────
function ResultsPanel({ results, onRetry }: { results: TestResults; onRetry: () => void }) {
  const gradeColors: Record<string, string> = {
    'A+': 'text-primary border-primary/40 bg-primary/10',
    'A': 'text-cyan-400 border-cyan-400/40 bg-cyan-400/10',
    'B+': 'text-violet-400 border-violet-400/40 bg-violet-400/10',
    'B': 'text-indigo-400 border-indigo-400/40 bg-indigo-400/10',
    'C+': 'text-amber-400 border-amber-400/40 bg-amber-400/10',
    'C': 'text-orange-400 border-orange-400/40 bg-orange-400/10',
    'D': 'text-rose-400 border-rose-400/40 bg-rose-400/10',
  };
  const gradeColor = gradeColors[results.grade] || gradeColors['D'];

  return (
    <div className="mx-auto max-w-3xl glass-card rounded-2xl p-6 md:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8 pb-2">
        <div>
          <h3 className="text-2xl font-bold text-foreground flex items-center gap-2">
            🏆 Typing Results
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            {results.difficulty.charAt(0).toUpperCase() + results.difficulty.slice(1)} difficulty •{' '}
            {results.testDuration} minute test
          </p>
        </div>
        <div className={`w-20 h-20 rounded-2xl border-2 flex flex-col items-center justify-center ${gradeColor}`}>
          <span className="text-3xl font-bold font-mono">{results.grade}</span>
          <span className="text-xs opacity-70">Grade</span>
        </div>
      </div>

      {/* Primary metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Net WPM', value: results.netWpm, color: 'text-primary', sub: 'Primary Score' },
          { label: 'Gross WPM', value: results.grossWpm, color: 'text-violet-400', sub: 'Raw Speed' },
          { label: 'Accuracy', value: `${results.accuracy}%`, color: 'text-emerald-400', sub: 'Precision' },
          { label: 'CPM', value: results.cpm, color: 'text-amber-400', sub: 'Chars/Min' },
        ].map((m) => (
          <div key={m.label} className="glass-card rounded-xl p-4 text-center">
            <div className={`font-mono text-3xl font-bold ${m.color}`}>{m.value}</div>
            <div className="text-sm font-semibold text-foreground mt-1">{m.label}</div>
            <div className="text-xs text-muted-foreground">{m.sub}</div>
          </div>
        ))}
      </div>

      {/* Detailed metrics grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Accuracy section */}
        <div className="glass-card rounded-xl p-4 space-y-3">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Accuracy</h4>
          {[
            { label: 'Correct Characters', value: results.correctChars, color: 'text-emerald-400' },
            { label: 'Incorrect Characters', value: results.incorrectChars, color: 'text-rose-400' },
            { label: 'Total Characters', value: results.totalChars, color: 'text-foreground' },
            { label: 'Mistakes', value: results.mistakes, color: 'text-rose-400' },
          ].map((r) => (
            <div key={r.label} className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{r.label}</span>
              <span className={`font-mono font-bold ${r.color}`}>{r.value}</span>
            </div>
          ))}
        </div>

        {/* Time section */}
        <div className="glass-card rounded-xl p-4 space-y-3">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Time</h4>
          {[
            { label: 'Elapsed Time', value: formatTime(results.elapsedTime), color: 'text-primary' },
            { label: 'Time Remaining', value: formatTime(results.timeRemaining), color: 'text-muted-foreground' },
            { label: 'Test Duration', value: `${results.testDuration} min`, color: 'text-foreground' },
          ].map((r) => (
            <div key={r.label} className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{r.label}</span>
              <span className={`font-mono font-bold ${r.color}`}>{r.value}</span>
            </div>
          ))}
        </div>

        {/* Statistics section */}
        <div className="glass-card rounded-xl p-4 space-y-3">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Statistics</h4>
          {[
            { label: 'Words Typed', value: results.wordsTyped, color: 'text-foreground' },
            { label: 'Correct Words', value: results.correctWords, color: 'text-emerald-400' },
            { label: 'Incorrect Words', value: results.incorrectWords, color: 'text-rose-400' },
            { label: 'Backspaces Used', value: results.backspacesUsed, color: 'text-amber-400' },
            { label: 'Longest Streak', value: results.longestStreak, color: 'text-violet-400' },
            { label: 'Current Streak', value: results.currentStreak, color: 'text-primary' },
          ].map((r) => (
            <div key={r.label} className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{r.label}</span>
              <span className={`font-mono font-bold ${r.color}`}>{r.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* WPM Progress bar visual */}
      <div className="glass-card rounded-xl p-4">
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Performance Breakdown</h4>
        <div className="space-y-3">
          {[
            { label: 'Net WPM', value: results.netWpm, max: 200, color: 'bg-primary' },
            { label: 'Gross WPM', value: results.grossWpm, max: 200, color: 'bg-violet-500' },
            { label: 'Accuracy', value: results.accuracy, max: 100, color: 'bg-emerald-500' },
          ].map((bar) => (
            <div key={bar.label} className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground w-20 shrink-0">{bar.label}</span>
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full ${bar.color} rounded-full transition-all duration-1000`}
                  style={{ width: `${Math.min(100, (bar.value / bar.max) * 100)}%` }}
                />
              </div>
              <span className="font-mono text-sm font-bold text-foreground w-12 text-right">{bar.value}{bar.label === 'Accuracy' ? '%' : ''}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground rounded-full px-6 py-2.5 text-sm font-semibold hover:bg-primary/90 transition-all"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
          Try Again
        </button>
        <button
          onClick={() => openCertificateGenerator(results)}
          className="inline-flex items-center gap-2 glass-card rounded-full px-6 py-2.5 text-sm font-semibold text-foreground hover:border-primary/40 hover:text-primary transition-all"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          Download Certificate
        </button>
      </div>
    </div>
  );
}
