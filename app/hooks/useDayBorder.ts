'use client';

import { useEffect, useState } from 'react';

function getPct(): number {
  const now = new Date();
  const secs = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
  return (secs / 86400) * 100;
}

export function useDayBorderPct(): number {
  // Start at 0 on SSR — set real value client-side to avoid hydration mismatch
  const [pct, setPct] = useState<number>(0);

  useEffect(() => {
    setPct(getPct()); // immediate sync
    const id = setInterval(() => setPct(getPct()), 1000);
    return () => clearInterval(id);
  }, []);

  return pct;
}
