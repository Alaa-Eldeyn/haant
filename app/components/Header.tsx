'use client';
import { differenceInDays } from 'date-fns';
import { useSettings } from '../hooks/useSettings';
import { getRank } from '../lib/rank';

const Header = () => {
  const now = new Date();
  const dayName = now.toLocaleDateString('ar-EG', { weekday: 'long' });
  const fullDate = now.toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const { settings } = useSettings();
  const totalDays = differenceInDays(settings?.endDate, settings?.startDate);
  const elapsedDays = differenceInDays(new Date(), settings?.startDate);
  const progress = Math.min(
    100,
    Math.max(0, (elapsedDays / totalDays) * 100)
  );


  return (
    <div className="text-center mb-4 relative">
      {/* Stars row */}
      <div className="flex justify-center gap-3 mb-3">
        {['⭐', '⭐', '⭐'].map((star, i) => (
          <span
            key={i}
            className="text-[22px] drop-shadow-[0_0_8px_#FFD700]"
            style={{
              display: 'inline-block',
              animation: `starPulse 2s ease-in-out infinite`,
              animationDelay: `${i * 0.3}s`,
            }}
          >
            {star}
          </span>
        ))}
      </div>

      {/* Title */}
      <h1
        className="font-black tracking-wide mb-1.5"
        style={{
          fontFamily: "'Tajawal', sans-serif",
          fontSize: 'clamp(22px, 6vw, 30px)',
          background:
            'linear-gradient(135deg, #FFD700 0%, #fff5a0 40%, #FFC107 70%, #B8860B 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          letterSpacing: '1px',
        }}
      >
        ابلكيشن الـ &quot;هانت&quot;
      </h1>

      {/* Rank badge / subtitle */}
      <p
        className="text-sm tracking-[2px] mb-4 text-[#6a9a6a]"
      >
        {getRank(progress).icon} {getRank(progress).title} {getRank(progress).icon}
      </p>
      <div className="mx-auto w-fit rounded-2xl border border-gold/20 bg-[linear-gradient(145deg,var(--color-bg3),var(--color-army))] px-6 py-3 shadow-lg shadow-black/20 backdrop-blur-sm">
        <div className="flex items-center gap-2 text-base md:text-lg">
          <span className="text-content2">📅 اليوم:</span>

          <span className="bg-gradient-to-r from-gold via-yellow-300 to-gold-dark bg-clip-text font-extrabold text-transparent">
            {dayName}
          </span>

          <span className="text-content3">
            (&nbsp;{fullDate}&nbsp;)
          </span>
        </div>
      </div>
    </div>
  );
};

export default Header;