import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <article className="max-w-3xl mx-auto px-6 lg:px-8 pt-28 pb-20">
        <span className="inline-flex rounded-full glass-card px-3 py-1.5 text-xs font-semibold text-primary uppercase tracking-widest mb-4">Legal</span>
        <h1 className="text-section-title font-bold text-foreground mb-4">Terms of Use</h1>
        <div className="space-y-6 text-muted-foreground leading-relaxed">
          <p>TestAppara provides browser-based testing tools for informational and diagnostic purposes. Results may vary based on your device, browser, operating system, and connected hardware.</p>
          <section><h2 className="text-lg font-bold text-foreground mb-2">Your responsibility</h2><p>Use the tools at your discretion and follow your device manufacturer’s guidance before changing hardware or software settings.</p></section>
          <section><h2 className="text-lg font-bold text-foreground mb-2">Availability</h2><p>We may update, improve, or discontinue a tool at any time without notice.</p></section>
        </div>
      </article>
      <Footer />
    </main>
  );
}
