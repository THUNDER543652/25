'use client';
import React, { useState, useEffect } from 'react';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import Link from 'next/link';

interface FeatureResult {
  name: string;
  supported: boolean | string;
  category: string;
  detail?: string;
}

export default function BrowserTestPage() {
  const [features, setFeatures] = useState<FeatureResult[]>([]);
  const [browserInfo, setBrowserInfo] = useState<Record<string, string>>({});
  const [testRun, setTestRun] = useState(0);

  useEffect(() => {
    const ua = navigator.userAgent;
    const getBrowser = () => {
      if (ua.includes('Edg/')) return 'Microsoft Edge';
      if (ua.includes('Chrome/')) return 'Google Chrome';
      if (ua.includes('Firefox/')) return 'Mozilla Firefox';
      if (ua.includes('Safari/') && !ua.includes('Chrome')) return 'Apple Safari';
      return 'Unknown';
    };

    setBrowserInfo({
      Browser: getBrowser(),
      'User Agent': ua.slice(0, 80) + '...',
      Platform: navigator.platform || 'Unknown',
      Language: navigator.language,
      'Cores': String(navigator.hardwareConcurrency ?? 'Unknown'),
      'Memory': (navigator as unknown as Record<string, unknown>).deviceMemory ? `${(navigator as unknown as Record<string, unknown>).deviceMemory}GB` : 'Unknown',
      'Screen': `${screen.width}x${screen.height}`,
      'Color Depth': `${screen.colorDepth}-bit`,
    });

    const checkWebGL = () => {
      try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (!gl) return 'Not supported';
        const ext = (gl as WebGLRenderingContext).getExtension('WEBGL_debug_renderer_info');
        return ext ? (gl as WebGLRenderingContext).getParameter(ext.UNMASKED_RENDERER_WEBGL) : 'Supported';
      } catch { return 'Not supported'; }
    };

    const checkWebGL2 = () => {
      try {
        const canvas = document.createElement('canvas');
        return !!canvas.getContext('webgl2') ? 'Supported' : 'Not supported';
      } catch { return 'Not supported'; }
    };

    const checkWebGPU = () => {
      return 'gpu' in navigator ? 'Supported' : 'Not supported';
    };

    const results: FeatureResult[] = [
      // JavaScript
      { name: 'JavaScript', supported: true, category: 'JavaScript', detail: 'ES2023+' },
      { name: 'Web Workers', supported: typeof Worker !== 'undefined', category: 'JavaScript' },
      { name: 'Service Workers', supported: 'serviceWorker' in navigator, category: 'JavaScript' },
      { name: 'WebAssembly', supported: typeof WebAssembly !== 'undefined', category: 'JavaScript' },
      { name: 'Async/Await', supported: true, category: 'JavaScript' },
      // WebGL
      { name: 'WebGL', supported: checkWebGL(), category: 'WebGL' },
      { name: 'WebGL 2.0', supported: checkWebGL2(), category: 'WebGL' },
      { name: 'WebGPU', supported: checkWebGPU(), category: 'WebGL' },
      // APIs
      { name: 'Gamepad API', supported: 'getGamepads' in navigator, category: 'APIs' },
      { name: 'Web Audio API', supported: typeof AudioContext !== 'undefined' || typeof (window as unknown as Record<string, unknown>).webkitAudioContext !== 'undefined', category: 'APIs' },
      { name: 'MediaDevices API', supported: 'mediaDevices' in navigator, category: 'APIs' },
      { name: 'Geolocation API', supported: 'geolocation' in navigator, category: 'APIs' },
      { name: 'Notifications API', supported: 'Notification' in window, category: 'APIs' },
      { name: 'Clipboard API', supported: 'clipboard' in navigator, category: 'APIs' },
      { name: 'Battery API', supported: 'getBattery' in navigator, category: 'APIs' },
      { name: 'Vibration API', supported: 'vibrate' in navigator, category: 'APIs' },
      // Storage
      { name: 'localStorage', supported: typeof localStorage !== 'undefined', category: 'Storage' },
      { name: 'sessionStorage', supported: typeof sessionStorage !== 'undefined', category: 'Storage' },
      { name: 'IndexedDB', supported: typeof indexedDB !== 'undefined', category: 'Storage' },
      { name: 'Cache API', supported: 'caches' in window, category: 'Storage' },
      // CSS
      { name: 'CSS Grid', supported: CSS.supports('display', 'grid'), category: 'CSS' },
      { name: 'CSS Flexbox', supported: CSS.supports('display', 'flex'), category: 'CSS' },
      { name: 'CSS Variables', supported: CSS.supports('color', 'var(--test)'), category: 'CSS' },
      { name: 'CSS Animations', supported: CSS.supports('animation', 'none'), category: 'CSS' },
    ];
    setFeatures(results);
  }, [testRun]);

  const categories = [...new Set(features.map(f => f.category))];
  const supported = features.filter(f => f.supported === true || (typeof f.supported === 'string' && f.supported !== 'Not supported')).length;
  const total = features.length;

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="max-w-4xl mx-auto px-6 lg:px-8 pt-28 pb-20">
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Link href="/" className="text-xs text-muted-foreground hover:text-primary transition-colors">Home</Link>
            <span className="text-muted-foreground/40">/</span>
            <span className="text-xs text-primary">Browser Test</span>
          </div>
          <span className="inline-flex items-center gap-2 glass-card rounded-full px-3 py-1.5 text-xs font-semibold text-primary uppercase tracking-widest mb-4">Performance</span>
          <h1 className="text-section-title font-bold text-foreground mb-3">
            Browser <span className="text-primary">Feature Test</span>
          </h1>
          <p className="text-muted-foreground text-base leading-relaxed max-w-xl">
            Check browser feature support including JavaScript APIs, WebGL, WebGPU, CSS features, and more.
          </p>
          <button onClick={() => { setFeatures([]); setBrowserInfo({}); setTestRun((run) => run + 1); }} className="mt-5 rounded-xl border border-primary/40 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary hover:bg-primary hover:text-black">↻ Run test again</button>
        </div>

        {/* Score */}
        <div className="glass-card rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-foreground">Compatibility Score</h3>
            <span className="font-mono text-lg font-bold text-primary">{supported}/{total}</span>
          </div>
          <div className="glass-card rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${(supported / total) * 100}%`, boxShadow: 'rgba(0,212,255,0.5) 0 0 10px' }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">{supported} of {total} features supported</p>
        </div>

        {/* Browser Info */}
        <div className="glass-card rounded-2xl p-6 mb-8">
          <h3 className="text-sm font-semibold text-foreground mb-4">Browser Information</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(browserInfo).slice(0, 8).map(([key, val]) => (
              <div key={key} className="glass-card rounded-xl p-3">
                <div className="text-xs text-muted-foreground mb-1">{key}</div>
                <div className="text-xs font-semibold text-foreground truncate">{val}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Feature Categories */}
        {categories.map(cat => (
          <div key={cat} className="glass-card rounded-2xl p-6 mb-4">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-3 py-1 text-xs font-semibold text-primary uppercase tracking-widest mb-4">{cat}</div>
            <div className="space-y-2">
              {features.filter(f => f.category === cat).map(f => (
                <div key={f.name} className="flex items-center justify-between py-1.5">
                  <div>
                    <span className="text-sm font-semibold text-foreground">{f.name}</span>
                    {f.detail && <span className="text-xs text-muted-foreground ml-2">{f.detail}</span>}
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                    f.supported === true || (typeof f.supported === 'string' && f.supported !== 'Not supported')
                      ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20' :'text-rose-400 bg-rose-500/10 border border-rose-500/20'
                  }`}>
                    {f.supported === true ? 'Supported' : f.supported === false ? 'Not Supported' : f.supported}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <Footer />
    </main>
  );
}
