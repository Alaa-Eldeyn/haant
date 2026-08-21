'use client';

import { useDayBorderPct } from '../hooks/useDayBorder';
import { useStats } from '../hooks/useStats';

export default function MainCard() {
  const stats = useStats();
  const pct = useDayBorderPct();

  const remainDays = stats?.remainDays ?? 0;
  const elapsedDays = stats?.elapsedDays ?? 0;
  const progress = stats?.pct ?? 0;

  return (
    <div
      style={{
        position: 'relative',
        borderRadius: 22,
        marginBottom: 16,
        padding: 2,
        background: `conic-gradient(#FFD700 ${pct.toFixed(2)}%, rgba(255,215,0,0.12) ${pct.toFixed(2)}%)`,
      }}
    >
      <div
        style={{
          position: 'relative',
          borderRadius: 20,
          padding: '28px 20px',
          overflow: 'hidden',
          background: 'linear-gradient(145deg, var(--c-bg3) 0%, var(--c-army) 100%)',
        }}
      >
        {/* diagonal pattern overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `repeating-linear-gradient(
              45deg,
              transparent,
              transparent 20px,
              rgba(255,215,0,0.015) 20px,
              rgba(255,215,0,0.015) 21px
            )`,
            pointerEvents: 'none',
          }}
        />

        <p className="text-center text-xs tracking-widest mb-2" style={{ color: 'var(--c-text3)' }}>
          🎖️ مبروك ينجم خلصت{' '}
          <span style={{ color: '#deb887' }}>
            ( {elapsedDays.toLocaleString('ar-EG')} يوم )
          </span>{' '}
          وفاضلك ع التسليم ⏳
        </p>

        <span
          className="block text-center leading-none"
          style={{
            fontFamily: "'Tajawal', sans-serif",
            fontSize: 'clamp(72px, 20vw, 110px)',
            fontWeight: 900,
            background: 'linear-gradient(180deg, #fff5a0 0%, #FFD700 50%, #B8860B 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            filter: 'drop-shadow(0 0 30px rgba(255,215,0,0.4))',
            marginBottom: 4,
          }}
        >
          {remainDays.toLocaleString('ar-EG')}
        </span>

        <p className="text-center font-semibold mb-5" style={{ fontSize: 20, color: 'var(--c-text2)' }}>
          يوم
        </p>

        {/* Progress bar */}
        <div className='!mt-4'>
          <div className="flex justify-between items-center !mb-2 text-xs" style={{ color: 'var(--c-text3)' }}>
            <span>🚀 البداية</span>
            <span style={{ fontSize: 13, color: '#FFD700', fontWeight: 700 }}>
              {progress}%
            </span>
            <span>🏁 الحرية</span>
          </div>
          <div
            style={{
              height: 10,
              background: 'rgba(255,255,255,0.06)',
              borderRadius: 10,
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <div
              style={{
                height: '100%',
                borderRadius: 10,
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #3a5e3a 0%, #4a7c4a 60%, #FFC107 100%)',
                position: 'relative',
                overflow: 'hidden',
                transition: 'width 1s ease',
              }}
            >
              <div className="progress-shimmer" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}