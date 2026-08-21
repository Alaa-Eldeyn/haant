'use client';

import { useStats } from '../hooks/useStats';
import { useSettings } from '../hooks/useSettings';

export default function VacationCard() {
  const stats = useStats();
  const { settings } = useSettings();

  if (!stats) return null;

  const { vacStatus, vacCycleProgress, nextVacStart } = stats;

  let icon: string;
  let title: string;
  let main: string;
  let sub: string;
  let prog: number;

  if (vacStatus.onVac) {
    icon  = '🏖️';
    title = 'انت دلوقتي في إجازة!';
    main  = `${vacStatus.daysLeft} يوم متبقي`;
    sub   = 'استمتع بكل لحظة يا بطل 🎉';
    prog  = vacCycleProgress;
  } else {
    const nextVacStr = nextVacStart
      ? nextVacStart.toLocaleDateString('ar-EG', { day: 'numeric', month: 'long' })
      : '';
    const nextDay = nextVacStart
      ? nextVacStart.toLocaleDateString('ar-EG', { weekday: 'long' })
      : '';

    icon  = '⏳';
    title = 'متبقي على الإجازة الجاية';
    main  = `${vacStatus.daysToNext} يوم`;
    sub   = nextVacStr ? `هتنزل ${nextVacStr} إن شاء الله — هيكون يوم ${nextDay}` : '';
    prog  = Math.max(0, 100 - (vacStatus.daysToNext! / settings.amalahDays) * 100);
  }

  return (
    <div
      style={{
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        background: 'linear-gradient(145deg,#002e2a,#003d36)',
        border: '1px solid rgba(79,247,220,0.25)',
        display: 'flex',
        alignItems: 'center',
        gap: 14,
      }}
    >
      <span style={{ fontSize: 36, flexShrink: 0 }}>{icon}</span>

      <div style={{ flex: 1 }}>
        <p style={{ fontSize: 12, color: 'var(--c-text3)', marginBottom: 4 }}>{title}</p>
        <p
          style={{
            fontFamily: "'Tajawal', sans-serif",
            fontSize: 22,
            fontWeight: 900,
            color: '#4ff7dc',
          }}
        >
          {main}
        </p>
        {sub && <p style={{ fontSize: 12, color: 'var(--c-text3)', marginTop: 2 }}>{sub}</p>}

        <div
          style={{
            height: 4,
            background: 'rgba(255,255,255,0.08)',
            borderRadius: 4,
            marginTop: 8,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              borderRadius: 4,
              width: `${Math.min(100, Math.max(0, prog))}%`,
              background: 'linear-gradient(90deg,#2dd4b4,#4ff7dc)',
              transition: 'width 1s ease',
            }}
          />
        </div>
      </div>
    </div>
  );
}