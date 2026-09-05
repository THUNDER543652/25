import React from 'react';
import Link from 'next/link';

interface Tool {
  name: string;
  desc: string;
  icon: string;
  color: string;
  bg: string;
  border: string;
  href?: string;
}

const allTools: Tool[] = [
  { name: 'Mouse Test', desc: 'Check all buttons & scroll', icon: '🖱️', color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20', href: '/mouse-test' },
  { name: 'Double Click Test', desc: 'Detect double-click issues', icon: '⚡', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', href: '/double-click-test' },
  { name: 'Typing Speed Test', desc: 'WPM & accuracy', icon: '✍️', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', href: '/typing-speed-test' },
  { name: 'Spacebar Test', desc: 'Spacebar response time', icon: '⎵', color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/20', href: '/spacebar-test' },
  { name: 'Dead Pixel Test', desc: 'Full-screen pixel scan', icon: '🖥️', color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20', href: '/dead-pixel-test' },
  { name: 'Microphone Test', desc: 'Audio input check', icon: '🎤', color: 'text-sky-400', bg: 'bg-sky-500/10', border: 'border-sky-500/20', href: '/microphone-test' },
  { name: 'Webcam Test', desc: 'Camera quality & FPS', icon: '📷', color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20', href: '/webcam-test' },
  { name: 'Scroll Test', desc: 'Scroll wheel precision', icon: '↕️', color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20', href: '/scroll-test' },
  { name: 'Reaction Time Test', desc: 'Measure your reflexes', icon: '⏱️', color: 'text-teal-400', bg: 'bg-teal-500/10', border: 'border-teal-500/20', href: '/reaction-time-test' },
  { name: 'Internet Speed Test', desc: 'Download & upload speed', icon: '🌐', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', href: '/internet-speed-test' },
  { name: 'Gamepad Tester', desc: 'Controller button test', icon: '🎮', color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20', href: '/gamepad-test' },
  { name: 'Monitor Test', desc: 'Color & uniformity check', icon: '🎨', color: 'text-pink-400', bg: 'bg-pink-500/10', border: 'border-pink-500/20', href: '/monitor-test' },
];

export default function QuickToolsGrid() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-foreground">More Testing Tools</h2>
        <span className="text-xs text-muted-foreground font-mono">{allTools?.length} tools available</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {allTools?.map((tool) => (
          <Link
            key={tool?.name}
            href={tool?.href || '/test-tool-page'}
            className="glass-card-hover rounded-xl p-4 flex flex-col items-center text-center gap-2 group"
          >
            <div className={`w-10 h-10 ${tool?.bg} border ${tool?.border} rounded-xl flex items-center justify-center text-lg`}>
              {tool?.icon}
            </div>
            <div>
              <p className={`text-xs font-semibold ${tool?.color} group-hover:opacity-90 transition-opacity leading-tight`}>
                {tool?.name}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5 leading-tight hidden sm:block">
                {tool?.desc}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
