'use client';

import { useStats } from '../hooks/useStats';
import { getRank } from '../lib/rank';

export default function Header() {
  const stats = useStats();
  const now = new Date();

  const dayName = now.toLocaleDateString('ar-EG', { weekday: 'long' });
  const fullDate = now.toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const rank = getRank(stats?.pct ?? 0);

  return (
    <div className="text-center mb-4 relative">
      {/* Stars row */}
      <div className="flex justify-center gap-3 mb-3">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            style={{
              fontSize: 22,
              display: 'inline-block',
              animation: 'starPulse 2s ease-in-out infinite',
              animationDelay: `${i * 0.3}s`,
              filter: 'drop-shadow(0 0 8px #FFD700)',
            }}
          >
            ⭐
          </span>
        ))}
      </div>

      {/* Title */}
      <h1
        style={{
          fontFamily: "'Tajawal', sans-serif",
          fontSize: 'clamp(22px, 6vw, 30px)',
          fontWeight: 900,
          background: 'linear-gradient(135deg, #FFD700 0%, #fff5a0 40%, #FFC107 70%, #B8860B 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          letterSpacing: 1,
          marginBottom: 6,
        }}
      >
        ابلكيشن الـ &quot;هانت&quot;
      </h1>

      {/* Rank badge */}
      <p className="text-sm tracking-widest" style={{ color: 'var(--c-text3)', marginBottom: 14 }}>
        {rank.icon} {rank.title} {rank.icon}
      </p>

      {/* Date pill */}
      <div
        style={{
          width: 'fit-content',
          margin: '0 auto 20px',
          borderRadius: 16,
          border: '1px solid rgba(255,215,0,0.2)',
          background: 'linear-gradient(145deg, var(--c-bg3), var(--c-army))',
          padding: '10px 20px',
          boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
        }}
      >
        <div className="flex items-center justify-center gap-2 text-sm flex-wrap">
          <span style={{ color: 'var(--c-text2)' }}>📅 اليوم:</span>
          <span
            style={{
              fontWeight: 800,
              background: 'linear-gradient(90deg, #FFD700, #fff5a0, #B8860B)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {dayName}
          </span>
          <span style={{ color: 'var(--c-text3)' }}>( {fullDate} )</span>
        </div>
      </div>
    </div>
  );
}