import React from 'react';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';

const faqs = [
  { q: 'Is TestKit completely free?', a: 'Yes, TestKit is 100% free to use. All testing tools are browser-based and require no payment, subscription, or account.' },
  { q: 'Do I need to download anything?', a: 'No downloads required. All tools run directly in your browser using standard Web APIs. Just open the page and start testing.' },
  { q: 'Does TestKit work on Mac and Linux?', a: 'Yes! TestKit works on any operating system with a modern browser including Windows, macOS, and Linux.' },
  { q: 'Is my data private?', a: 'Absolutely. All tests run locally in your browser. No test data, audio, video, or input is sent to our servers.' },
  { q: 'Why does the microphone/webcam test need permission?', a: 'Browser security requires explicit permission to access your microphone and camera. We only use these for the test and never record or transmit data.' },
  { q: 'How accurate is the CPS test?', a: 'The CPS test uses high-resolution browser timers (performance.now()) for accurate click counting. Results may vary slightly between browsers.' },
  { q: 'Why can\'t I test my mouse polling rate above 1000Hz?', a: 'Browser-based polling rate tests are limited by the browser\'s mousemove event frequency, which caps around 1000Hz. For 2000Hz+ testing, use our desktop app (coming soon).' },
  { q: 'What browsers are supported?', a: 'TestKit works best on Chrome, Firefox, Edge, and Safari. Some features like WebGPU require Chrome 113+ or Edge 113+.' },
  { q: 'How do I test my mouse buttons?', a: 'Go to the Mouse Test page and click inside the test area. All buttons including left, right, middle, and side buttons are detected.' },
  { q: 'Can I use TestKit on mobile?', a: 'Yes! Most tools work on mobile browsers. The touchscreen test is specifically designed for mobile devices.' },
];

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="max-w-3xl mx-auto px-6 lg:px-8 pt-28 pb-20">
        <div className="mb-12 text-center">
          <span className="inline-flex items-center gap-2 glass-card rounded-full px-3 py-1.5 text-xs font-semibold text-primary uppercase tracking-widest mb-6">FAQ</span>
          <h1 className="text-hero-sm font-bold text-foreground mb-4">
            Frequently Asked <span className="text-primary">Questions</span>
          </h1>
          <p className="text-muted-foreground text-base leading-relaxed max-w-xl mx-auto">
            Everything you need to know about TestKit and our hardware testing tools.
          </p>
        </div>

        <div className="space-y-4">
          {faqs?.map((faq, i) => (
            <div key={i} className="glass-card rounded-2xl p-6">
              <h3 className="text-base font-bold text-foreground mb-3 flex items-start gap-3">
                <span className="text-primary font-mono text-sm mt-0.5">Q{i + 1}</span>
                {faq?.q}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed pl-8">{faq?.a}</p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </main>
  );
}
