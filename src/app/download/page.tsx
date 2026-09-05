import React from 'react';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import Link from 'next/link';

export default function DownloadPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="max-w-4xl mx-auto px-6 lg:px-8 pt-28 pb-20">
        <div className="mb-12 text-center">
          <span className="inline-flex items-center gap-2 glass-card rounded-full px-3 py-1.5 text-xs font-semibold text-primary uppercase tracking-widest mb-6">Desktop App</span>
          <h1 className="text-hero-sm font-bold text-foreground mb-4">
            Download <span className="text-primary glow-text-cyan">TestKit</span>
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed max-w-xl mx-auto">
            Get the TestKit desktop app for offline testing, lower latency measurements, and advanced hardware diagnostics.
          </p>
        </div>

        {/* Coming Soon */}
        <div className="glass-card rounded-2xl p-12 text-center mb-12">
          <div className="text-6xl mb-6">💻</div>
          <h2 className="text-2xl font-bold text-foreground mb-4">Desktop App Coming Soon</h2>
          <p className="text-muted-foreground text-base leading-relaxed max-w-md mx-auto mb-8">
            We\'re building a native desktop application for Windows, macOS, and Linux with enhanced testing capabilities.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {['Windows', 'macOS', 'Linux']?.map(os => (
              <div key={os} className="glass-card rounded-2xl px-8 py-4 text-center opacity-60">
                <div className="text-2xl mb-2">{os === 'Windows' ? '🧰' : os === 'macOS' ? '🍎' : '🐧'}</div>
                <div className="text-sm font-semibold text-foreground">{os}</div>
                <div className="text-xs text-muted-foreground mt-1">Coming Soon</div>
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground">In the meantime, use our <Link href="/" className="text-primary hover:underline">browser-based tools</Link> — they work great!</p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: '⚡', title: 'Lower Latency', desc: 'Native app bypasses browser overhead for more accurate latency measurements.' },
            { icon: '🔌', title: 'Hardware Access', desc: 'Direct hardware access for polling rate, DPI, and peripheral diagnostics.' },
            { icon: '📊', title: 'Advanced Reports', desc: 'Export detailed test reports and track performance over time.' },
          ]?.map(f => (
            <div key={f?.title} className="glass-card rounded-2xl p-6">
              <div className="text-3xl mb-3">{f?.icon}</div>
              <h3 className="text-base font-bold text-foreground mb-2">{f?.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f?.desc}</p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </main>
  );
}
