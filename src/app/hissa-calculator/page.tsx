import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HissaCalculatorClient from './HissaCalculatorClient';

export const metadata: Metadata = {
  title: 'Property Share Calculator – Equal Property Division & Hissa Calculator',
  description:
    'Free property share calculator to divide land or property equally among owners and beneficiaries. Calculate hissa, ownership fractions, percentages, and area in Kanal, Marla, and square feet.',
  keywords: [
    'property share calculator',
    'property division calculator',
    'equal property division calculator',
    'property share calculator India',
    'land share calculator',
    'land division calculator',
    'hissa calculator',
    'hissa calculator for property',
    'hissa calculator for land',
    'property hissa calculator',
    'inheritance share calculator',
    'Kanal Marla calculator',
  ],
  alternates: { canonical: '/hissa-calculator' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Property Share Calculator – Equal Property Division & Hissa Calculator',
    description:
      'Calculate equal property shares, hissa, ownership fractions, and land area in Kanal, Marla, and square feet.',
    type: 'website',
  },
};

const appJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Property Share Calculator',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Any',
  description: 'Free property share calculator for equal property division, hissa calculation, land shares, fractions, percentages, Kanal, Marla, and square feet.',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How do I divide property equally between owners?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Enter the total property area, add the owners, and use Auto Fill Shares. The calculator assigns equal fractions such as 1/2, 1/3, or 1/4 and calculates the corresponding area for each owner.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is a hissa in property or land?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Hissa commonly refers to a share or portion of property. This calculator represents a hissa mathematically using a fraction and calculates the matching area from the total property size.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I calculate land shares in Kanal and Marla?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Enter Kanal, Marla, and square feet in the Land Details section. Each person’s result is shown as Kanal, Marla, and remaining square feet.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does this calculator decide legal inheritance shares?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. It performs mathematical property-share calculations only. Legal ownership, inheritance, succession, or religious entitlement should be confirmed with the relevant authority or a qualified professional.',
      },
    },
  ],
};

export default function HissaCalculatorPage() {
  return (
    <main className="min-h-screen bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <Header />
      <HissaCalculatorClient />

      <section className="mx-auto max-w-6xl px-4 pb-12 pt-3 sm:px-6 lg:px-8" aria-labelledby="property-share-guide">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
          <div className="absolute -right-20 -top-24 h-56 w-56 rounded-full bg-primary/10 blur-3xl" aria-hidden="true" />
          <div className="absolute -bottom-24 -left-20 h-48 w-48 rounded-full bg-accent/10 blur-3xl" aria-hidden="true" />

          <div className="relative p-5 sm:p-8 lg:p-10">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="max-w-3xl">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                  <span aria-hidden="true">▦</span>
                  Free • Fast • Easy to use
                </div>
                <h1 id="property-share-guide" className="text-2xl font-black tracking-tight text-foreground sm:text-3xl lg:text-4xl">
                  Property Share Calculator for Equal Property Division
                </h1>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-foreground/70 sm:text-base">
                  Quickly calculate each person&apos;s share of land or property. Enter the total area,
                  add owners or beneficiaries, and see their hissa, fraction, percentage, Kanal, Marla,
                  and square-foot area in one clear result.
                </p>
              </div>
              <div className="shrink-0 rounded-2xl border border-border bg-background/60 px-4 py-3 text-left sm:min-w-[170px] sm:text-center">
                <div className="text-xs font-semibold text-foreground/55">Supports</div>
                <div className="mt-1 text-sm font-extrabold text-foreground">Kanal • Marla • Sq Ft</div>
              </div>
            </div>

            <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <article className="rounded-2xl border border-border bg-background/55 p-4 transition hover:-translate-y-0.5 hover:border-primary/30">
                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-lg text-primary" aria-hidden="true">÷</span>
                  <h2 className="font-extrabold text-foreground">Equal Property Division</h2>
                </div>
                <p className="mt-3 text-sm leading-6 text-foreground/65">
                  Split a property equally among 2, 3, 4, or more owners and instantly check that the
                  combined share adds up to 100%.
                </p>
              </article>

              <article className="rounded-2xl border border-border bg-background/55 p-4 transition hover:-translate-y-0.5 hover:border-primary/30">
                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-lg text-primary" aria-hidden="true">½</span>
                  <h2 className="font-extrabold text-foreground">Hissa & Ownership Shares</h2>
                </div>
                <p className="mt-3 text-sm leading-6 text-foreground/65">
                  Use it as a hissa calculator for land or property to compare fractions, percentages,
                  and the calculated area belonging to each person.
                </p>
              </article>

              <article className="rounded-2xl border border-border bg-background/55 p-4 transition hover:-translate-y-0.5 hover:border-primary/30 sm:col-span-2 lg:col-span-1">
                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-lg text-primary" aria-hidden="true">⌗</span>
                  <h2 className="font-extrabold text-foreground">Kanal, Marla & Sq Ft</h2>
                </div>
                <p className="mt-3 text-sm leading-6 text-foreground/65">
                  Convert each calculated share into Kanal, Marla, and square feet for easier land-area
                  comparison and record keeping.
                </p>
              </article>
            </div>

            <div className="mt-7 rounded-2xl border border-border bg-background/45 p-4 sm:p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="font-extrabold text-foreground">Popular property-share searches</h2>
                  <p className="mt-1 text-xs leading-5 text-foreground/55">Common ways people search for this type of calculation.</p>
                </div>
                <div className="flex flex-wrap gap-2" aria-label="Related search terms">
                  {[
                    'Property Share Calculator',
                    'Equal Property Division Calculator',
                    'Hissa Calculator',
                    'Land Share Calculator',
                    'Property Hissa Calculator',
                    'Land Division Calculator',
                  ].map((term) => (
                    <span key={term} className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground/70">
                      {term}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-7 grid gap-3 lg:grid-cols-2">
              <details className="group rounded-2xl border border-border bg-background/45 p-4 open:bg-background/65">
                <summary className="cursor-pointer list-none font-extrabold text-foreground marker:hidden">
                  <span className="flex items-center justify-between gap-4">
                    How do I divide property equally between owners?
                    <span className="text-primary transition group-open:rotate-45" aria-hidden="true">＋</span>
                  </span>
                </summary>
                <p className="mt-3 pr-5 text-sm leading-6 text-foreground/65">
                  Enter the total property area, add the number of owners, and use Auto Fill Shares. The
                  calculator assigns equal fractions such as 1/2, 1/3, or 1/4 and shows the corresponding area for each owner.
                </p>
              </details>

              <details className="group rounded-2xl border border-border bg-background/45 p-4 open:bg-background/65">
                <summary className="cursor-pointer list-none font-extrabold text-foreground marker:hidden">
                  <span className="flex items-center justify-between gap-4">
                    What is a hissa in property or land?
                    <span className="text-primary transition group-open:rotate-45" aria-hidden="true">＋</span>
                  </span>
                </summary>
                <p className="mt-3 pr-5 text-sm leading-6 text-foreground/65">
                  Hissa commonly refers to a share or portion of property. This calculator represents a
                  hissa mathematically using a fraction and calculates the matching area from the total property size.
                </p>
              </details>

              <details className="group rounded-2xl border border-border bg-background/45 p-4 open:bg-background/65">
                <summary className="cursor-pointer list-none font-extrabold text-foreground marker:hidden">
                  <span className="flex items-center justify-between gap-4">
                    Can I calculate land shares in Kanal and Marla?
                    <span className="text-primary transition group-open:rotate-45" aria-hidden="true">＋</span>
                  </span>
                </summary>
                <p className="mt-3 pr-5 text-sm leading-6 text-foreground/65">
                  Yes. Enter Kanal, Marla, and square feet in the Land Details section. Each person&apos;s
                  result is shown as Kanal, Marla, and remaining square feet.
                </p>
              </details>

              <details className="group rounded-2xl border border-border bg-background/45 p-4 open:bg-background/65">
                <summary className="cursor-pointer list-none font-extrabold text-foreground marker:hidden">
                  <span className="flex items-center justify-between gap-4">
                    Does this calculator decide legal inheritance shares?
                    <span className="text-primary transition group-open:rotate-45" aria-hidden="true">＋</span>
                  </span>
                </summary>
                <p className="mt-3 pr-5 text-sm leading-6 text-foreground/65">
                  No. It performs mathematical property-share calculations only. Legal ownership,
                  inheritance, succession, or religious entitlement should be confirmed with the relevant authority or a qualified professional.
                </p>
              </details>
            </div>

            <p className="mt-7 rounded-xl border border-border bg-background/35 px-4 py-3 text-xs leading-5 text-foreground/50">
              <strong className="text-foreground/65">Note:</strong> This is a mathematical property-share
              tool. It does not determine legal, inheritance, succession, or religious entitlement.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
