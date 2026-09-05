import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TestDirectory from '@/app/components/TestDirectory';

export default function TestToolPage() {
  return <main className="min-h-screen bg-background"><Header /><div className="mx-auto max-w-[1280px] px-5 pt-10 lg:px-8"><a href="/device-test-series" className="group flex flex-col gap-3 rounded-3xl border border-primary/30 bg-primary/5 p-6 transition hover:border-primary hover:bg-primary/10 sm:flex-row sm:items-center sm:justify-between"><div><div className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Recommended</div><div className="mt-1 text-2xl font-bold text-foreground">Full Device Test</div><div className="mt-1 text-sm text-foreground/55">Run the most useful laptop/mobile checks in sequence and download one combined PDF report.</div></div><span className="rounded-xl bg-primary px-5 py-3 text-sm font-bold text-black transition group-hover:brightness-110">Start full test →</span></a></div><TestDirectory /><Footer /></main>;
}
