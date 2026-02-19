'use client';

import { useEffect } from 'react';

export default function ServiceWorker() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) {
      return;
    }

    const onLoad = () => {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        // Registration failure is non-fatal for the app.
      });
    };

    window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad);
  }, []);

  return null;
}
