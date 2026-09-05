import React from 'react';
import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AboutHero from '@/app/about/components/AboutHero';
import AboutValues from '@/app/about/components/AboutValues';
import AboutContact from '@/app/about/components/AboutContact';

export const metadata: Metadata = {
  title: 'About TestAppara — Free Browser-Based Device Tests',
  description: 'Learn about TestAppara and its free browser-based keyboard, mouse, display, network, and device testing tools.',
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      <Header />
      <AboutHero />
      <AboutValues />
      <AboutContact />
      <Footer />
    </main>
  );
}
