'use client';

import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';
import { useState } from 'react';

const columns = [
  { title: 'Keyboard', links: [['Keyboard Test', '/keyboard-test'], ['Spacebar Test', '/spacebar-test'], ['Typing Speed', '/typing-speed-test']] },
  { title: 'Mouse', links: [['Mouse Test', '/mouse-test'], ['CPS Test', '/cps-test'], ['Mouse Accuracy', '/mouse-accuracy-test'], ['DPI Estimator', '/mouse-dpi-estimator'], ['Polling Rate', '/mouse-polling-rate-test'], ['Scroll Test', '/scroll-test'], ['Double Click', '/double-click-test'], ['Jitter Click', '/jitter-click-test'], ['Butterfly Click', '/butterfly-click-test'], ['Drag Click', '/drag-click-test']] },
  { title: 'Network', links: [['Internet Speed', '/internet-speed-test'], ['Latency Test', '/latency-test'], ['Browser Test', '/browser-test']] },
  { title: 'Display', links: [['Dead Pixel Test', '/dead-pixel-test'], ['Monitor Test', '/monitor-test'], ['Reaction Time', '/reaction-time-test']] },
  { title: 'Devices', links: [['Gamepad Test', '/gamepad-test'], ['Microphone Test', '/microphone-test'], ['Speaker Test', '/speaker-test'], ['Webcam Test', '/webcam-test'], ['Touchscreen Test', '/touchscreen-test']] },
  { title: 'Tools', links: [['Full Device Test', '/device-test-series'], ['Property Share Calculator', '/hissa-calculator']] },
] as const;

export default function Footer() {
  const [openColumn, setOpenColumn] = useState<string | null>(null);

  return (
    <footer className="border-t border-border bg-background">
        <div className="mx-auto max-w-[1280px] px-5 py-8 sm:px-6 lg:py-9">
          <div className="flex flex-col items-center text-center">
            <Link href="/" className="inline-flex items-center gap-2">
              <AppLogo size={28} />
            </Link>
            <p className="mt-2 max-w-md text-[11px] leading-5 text-foreground/45">Free online tools to test your gear. No downloads, instant results.</p>
            <Link href="/test-tool-page" className="mt-2 text-[11px] font-semibold text-primary transition-colors hover:text-foreground">View all 24 tests →</Link>
          </div>

          <div className="mt-8 space-y-2 sm:hidden">
            {columns.map((column) => {
              const isOpen = openColumn === column.title;
              return (
                <div key={column.title} className="overflow-hidden rounded-xl border border-border/80 bg-card/30">
                  <button type="button" onClick={() => setOpenColumn(isOpen ? null : column.title)} className="flex w-full items-center justify-between px-4 py-3.5 text-left text-xs font-bold uppercase tracking-[0.12em] text-foreground/70 transition-colors hover:bg-primary/10 hover:text-primary" aria-expanded={isOpen}>
                    <span>{column.title}</span><span className={`text-sm text-foreground/45 transition-transform ${isOpen ? 'rotate-180' : ''}`}>⌄</span>
                  </button>
                  {isOpen && <ul className="border-t border-border/70 px-3 py-2">{column.links.map(([label, href]) => <li key={href}><Link href={href} className="block rounded-lg px-3 py-2.5 text-sm text-foreground/65 transition-colors hover:bg-primary/10 hover:text-primary">{label}</Link></li>)}</ul>}
                </div>
              );
            })}
          </div>

          <div className="mt-8 hidden grid-cols-2 gap-x-5 gap-y-7 text-center sm:grid sm:grid-cols-3 lg:grid-cols-6 lg:gap-x-8">
            {columns.map((column) => (
              <div key={column.title} className="min-w-0">
                <h2 className="mb-2.5 text-[10px] font-bold uppercase tracking-[0.14em] text-foreground/45">{column.title}</h2>
                <ul className="space-y-1.5">{column.links.map(([label, href]) => <li key={href}><Link href={href} className="text-[11px] leading-5 text-foreground/60 transition-colors hover:text-primary">{label}</Link></li>)}</ul>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-border/80">
          <div className="mx-auto flex max-w-[1280px] flex-col items-center px-5 py-5 text-center sm:px-6">
            <nav aria-label="Footer navigation" className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px] font-medium text-foreground/60">
              <Link href="/about" className="transition-colors hover:text-primary">About</Link>
              <span className="text-foreground/20" aria-hidden="true">|</span>
              <Link href="/privacy" className="transition-colors hover:text-primary">Privacy</Link>
              <span className="text-foreground/20" aria-hidden="true">|</span>
              <Link href="/terms" className="transition-colors hover:text-primary">Terms</Link>
              <span className="text-foreground/20" aria-hidden="true">|</span>
              <Link href="/faq" className="transition-colors hover:text-primary">FAQ</Link>
            </nav>
            <div className="mt-4 w-full border-t border-border/70 pt-4">
              <p className="text-[10px] leading-5 text-foreground/40">© 2026 TestAppara. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
  );
}
