import React from 'react';
import Link from 'next/link';

function HeroVisual() {
  return (
    <div className="tw-hero-visual" aria-label="Illustration of a computer setup with a monitor, laptop, keyboard, mouse and network router">
      <div className="tw-hero-visual-glow" />
      <div className="tw-hero-visual-badge"><span className="tw-hero-dot" /> LIVE DEVICE CHECK</div>
      <svg viewBox="0 0 620 460" role="img" aria-hidden="true" className="relative z-10 h-auto w-full">
        <defs>
          <linearGradient id="heroMonitor" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor="var(--hero-screen-top)" />
            <stop offset="1" stopColor="var(--hero-screen-bottom)" />
          </linearGradient>
          <linearGradient id="heroBody" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor="var(--hero-body-top)" />
            <stop offset="1" stopColor="var(--hero-body-bottom)" />
          </linearGradient>
          <linearGradient id="heroAccent" x1="0" x2="1">
            <stop offset="0" stopColor="var(--hero-accent)" />
            <stop offset="1" stopColor="var(--hero-accent-2)" />
          </linearGradient>
          <filter id="heroShadow" x="-30%" y="-30%" width="160%" height="170%">
            <feDropShadow dx="0" dy="18" stdDeviation="18" floodColor="var(--hero-shadow)" floodOpacity=".28" />
          </filter>
        </defs>

        <ellipse cx="312" cy="405" rx="255" ry="24" fill="var(--hero-floor)" />

        <g filter="url(#heroShadow)">
          <rect x="110" y="62" width="300" height="205" rx="20" fill="var(--hero-frame)" stroke="var(--hero-border)" strokeWidth="2" />
          <rect x="127" y="79" width="266" height="167" rx="13" fill="url(#heroMonitor)" />
          <path d="M145 213 C195 176 220 180 252 196 C288 214 320 191 344 173 C362 159 378 161 393 172 V246 H127 V225 C134 221 139 217 145 213Z" fill="var(--hero-chart-fill)" opacity=".55" />
          <path d="M151 204 C190 177 220 188 249 200 C285 214 318 185 349 168 C366 159 378 158 389 164" fill="none" stroke="url(#heroAccent)" strokeWidth="5" strokeLinecap="round" />
          <circle cx="154" cy="104" r="5" fill="var(--hero-accent)" />
          <circle cx="171" cy="104" r="5" fill="var(--hero-accent-2)" opacity=".7" />
          <circle cx="188" cy="104" r="5" fill="var(--hero-muted)" />
          <rect x="154" y="130" width="80" height="9" rx="4.5" fill="var(--hero-muted)" opacity=".9" />
          <rect x="154" y="148" width="128" height="7" rx="3.5" fill="var(--hero-muted)" opacity=".55" />
          <rect x="154" y="164" width="105" height="7" rx="3.5" fill="var(--hero-muted)" opacity=".45" />
          <rect x="154" y="187" width="52" height="26" rx="13" fill="url(#heroAccent)" />
          <path d="M260 267h70l18 64H242l18-64Z" fill="url(#heroBody)" stroke="var(--hero-border)" strokeWidth="2" />
          <rect x="214" y="326" width="162" height="14" rx="7" fill="var(--hero-base)" stroke="var(--hero-border)" strokeWidth="2" />
        </g>

        <g filter="url(#heroShadow)">
          <path d="M87 301h205l42 71H45l42-71Z" fill="url(#heroBody)" stroke="var(--hero-border)" strokeWidth="2" />
          <rect x="77" y="290" width="224" height="18" rx="9" fill="var(--hero-base)" />
          {Array.from({ length: 32 }).map((_, i) => {
            const col = i % 8;
            const row = Math.floor(i / 8);
            return <rect key={i} x={89 + col * 25} y={317 + row * 11} width="18" height="7" rx="2" fill={i === 13 ? 'var(--hero-accent)' : 'var(--hero-key)'} opacity={i === 13 ? 1 : .9} />;
          })}
        </g>

        <g filter="url(#heroShadow)">
          <path d="M367 334c0-31 18-48 43-48s43 17 43 48c0 24-12 45-43 45s-43-21-43-45Z" fill="url(#heroBody)" stroke="var(--hero-border)" strokeWidth="2" />
          <path d="M410 290v54" stroke="var(--hero-border)" strokeWidth="2" />
          <path d="M385 321h50" stroke="var(--hero-border)" strokeWidth="2" />
          <circle cx="410" cy="354" r="5" fill="var(--hero-accent)" />
        </g>

        <g filter="url(#heroShadow)">
          <rect x="454" y="274" width="92" height="62" rx="14" fill="url(#heroBody)" stroke="var(--hero-border)" strokeWidth="2" />
          <rect x="470" y="289" width="60" height="25" rx="8" fill="var(--hero-screen)" />
          <circle cx="482" cy="302" r="4" fill="var(--hero-accent)" />
          <circle cx="497" cy="302" r="4" fill="var(--hero-accent-2)" />
          <circle cx="512" cy="302" r="4" fill="var(--hero-accent)" />
          <path d="M500 336v20" stroke="var(--hero-border)" strokeWidth="3" strokeLinecap="round" />
          <path d="M480 356h40" stroke="var(--hero-border)" strokeWidth="3" strokeLinecap="round" />
        </g>

        <g className="tw-hero-sparkles" fill="url(#heroAccent)">
          <circle cx="505" cy="110" r="5" />
          <circle cx="531" cy="92" r="3" />
          <circle cx="553" cy="123" r="4" />
          <circle cx="481" cy="143" r="3" />
          <path d="M548 174l5 12 12 5-12 5-5 12-5-12-12-5 12-5 5-12Z" />
        </g>
      </svg>
      <div className="tw-hero-status"><span>✓</span> Keyboard · Mouse · Display · Network</div>
    </div>
  );
}

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-border bg-background">
      <div aria-hidden className="pointer-events-none absolute inset-0 tw-hero-glow" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-40 tw-hero-bottom" />
      <div className="relative mx-auto max-w-[1180px] px-5 pb-16 pt-12 sm:pb-20 sm:pt-16 lg:px-8 lg:pt-20">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_0.95fr] lg:gap-14">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-foreground/[0.03] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-primary"><span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_12px_rgba(0,212,255,0.9)]" />Free · No Download · Works Everywhere</span>
            <h1 className="mt-5 text-5xl font-extrabold leading-[0.94] tracking-[-0.045em] text-foreground sm:text-6xl lg:text-[78px]">Test Your<br /><span className="text-primary [text-shadow:0_0_30px_rgba(0,212,255,0.45)]">Gear.</span><br />Instantly.</h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-foreground/60 sm:text-lg">Browser-based diagnostics for keyboards, mice, monitors, and more. Works on Windows, Mac &amp; Linux. Zero install required.</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/test-tool-page" className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-bold text-black shadow-[0_0_26px_rgba(0,212,255,0.28)] transition hover:brightness-110 active:scale-[0.98]"><svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M5 3l14 9-14 9V3z" /></svg>Start Testing Free</Link>
              <Link href="/device-test-series" className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-6 py-3.5 text-sm font-bold text-primary transition hover:border-primary hover:bg-primary/15">Full Device Test<svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M4 12h16" /></svg></Link>
              <Link href="/test-tool-page" className="inline-flex items-center gap-2 rounded-full border border-border bg-foreground/[0.035] px-6 py-3.5 text-sm font-semibold text-foreground/75 transition hover:border-primary/30 hover:bg-foreground/[0.06] hover:text-foreground">View All Tools<svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg></Link>
            </div>
            <p className="mt-5 text-xs text-foreground/35">No signup · No tracking · 100% free forever</p>
          </div>

          <HeroVisual />
        </div>

        <div className="mt-12 grid grid-cols-2 gap-6 border-t border-border pt-7 sm:grid-cols-4">
          {[['20+', 'Testing Tools'], ['100%', 'Browser-Based'], ['0', 'Downloads Needed'], ['Free', 'Always & Forever']].map(([value, label]) => <div key={label}><div className="font-mono text-2xl font-bold text-primary sm:text-3xl">{value}</div><div className="mt-1 text-xs text-foreground/40 sm:text-sm">{label}</div></div>)}
        </div>
      </div>
    </section>
  );
}
