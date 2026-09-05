'use client';

import { useEffect } from 'react';

export default function ScrollAnimationInit() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            const delay = el.dataset.delay || '0';
            setTimeout(() => {
              el.style.animation = `fadeSlideIn 0.9s ease-out forwards`;
              el.classList.add('in-view');
            }, parseInt(delay));
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -5% 0px' }
    );

    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach((el, i) => {
      (el as HTMLElement).dataset.delay = String(i % 4 * 80);
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return null;
}