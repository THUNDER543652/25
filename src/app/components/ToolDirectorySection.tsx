import React from 'react';
import Link from 'next/link';

const categories = [
  {
    name: 'Keyboard',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    borderColor: 'border-primary/20',
    tools: [
      { name: 'Keyboard Test', desc: 'Detect dead keys & ghosting', href: '/keyboard-test' },
      { name: 'Typing Speed Test', desc: 'WPM & accuracy measurement', href: '/typing-speed-test' },
      { name: 'Spacebar Test', desc: 'Test spacebar response', href: '/spacebar-test' },
      { name: 'N-Key Rollover Test', desc: 'Simultaneous key detection', href: '/keyboard-test' },
      { name: 'Ghosting Test', desc: 'Anti-ghosting verification', href: '/keyboard-test' },
      { name: 'Keyboard Polling Rate', desc: 'Input latency check', href: '/latency-test' },
    ],
  },
  {
    name: 'Mouse',
    color: 'text-violet-400',
    bgColor: 'bg-violet-500/10',
    borderColor: 'border-violet-500/20',
    tools: [
      { name: 'Mouse Test', desc: 'All buttons & scroll wheel', href: '/mouse-test' },
      { name: 'CPS Test', desc: 'Clicks per second counter', href: '/cps-test' },
      { name: 'Double Click Test', desc: 'Detect double-click issues', href: '/double-click-test' },
      { name: 'Mouse Polling Rate', desc: 'Hz measurement tool', href: '/mouse-polling-rate-test' },
      { name: 'Scroll Test', desc: 'Scroll wheel precision', href: '/scroll-test' },
      { name: 'Drag Click Test', desc: 'Gaming click technique', href: '/drag-click-test' },
    ],
  },
  {
    name: 'Display',
    color: 'text-rose-400',
    bgColor: 'bg-rose-500/10',
    borderColor: 'border-rose-500/20',
    tools: [
      { name: 'Dead Pixel Test', desc: 'Full-screen pixel scanner', href: '/dead-pixel-test' },
      { name: 'Monitor Test', desc: 'Color & uniformity check', href: '/monitor-test' },
      { name: 'Refresh Rate Test', desc: 'Hz & smoothness test', href: '/monitor-test' },
    ],
  },
  {
    name: 'Audio & Video',
    color: 'text-sky-400',
    bgColor: 'bg-sky-500/10',
    borderColor: 'border-sky-500/20',
    tools: [
      { name: 'Microphone Test', desc: 'Audio input level check', href: '/microphone-test' },
      { name: 'Webcam Test', desc: 'Camera quality & FPS', href: '/webcam-test' },
      { name: 'Speaker Test', desc: 'Audio output verification', href: '/speaker-test' },
    ],
  },
  {
    name: 'Performance',
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/20',
    tools: [
      { name: 'Internet Speed Test', desc: 'Download & upload speed', href: '/internet-speed-test' },
      { name: 'Reaction Time Test', desc: 'Measure your reflexes', href: '/reaction-time-test' },
      { name: 'Aim Trainer', desc: 'Mouse accuracy practice', href: '/mouse-accuracy-test' },
      { name: 'Gamepad Tester', desc: 'Controller button test', href: '/gamepad-test' },
    ],
  },
];

export default function ToolDirectorySection() {
  return (
    <section className="relative z-10 bg-background py-20 px-6 lg:px-8 border-t border-border">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div className="animate-on-scroll opacity-0" style={{ animation: 'none' }}>
            <span className="inline-flex items-center gap-2 glass-card rounded-full px-3 py-1.5 text-xs font-semibold text-primary uppercase tracking-widest mb-4">
              All Tools
            </span>
            <h2 className="text-section-title font-bold text-foreground">
              20+ free testing tools,<br />
              <span className="text-primary">all in one place</span>
            </h2>
          </div>
          <Link
            href="/test-tool-page"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary border border-primary/30 rounded-full px-5 py-2.5 hover:bg-primary/10 transition-all self-start md:self-auto"
          >
            Open Testing Hub
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Categories grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories?.map((cat, ci) => (
            <div
              key={cat?.name}
              className="glass-card rounded-2xl p-6 animate-on-scroll opacity-0"
              style={{ animation: 'none', transitionDelay: `${ci * 60}ms` }}
            >
              <div className={`inline-flex items-center gap-2 ${cat?.bgColor} border ${cat?.borderColor} rounded-full px-3 py-1 text-xs font-semibold ${cat?.color} uppercase tracking-widest mb-5`}>
                {cat?.name}
              </div>
              <ul className="space-y-3">
                {cat?.tools?.map((tool) => (
                  <li key={tool?.name}>
                    <Link
                      href={tool.href}
                      className="flex items-center justify-between group py-1.5"
                    >
                      <div>
                        <div className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                          {tool?.name}
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">{tool?.desc}</div>
                      </div>
                      <svg
                        className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all flex-shrink-0 ml-2"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* AdSense placeholder - between tool categories, not interrupting tools */}
          <div className="glass-card rounded-2xl p-6 flex items-center justify-center min-h-[200px] border-dashed">
            <div className="text-center">
              {/* AdSense ad unit - publisher: pub-3995420051808249 */}
              {/* <ins className="adsbygoogle" data-ad-client="ca-pub-3995420051808249" data-ad-slot="XXXXXXXX" data-ad-format="auto" /> */}
              <div className="text-xs text-muted-foreground/40 font-mono">Advertisement</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
