'use client';

import { useEffect, useRef } from 'react';

export default function CelebrationOverlay() {
  const launched = useRef(false);

  useEffect(() => {
    if (launched.current) return;
    launched.current = true;

    const shapes = ['★', '✦', '●', '▲', '♦'];
    const colors = ['#FFD700', '#4a7c4a', '#ff6b6b', '#f5f0e8', '#FFC107'];

    for (let i = 0; i < 60; i++) {
      setTimeout(() => {
        const el = document.createElement('div');
        el.textContent = shapes[Math.floor(Math.random() * shapes.length)];
        Object.assign(el.style, {
          position: 'fixed',
          top: '-20px',
          left: `${Math.random() * 100}vw`,
          fontSize: `${10 + Math.random() * 14}px`,
          color: colors[Math.floor(Math.random() * colors.length)],
          animation: `confettiFall ${2.5 + Math.random() * 3}s linear forwards`,
          pointerEvents: 'none',
          zIndex: '1000',
        });
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 7000);
      }, i * 100);
    }
  }, []);

  return (
    <div
      className="fixed inset-0 z-[999] flex flex-col items-center justify-center text-center"
      style={{ background: 'rgba(0,0,0,0.92)' }}
    >
      <div style={{ fontSize: 60, marginBottom: 20 }}>🎖️</div>

      <h1
        style={{
          fontFamily: "'Tajawal', sans-serif",
          fontSize: 48,
          fontWeight: 900,
          background: 'linear-gradient(135deg,#FFD700,#fff5a0,#FFD700)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginBottom: 12,
        }}
      >
        مبروك يا بطل!
      </h1>

      <p style={{ fontSize: 18, color: 'var(--c-text2)' }}>
        أنهيت خدمتك وعشت التجربة. دلوقتي حر!
      </p>
    </div>
  );
}
