'use client';

import Link from 'next/link';
import { useState } from 'react';

type Category = 'Keyboard' | 'Mouse' | 'Network' | 'Display' | 'Devices';
type Test = { name: string; description: string; href: string; category: Category; icon: string };
const tests: Test[] = [
  { name: 'Keyboard Test', description: 'Test every key with multiple layouts.', href: '/keyboard-test', category: 'Keyboard', icon: '⌨️' }, { name: 'Typing Speed', description: 'Measure your WPM and accuracy.', href: '/typing-speed-test', category: 'Keyboard', icon: '📝' }, { name: 'Spacebar Test', description: 'Count spacebar presses per second.', href: '/spacebar-test', category: 'Keyboard', icon: '⎵' },
  { name: 'Mouse Test', description: 'Test all mouse buttons and scroll wheel.', href: '/mouse-test', category: 'Mouse', icon: '🖱️' }, { name: 'CPS Test', description: 'Measure your clicks per second.', href: '/cps-test', category: 'Mouse', icon: '⚡' }, { name: 'Mouse Accuracy', description: 'Test your precision and targeting.', href: '/mouse-accuracy-test', category: 'Mouse', icon: '🎯' }, { name: 'DPI Estimator', description: 'Estimate mouse DPI without software.', href: '/mouse-dpi-estimator', category: 'Mouse', icon: '📐' }, { name: 'Polling Rate', description: 'Check your mouse polling rate in Hz.', href: '/mouse-polling-rate-test', category: 'Mouse', icon: '📡' }, { name: 'Scroll Test', description: 'Test scroll wheel smoothness and speed.', href: '/scroll-test', category: 'Mouse', icon: '↕️' }, { name: 'Double Click Test', description: 'Test double-click consistency.', href: '/double-click-test', category: 'Mouse', icon: '🖱️' }, { name: 'Jitter Click Test', description: 'Measure your jitter clicking technique.', href: '/jitter-click-test', category: 'Mouse', icon: '⚡' }, { name: 'Butterfly Click', description: 'Test your butterfly clicking speed.', href: '/butterfly-click-test', category: 'Mouse', icon: '🦋' }, { name: 'Drag Click Test', description: 'Test your drag clicking technique.', href: '/drag-click-test', category: 'Mouse', icon: '↔️' },
  { name: 'Internet Speed', description: 'Test your download and upload speeds.', href: '/internet-speed-test', category: 'Network', icon: '🌐' }, { name: 'Latency Test', description: 'Measure your network ping and latency.', href: '/latency-test', category: 'Network', icon: '📶' }, { name: 'Browser Test', description: 'Check browser capabilities and info.', href: '/browser-test', category: 'Network', icon: '🌍' },
  { name: 'Dead Pixel Test', description: 'Find dead or stuck pixels on your monitor.', href: '/dead-pixel-test', category: 'Display', icon: '🖥️' }, { name: 'Monitor Test', description: 'Comprehensive display quality testing.', href: '/monitor-test', category: 'Display', icon: '📺' }, { name: 'Reaction Time', description: 'Test reaction speed in milliseconds.', href: '/reaction-time-test', category: 'Display', icon: '⚡' },
  { name: 'Gamepad Test', description: 'Test controller buttons and axes.', href: '/gamepad-test', category: 'Devices', icon: '🎮' }, { name: 'Microphone Test', description: 'Check if your microphone is working.', href: '/microphone-test', category: 'Devices', icon: '🎙️' }, { name: 'Speaker Test', description: 'Test speakers and audio output.', href: '/speaker-test', category: 'Devices', icon: '🔊' }, { name: 'Webcam Test', description: 'Check webcam video and resolution.', href: '/webcam-test', category: 'Devices', icon: '📷' }, { name: 'Touchscreen Test', description: 'Test touchscreen responsiveness.', href: '/touchscreen-test', category: 'Devices', icon: '☝️' },
];
const filters = ['All', 'Keyboard', 'Mouse', 'Network', 'Display', 'Devices'] as const;

export default function TestDirectory() {
  const [filter, setFilter] = useState<(typeof filters)[number]>('All');
  const visible = filter === 'All' ? tests : tests.filter((test) => test.category === filter);
  const popularTests = tests.filter((test) =>
    ['/keyboard-test', '/typing-speed-test', '/internet-speed-test'].includes(test.href)
  );

  return (
    <section className="relative isolate overflow-hidden tw-directory-glow">
      <div
        aria-hidden
        className="tw-directory-grid pointer-events-none absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.025)_1px,transparent_1px)] [background-size:44px_44px]"
      />
      <div className="relative mx-auto max-w-[1320px] px-5 py-12 lg:px-7">
        <div className="mb-10 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">TestAppara tools</p>
            <h1 className="mt-2 text-4xl font-bold text-foreground">
              Test your gear. <span className="text-primary">Instantly.</span>
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-foreground/60">
              Explore {tests.length}+ free browser-based tests for your keyboard, mouse, display,
              network and devices. No downloads, no account, and results stay on your device.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 lg:justify-end">
            {filters.map((item) => (
              <button
                key={item}
                onClick={() => setFilter(item)}
                className={`rounded-full border px-4 py-2 text-sm font-semibold ${
                  filter === item
                    ? 'border-primary bg-primary text-black'
                    : 'border-border bg-foreground/5 text-foreground/65 hover:border-border hover:text-foreground'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Popular tests intentionally appear before the full tool directory. */}
        <section aria-labelledby="popular-tests-heading" className="mb-12">
          <h2 id="popular-tests-heading" className="mb-5 text-2xl font-bold text-foreground">
            Popular Tests
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            {popularTests.map((test) => (
              <Link
                key={test.href}
                href={test.href}
                className="flex items-center gap-5 rounded-2xl border border-border bg-card p-6 hover:border-primary/60"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-2xl">
                  {test.icon}
                </span>
                <div>
                  <h3 className="font-bold text-foreground">{test.name}</h3>
                  <p className="mt-1 text-sm text-foreground/50">{test.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <h2 className="mb-5 text-2xl font-bold text-foreground">All Tests</h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {visible.map((test) => (
            <Link
              key={test.href}
              href={test.href}
              className="group min-h-[150px] rounded-2xl border border-border bg-card p-6 transition hover:-translate-y-0.5 hover:border-primary/60 hover:bg-card"
            >
              <div className="flex gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-primary/25 bg-primary/10 text-xl">
                  {test.icon}
                </span>
                <div>
                  <h2 className="font-bold text-foreground">{test.name}</h2>
                  <p className="mt-1 text-sm leading-5 text-foreground/50">{test.description}</p>
                </div>
              </div>
              <div className="mt-5 flex items-center justify-between">
                <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
                  {test.category}
                </span>
                <span className="text-lg text-foreground/40 transition group-hover:translate-x-1 group-hover:text-primary">
                  ›
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 min-h-[140px] rounded-xl border border-dashed border-border bg-foreground/[0.02] text-center text-xs leading-[140px] text-foreground/30">
          Advertisement
        </div>
      </div>
    </section>
  );
}
