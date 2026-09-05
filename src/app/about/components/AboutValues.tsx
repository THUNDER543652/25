import React from 'react';

const values = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    title: 'Privacy First',
    description: 'We never collect your keystrokes, mouse movements, or device data. Everything runs locally in your browser. No logs, no tracking, no account required.',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
    title: 'Instant Results',
    description: 'No waiting, no processing. Results appear the moment you interact with your device. Real-time diagnostics that actually respect your time.',
    color: 'text-primary',
    bg: 'bg-primary/10',
    border: 'border-primary/20',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
      </svg>
    ),
    title: 'Always Accurate',
    description: 'Our tools use the Web APIs your browser provides — the same signals your OS reads. No guesswork, no approximation.',
    color: 'text-violet-400',
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/20',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
      </svg>
    ),
    title: 'Free Forever',
    description: 'TestAppara is and will always be free. We sustain the platform through non-intrusive advertising that never interrupts your testing experience.',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
  },
];

const faqs = [
  {
    q: 'Does TestAppara store my keystrokes?',
    a: 'No. All testing happens entirely in your browser using JavaScript event listeners. Nothing is sent to any server.',
  },
  {
    q: 'Why was the site renamed from InputInsight to TestAppara?',
    a: 'TestAppara is more memorable, clearer in its purpose, and better suited for long-term brand building at testappara.tools.com.',
  },
  {
    q: 'Do I need to create an account?',
    a: 'Never. Every tool is accessible instantly with zero signup or login required.',
  },
  {
    q: 'Why are there ads?',
    a: 'Ads help us keep all tools free. We place them carefully — below hero sections and between content — never inside the testing interface.',
  },
  {
    q: 'What browsers are supported?',
    a: 'All modern browsers: Chrome, Firefox, Safari, Edge, and Brave. We use standard Web APIs for maximum compatibility.',
  },
];

export default function AboutValues() {
  return (
    <section className="relative z-10 bg-background py-16 px-6 lg:px-8 border-t border-border">
      <div className="max-w-7xl mx-auto">
        {/* Values */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-section-title font-bold text-foreground">
              Why <span className="text-primary">TestAppara</span>
            </h2>
            <p className="text-muted-foreground mt-2 text-sm max-w-md mx-auto">
              We built the testing hub we always wanted but could never find.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {values?.map((v, i) => (
              <div
                key={v?.title}
                className="glass-card-hover rounded-2xl p-6 flex flex-col"
              >
                <div className={`p-2.5 ${v?.bg} border ${v?.border} rounded-xl ${v?.color} w-fit mb-4`}>
                  {v?.icon}
                </div>
                <h3 className="text-base font-bold text-foreground mb-2">{v?.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{v?.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div>
          <div className="text-center mb-8">
            <h2 className="text-section-title font-bold text-foreground">
              Frequently Asked <span className="text-primary">Questions</span>
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            {faqs?.map((faq, i) => (
              <div
                key={i}
                className="glass-card rounded-2xl p-5"
              >
                <h3 className="text-sm font-bold text-foreground mb-2">{faq?.q}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{faq?.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Privacy & Terms */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-card rounded-2xl p-6 border border-primary/10">
            <h3 className="text-base font-bold text-foreground mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
              Privacy Policy
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              TestAppara does not collect, store, or transmit any personal data. All hardware testing occurs entirely within your browser. 
              We use Google AdSense (publisher ID: pub-3995420051808249) for non-intrusive advertising. 
              AdSense may use cookies for ad personalization per Google&apos;s privacy policy. 
              You can opt out via Google&apos;s ad settings at any time.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-primary/10">
            <h3 className="text-base font-bold text-foreground mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
              Terms of Use
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              TestAppara tools are provided &quot;as is&quot; for informational and diagnostic purposes. 
              Results are indicative and may vary based on browser capabilities and system configuration. 
              TestAppara is not responsible for hardware decisions made based on tool results. 
              All tools are free to use for personal and commercial purposes with attribution.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}