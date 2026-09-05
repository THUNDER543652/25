import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://testappara.tools.com';
  const toolRoutes = [
    'keyboard-test', 'spacebar-test', 'typing-speed-test',
    'mouse-test', 'cps-test', 'mouse-accuracy-test', 'mouse-dpi-estimator',
    'mouse-polling-rate-test', 'scroll-test', 'double-click-test', 'jitter-click-test',
    'butterfly-click-test', 'drag-click-test', 'internet-speed-test', 'latency-test',
    'browser-test', 'dead-pixel-test', 'monitor-test', 'reaction-time-test',
    'gamepad-test', 'microphone-test', 'speaker-test', 'webcam-test', 'touchscreen-test', 'hissa-calculator', 'device-test-series',
  ];

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/test-tool-page`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.2,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.2,
    },
    ...toolRoutes.map((route) => ({
      url: `${baseUrl}/${route}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ];
}
