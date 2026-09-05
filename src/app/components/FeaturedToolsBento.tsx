import React from 'react';
import Link from 'next/link';

// BENTO GRID AUDIT
// Array has 6 cards: [KeyboardTest, MouseTest, CPSTest, TypingSpeed, DeadPixel, MicTest]
// Row 1 (4 cols): [col-1+2: KeyboardTest cs-2 rs-2] [col-3: MouseTest cs-1] [col-4: CPSTest cs-1]
// Row 2 (4 cols): [col-1+2: (KeyboardTest cont.)] [col-3: TypingSpeed cs-1] [col-4: DeadPixel cs-1]
// Row 3 (4 cols): [col-1+2+3+4: MicTest cs-4]
// Placed 6/6 cards ✓

const tools = [
  {
    id: 'keyboard',
    title: 'Keyboard Test',
    description: 'Test every key on your keyboard. Detect dead keys, ghosting, and N-key rollover in real time.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0H3" />
      </svg>
    ),
    tag: 'Most Popular',
    colSpan: 'lg:col-span-2',
    rowSpan: 'lg:row-span-2',
    accent: 'from-primary/20 to-primary/5',
    large: true,
  },
  {
    id: 'mouse',
    title: 'Mouse Test',
    description: 'Check all mouse buttons, scroll wheel, and detect double-click issues.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zm-7.518-.267A8.25 8.25 0 1120.25 10.5M8.288 14.212A5.25 5.25 0 1117.25 10.5" />
      </svg>
    ),
    tag: null,
    colSpan: 'lg:col-span-1',
    rowSpan: '',
    accent: 'from-violet-500/20 to-violet-500/5',
    large: false,
  },
  {
    id: 'cps',
    title: 'CPS Test',
    description: 'Measure your clicks per second. Track gaming performance.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
    tag: 'Gaming',
    colSpan: 'lg:col-span-1',
    rowSpan: '',
    accent: 'from-amber-500/20 to-amber-500/5',
    large: false,
  },
  {
    id: 'typing',
    title: 'Typing Speed',
    description: 'Test your WPM and accuracy with real text passages.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
      </svg>
    ),
    tag: null,
    colSpan: 'lg:col-span-1',
    rowSpan: '',
    accent: 'from-emerald-500/20 to-emerald-500/5',
    large: false,
  },
  {
    id: 'deadpixel',
    title: 'Dead Pixel Test',
    description: 'Scan your monitor for dead, stuck, or hot pixels.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0H3" />
      </svg>
    ),
    tag: null,
    colSpan: 'lg:col-span-1',
    rowSpan: '',
    accent: 'from-rose-500/20 to-rose-500/5',
    large: false,
  },
  {
    id: 'microphone',
    title: 'Microphone Test',
    description: 'Test your microphone instantly in the browser. Check audio input levels and quality.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
      </svg>
    ),
    tag: 'Audio',
    colSpan: 'lg:col-span-4',
    rowSpan: '',
    accent: 'from-sky-500/20 to-sky-500/5',
    large: false,
  },
];

export default function FeaturedToolsBento() {
  return (
    <section className="relative z-10 bg-background py-20 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="mb-12 animate-on-scroll opacity-0" style={{ animation: 'none' }}>
          <span className="inline-flex items-center gap-2 glass-card rounded-full px-3 py-1.5 text-xs font-semibold text-primary uppercase tracking-widest mb-4">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M11.025 2.295a.53.53 0 01.95 0l2.31 4.679a2.123 2.123 0 001.595 1.16l5.166.756a.53.53 0 01.294.904l-3.736 3.638a2.123 2.123 0 00-.611 1.878l.882 5.14a.53.53 0 01-.771.56l-4.618-2.428a2.122 2.122 0 00-1.973 0L6.396 21.01a.53.53 0 01-.77-.56l.881-5.139a2.122 2.122 0 00-.611-1.879L2.16 9.795a.53.53 0 01.294-.906l5.165-.755a2.122 2.122 0 001.597-1.16z" />
            </svg>
            Featured Tools
          </span>
          <h2 className="text-section-title font-bold text-foreground">
            Everything you need to<br />
            <span className="text-primary">diagnose your setup</span>
          </h2>
        </div>

        {/* Bento Grid */}
        {/* Row 1: KeyboardTest(cs-2 rs-2) | MouseTest(cs-1) | CPSTest(cs-1) */}
        {/* Row 2: KeyboardTest(cont.) | TypingSpeed(cs-1) | DeadPixel(cs-1) */}
        {/* Row 3: MicTest(cs-4) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Keyboard - col-span-2 row-span-2 */}
          {/* lg:col-span-2 lg:row-span-2 */}
          <Link
            href="/keyboard-test"
            className="glass-card-hover rounded-2xl p-6 flex flex-col h-full min-h-[280px] lg:col-span-2 lg:row-span-2 relative overflow-hidden group"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${tools?.[0]?.accent} rounded-2xl`} />
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 glass-card rounded-xl text-primary">
                  {tools?.[0]?.icon}
                </div>
                {tools?.[0]?.tag && (
                  <span className="text-xs font-semibold text-primary bg-primary/10 border border-primary/20 rounded-full px-2.5 py-1">
                    {tools?.[0]?.tag}
                  </span>
                )}
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">{tools?.[0]?.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed flex-1">{tools?.[0]?.description}</p>
              {/* Mini keyboard visual */}
              <div className="mt-6 grid grid-cols-10 gap-1 opacity-60 group-hover:opacity-90 transition-opacity">
                {['Q','W','E','R','T','Y','U','I','O','P']?.map((k) => (
                  <div key={k} className="key-cap flex items-center justify-center h-7 text-xs font-mono text-foreground/70">
                    {k}
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-primary group-hover:gap-2.5 transition-all">
                Open Tool
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>

          {/* Card 2: Mouse - col-span-1 */}
          <Link
            href="/mouse-test"
            className="glass-card-hover rounded-2xl p-5 flex flex-col relative overflow-hidden group min-h-[130px]"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${tools?.[1]?.accent} rounded-2xl`} />
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-start justify-between mb-3">
                <div className="p-2.5 glass-card rounded-lg text-violet-400">{tools?.[1]?.icon}</div>
              </div>
              <h3 className="text-base font-bold text-foreground mb-1.5">{tools?.[1]?.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed flex-1">{tools?.[1]?.description}</p>
              <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-violet-400 group-hover:gap-2 transition-all">
                Open <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
              </div>
            </div>
          </Link>

          {/* Card 3: CPS - col-span-1 */}
          <Link
            href="/cps-test"
            className="glass-card-hover rounded-2xl p-5 flex flex-col relative overflow-hidden group min-h-[130px]"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${tools?.[2]?.accent} rounded-2xl`} />
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-start justify-between mb-3">
                <div className="p-2.5 glass-card rounded-lg text-amber-400">{tools?.[2]?.icon}</div>
                {tools?.[2]?.tag && (
                  <span className="text-xs font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-full px-2 py-0.5">
                    {tools?.[2]?.tag}
                  </span>
                )}
              </div>
              <h3 className="text-base font-bold text-foreground mb-1.5">{tools?.[2]?.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed flex-1">{tools?.[2]?.description}</p>
              <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-amber-400 group-hover:gap-2 transition-all">
                Open <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
              </div>
            </div>
          </Link>

          {/* Card 4: Typing - col-span-1 */}
          <Link
            href="/typing-speed-test"
            className="glass-card-hover rounded-2xl p-5 flex flex-col relative overflow-hidden group min-h-[130px]"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${tools?.[3]?.accent} rounded-2xl`} />
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-start justify-between mb-3">
                <div className="p-2.5 glass-card rounded-lg text-emerald-400">{tools?.[3]?.icon}</div>
              </div>
              <h3 className="text-base font-bold text-foreground mb-1.5">{tools?.[3]?.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed flex-1">{tools?.[3]?.description}</p>
              <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-emerald-400 group-hover:gap-2 transition-all">
                Open <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
              </div>
            </div>
          </Link>

          {/* Card 5: Dead Pixel - col-span-1 */}
          <Link
            href="/dead-pixel-test"
            className="glass-card-hover rounded-2xl p-5 flex flex-col relative overflow-hidden group min-h-[130px]"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${tools?.[4]?.accent} rounded-2xl`} />
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-start justify-between mb-3">
                <div className="p-2.5 glass-card rounded-lg text-rose-400">{tools?.[4]?.icon}</div>
              </div>
              <h3 className="text-base font-bold text-foreground mb-1.5">{tools?.[4]?.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed flex-1">{tools?.[4]?.description}</p>
              <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-rose-400 group-hover:gap-2 transition-all">
                Open <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
              </div>
            </div>
          </Link>

          {/* Card 6: Microphone - col-span-4 */}
          <Link
            href="/microphone-test"
            className="glass-card-hover rounded-2xl p-5 flex flex-col sm:flex-row items-center gap-4 relative overflow-hidden group lg:col-span-4"
          >
            <div className={`absolute inset-0 bg-gradient-to-r ${tools?.[5]?.accent} rounded-2xl`} />
            <div className="relative z-10 flex flex-col sm:flex-row items-center gap-4 w-full">
              <div className="p-3 glass-card rounded-xl text-sky-400 flex-shrink-0">{tools?.[5]?.icon}</div>
              <div className="flex-1 text-center sm:text-left">
                <div className="flex items-center gap-2 justify-center sm:justify-start mb-1">
                  <h3 className="text-base font-bold text-foreground">{tools?.[5]?.title}</h3>
                  {tools?.[5]?.tag && (
                    <span className="text-xs font-semibold text-sky-400 bg-sky-500/10 border border-sky-500/20 rounded-full px-2 py-0.5">
                      {tools?.[5]?.tag}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{tools?.[5]?.description}</p>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-sky-400 flex-shrink-0 group-hover:gap-2.5 transition-all">
                Open Tool
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
