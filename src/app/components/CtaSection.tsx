import React from 'react';
import Link from 'next/link';

export default function CtaSection() {
  return (
    <section className="relative z-10 bg-background py-20 px-6 lg:px-8 border-t border-border overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] blob-primary opacity-30 pointer-events-none" />

      <div className="max-w-3xl mx-auto text-center relative z-10">
        <div
          className="animate-on-scroll opacity-0"
          style={{ animation: 'none' }}
        >
          <span className="inline-flex items-center gap-2 glass-card rounded-full px-3 py-1.5 text-xs font-semibold text-primary uppercase tracking-widest mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-glow" />
            Ready to Test?
          </span>

          <h2 className="text-hero-sm font-bold text-foreground mb-5">
            Start diagnosing your<br />
            <span className="text-primary glow-text-cyan">gear right now</span>
          </h2>

          <p className="text-muted-foreground text-base leading-relaxed mb-8 max-w-md mx-auto">
            Free, instant, browser-based. No account needed. Works on any OS. 
            Join thousands of users who test with TestAppara every day.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/test-tool-page"
              className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-bold rounded-full px-8 py-4 hover:opacity-90 active:scale-95 transition-all duration-150 glow-cyan text-base"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 3l14 9-14 9V3z" />
              </svg>
              Open Testing Hub
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center justify-center gap-2 glass-card rounded-full px-8 py-4 text-sm font-semibold text-foreground/80 hover:text-foreground hover:border-primary/40 transition-all duration-200"
            >
              Learn About TestAppara
            </Link>
          </div>

          <p className="text-xs text-muted-foreground mt-6">
            Powered by testappara.tools.com · AdSense Publisher: pub-3995420051808249
          </p>
        </div>
      </div>

      {/* AdSense footer placement */}
      <div className="max-w-7xl mx-auto mt-12 flex justify-center">
        <div className="glass-card rounded-xl px-8 py-4 min-w-[320px] flex items-center justify-center min-h-[90px] border-dashed">
          {/* AdSense footer ad - publisher: pub-3995420051808249 */}
          {/* <ins className="adsbygoogle" data-ad-client="ca-pub-3995420051808249" data-ad-slot="XXXXXXXX" data-ad-format="horizontal" /> */}
          <span className="text-xs text-muted-foreground/30 font-mono">Advertisement</span>
        </div>
      </div>
    </section>
  );
}