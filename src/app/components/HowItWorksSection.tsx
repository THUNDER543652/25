import React from 'react';

const steps = [
  {
    number: '01',
    title: 'Pick Your Tool',
    description: 'Choose from 20+ browser-based diagnostics. Keyboard, mouse, monitor, audio — it\'s all here.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
      </svg>
    ),
  },
  {
    number: '02',
    title: 'Run the Test',
    description: 'Interact with your device in real time. Results appear instantly — no waiting, no processing.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
      </svg>
    ),
  },
  {
    number: '03',
    title: 'See Your Results',
    description: 'Get a clear diagnostic report. Know exactly what\'s working and what needs attention.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

export default function HowItWorksSection() {
  return (
    <section className="relative z-10 bg-background py-20 px-6 lg:px-8 border-t border-border">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14 animate-on-scroll opacity-0" style={{ animation: 'none' }}>
          <span className="inline-flex items-center gap-2 glass-card rounded-full px-3 py-1.5 text-xs font-semibold text-primary uppercase tracking-widest mb-4">
            How It Works
          </span>
          <h2 className="text-section-title font-bold text-foreground">
            Test in <span className="text-primary">3 seconds flat</span>
          </h2>
          <p className="text-muted-foreground mt-3 max-w-md mx-auto text-sm leading-relaxed">
            No downloads, no accounts, no waiting. Open your browser and start diagnosing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps?.map((step, i) => (
            <div
              key={step?.number}
              className="glass-card-hover rounded-2xl p-7 flex flex-col animate-on-scroll opacity-0"
              style={{ animation: 'none', transitionDelay: `${i * 80}ms` }}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="p-3 glass-card rounded-xl text-primary">
                  {step?.icon}
                </div>
                <span className="font-mono text-4xl font-bold text-foreground/10">{step?.number}</span>
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">{step?.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{step?.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}