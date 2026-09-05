import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <article className="max-w-3xl mx-auto px-6 lg:px-8 pt-28 pb-20">
        <span className="inline-flex rounded-full glass-card px-3 py-1.5 text-xs font-semibold text-primary uppercase tracking-widest mb-4">Legal</span>
        <h1 className="text-section-title font-bold text-foreground mb-4">Privacy Policy</h1>
        <div className="space-y-6 text-muted-foreground leading-relaxed">
          <p>TestAppara is designed to run device checks in your browser. Test inputs such as keyboard, mouse, microphone, camera, and gamepad events are processed locally on your device for the duration of the test.</p>
          <section><h2 className="text-lg font-bold text-foreground mb-2">Permissions</h2><p>Microphone and camera tools request browser permission only when you start a test. You can revoke a permission at any time from your browser settings.</p></section>
          <section><h2 className="text-lg font-bold text-foreground mb-2">Contact</h2><p>For privacy questions, please use the contact options on our About page.</p></section>
        </div>
      </article>
      <Footer />
    </main>
  );
}
