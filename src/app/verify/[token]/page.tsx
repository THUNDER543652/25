import { BadgeCheck, CalendarDays, ShieldCheck } from 'lucide-react';
import { verifyCertificateToken } from '@/lib/certificates';
import PageUtilities from '@/components/PageUtilities';

export default async function CertificateVerificationPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const certificate = verifyCertificateToken(token);

  return (
    <main className="min-h-screen bg-background px-5 py-16 text-foreground">
      <section className="mx-auto max-w-3xl rounded-3xl border border-border bg-foreground/[0.035] p-7 shadow-2xl backdrop-blur-xl md:p-12">
        {certificate ? (
          <>
            <div className="mb-6 flex items-center gap-3 text-primary">
              <BadgeCheck className="h-10 w-10" />
              <span className="text-xs font-bold uppercase tracking-[0.2em]">TestAppara · Online Verification</span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">Verified Certificate</h1>
            <p className="mt-3 text-xl text-foreground/75">{certificate.name}</p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {[
                ['Certificate ID', certificate.certificateId],
                ['Net WPM', certificate.netWpm],
                ['Gross WPM', certificate.grossWpm],
                ['Accuracy', `${certificate.accuracy}%`],
                ['Grade', certificate.grade],
                ['Difficulty', certificate.difficulty.toUpperCase()],
                ['CPM', certificate.cpm],
                ['Issued', new Date(certificate.issuedOn).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })],
              ].map(([label, value]) => (
                <div key={String(label)} className="rounded-2xl border border-border bg-black/20 p-4">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">{label}</div>
                  <div className="mt-2 font-mono text-sm font-bold text-foreground">{value}</div>
                </div>
              ))}
            </div>
            <div className="mt-7 flex items-center gap-2 rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-4 text-sm font-semibold text-emerald-300">
              <ShieldCheck className="h-5 w-5" /> This certificate is valid and verifiable online.
            </div>
            <div className="mt-6 flex items-center gap-2 text-xs text-foreground/40">
              <CalendarDays className="h-4 w-4" /> Verification is cryptographically signed by TestAppara.
            </div>
          </>
        ) : (
          <div className="py-10 text-center">
            <ShieldCheck className="mx-auto h-12 w-12 text-rose-400" />
            <h1 className="mt-5 text-3xl font-extrabold">Certificate could not be verified</h1>
            <p className="mx-auto mt-3 max-w-lg text-foreground/55">The verification link is invalid, incomplete, or has been tampered with.</p>
          </div>
        )}
      </section>
      <PageUtilities />
    </main>
  );
}
