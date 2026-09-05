'use client';

import { useEffect } from 'react';

const ADSENSE_CLIENT = 'ca-pub-3995420051808249';

/** Shared ad slot rendered on every page that uses the site shell. */
export default function PageUtilities() {
  useEffect(() => {
    try {
      const ads = (window as Window & { adsbygoogle?: unknown[] }).adsbygoogle || [];
      (window as Window & { adsbygoogle?: unknown[] }).adsbygoogle = ads;
      ads.push({});
    } catch {
      // Ad blockers or restricted environments can prevent the ad request.
    }
  }, []);

  return (
    <section aria-label="Advertisement" className="border-b border-border bg-background">
      <div className="mx-auto max-w-[1280px] px-4 py-4 sm:px-6 sm:py-5">
        <aside
          aria-label="Advertisement"
          className="relative flex min-h-[90px] w-full items-center justify-center overflow-hidden rounded-2xl border border-dashed border-border bg-foreground/[0.02] px-4 text-center"
        >
          <ins
            className="adsbygoogle block min-h-[90px] w-full"
            style={{ display: 'block' }}
            data-ad-client={ADSENSE_CLIENT}
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
          <span className="pointer-events-none absolute -z-10 text-xs text-foreground/25">Advertisement</span>
        </aside>
      </div>
    </section>
  );
}
