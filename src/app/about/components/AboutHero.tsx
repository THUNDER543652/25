import React from 'react';


export default function AboutHero() {
  return (
    <section className="relative min-h-[60vh] flex items-end overflow-hidden pt-24">
      {/* Atmospheric background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 blob-primary opacity-25" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 blob-secondary opacity-20" />
      </div>
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-16 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-end">
          {/* Left */}
          <div>
            <span className="inline-flex items-center gap-2 glass-card rounded-full px-3 py-1.5 text-xs font-semibold text-primary uppercase tracking-widest mb-5">
              About TestAppara
            </span>
            <h1 className="text-hero-sm font-bold text-foreground mb-5">
              Built for people who<br />
              <span className="text-primary">demand accuracy</span>
            </h1>
            <p className="text-muted-foreground leading-relaxed text-base max-w-md">
              TestAppara is a free, browser-based PC peripheral testing platform. 
              We believe everyone deserves reliable hardware diagnostics — without 
              downloading sketchy software or paying for basic tools.
            </p>
          </div>

          {/* Right: Stats */}
          <div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: '24', label: 'Free Testing Tools', color: 'text-primary' },
                { value: '0', label: 'Downloads Required', color: 'text-emerald-400' },
                { value: '100%', label: 'Browser-Based', color: 'text-violet-400' },
                { value: 'Free', label: 'Always & Forever', color: 'text-amber-400' },
              ]?.map((stat) => (
                <div key={stat?.label} className="glass-card rounded-2xl p-5 text-center">
                  <div className={`stat-number font-bold ${stat?.color}`}>{stat?.value}</div>
                  <div className="text-xs text-muted-foreground mt-2">{stat?.label}</div>
                </div>
              ))}
            </div>

            <div className="mt-5 glass-card rounded-2xl p-5 border border-primary/20">
              <p className="text-sm font-semibold text-foreground mb-1">testappara.tools.com</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Formerly InputInsight. Rebranded to TestAppara for a cleaner, more memorable identity that reflects our mission.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
