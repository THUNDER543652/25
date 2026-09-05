import React from 'react';
import Link from 'next/link';

export default function AboutContact() {
  return (
    <section className="relative z-10 bg-background py-16 px-6 lg:px-8 border-t border-border">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left: Contact info */}
          <div>
            <span className="inline-flex items-center gap-2 glass-card rounded-full px-3 py-1.5 text-xs font-semibold text-primary uppercase tracking-widest mb-5">
              Contact
            </span>
            <h2 className="text-section-title font-bold text-foreground mb-4">
              Get in <span className="text-primary">touch</span>
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed mb-8 max-w-sm">
              Have a feature request, found a bug, or want to suggest a new testing tool? 
              We read every message.
            </p>

            <div className="space-y-4">
              {[
                { label: 'Website', value: 'testappara.tools.com', icon: '🌐', href: '/' },
                { label: 'Email', value: 'testappara.tools@gmail.com', icon: '✉️', href: 'mailto:testappara.tools@gmail.com' },
                { label: 'Platform', value: 'Browser-based, no app', icon: '💻', href: undefined },
              ]?.map((item) => (
                <div key={item?.label} className="flex items-center gap-3">
                  <span className="text-lg">{item?.icon}</span>
                  <div>
                    <div className="text-xs text-muted-foreground">{item?.label}</div>
                    {item.href ? <Link href={item.href} className="text-sm font-semibold text-foreground font-mono transition-colors hover:text-primary hover:underline">{item.value}</Link> : <div className="text-sm font-semibold text-foreground font-mono">{item?.value}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Quick links */}
          <div>
            <h3 className="text-base font-bold text-foreground mb-5">Quick Links</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { name: 'Keyboard Test', href: '/keyboard-test', icon: '⌨️' },
                { name: 'Mouse Test', href: '/mouse-test', icon: '🖱️' },
                { name: 'CPS Test', href: '/cps-test', icon: '⚡' },
                { name: 'Typing Speed', href: '/typing-speed-test', icon: '✍️' },
                { name: 'Dead Pixel Test', href: '/dead-pixel-test', icon: '🖥️' },
                { name: 'Mic Test', href: '/microphone-test', icon: '🎤' },
              ]?.map((link) => (
                <Link
                  key={link?.name}
                  href={link?.href}
                  className="glass-card-hover rounded-xl p-3.5 flex items-center gap-2.5 group"
                >
                  <span className="text-base">{link?.icon}</span>
                  <span className="text-sm font-medium text-foreground/80 group-hover:text-primary transition-colors">
                    {link?.name}
                  </span>
                </Link>
              ))}
            </div>

            <div className="mt-6">
              <Link
                href="/test-tool-page"
                className="w-full inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-bold rounded-full px-6 py-3.5 hover:opacity-90 active:scale-95 transition-all glow-cyan"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 3l14 9-14 9V3z" />
                </svg>
                Open Testing Hub
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
