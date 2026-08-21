'use client';

import { useStats } from '../hooks/useStats';
import { useSettings } from '../hooks/useSettings';
import { InfoCard } from './InfoCard';

export default function InfoCards() {
  const stats = useStats();
  const { settings } = useSettings();

  if (!stats) return null;

  const { remainMonths, weeksRemain, totalDays, remainDays,
          currentAmalah, totalAmalah, remainAmalah,
          remainKhidma, totalKhidma,
          remainVacTotal, totalVac,
          vacStatus, vacCycleProgress } = stats;

  const totalMonths = Math.floor(totalDays / 30);
  const totalWeeks  = Math.floor(totalDays / 7);

  // Months progress (inverted — remaining goes down)
  const monthsProg   = Math.min(100, (remainMonths  / (totalMonths  || 1)) * 100);
  const amalahProg   = Math.min(100, (remainAmalah  / (totalAmalah  || 1)) * 100);
  const weeksProg    = Math.min(100, (weeksRemain   / (totalWeeks   || 1)) * 100);
  const vacProg      = Math.min(100, (remainVacTotal / (totalVac     || 1)) * 100);
  const khidamProg   = Math.min(100, (remainKhidma  / (totalKhidma  || 1)) * 100);

  let nextVacNum: number;
  let nextVacLabel: string;
  let nextVacProg: number;

  if (vacStatus.onVac) {
    nextVacNum   = vacStatus.daysLeft!;
    nextVacLabel = 'يوم فاضل في إجازتك';
    nextVacProg  = vacCycleProgress;
  } else {
    nextVacNum   = vacStatus.daysToNext!;
    nextVacLabel = 'يوم على إجازتك الجاية';
    nextVacProg  = 100 - Math.min(100, (vacStatus.daysToNext! / settings.amalahDays) * 100);
  }

  return (
    <section className="flex flex-col gap-2.5">
      <p
        className="text-center text-xs tracking-[3px] uppercase mt-1 mb-1"
        style={{ color: 'var(--c-text3)' }}
      >
        إحصائياتك
      </p>

      {/* Row 1 */}
      <div className="grid grid-cols-3 gap-2">
        <InfoCard icon="📅" value={remainMonths} label="شهر متبقي"             color="green"  progress={monthsProg} />
        <InfoCard icon="🔁" value={`${currentAmalah} / ${totalAmalah}`}
                            label="العمالة الحالية / الكاملة"                  color="blue"   progress={amalahProg} />
        <InfoCard icon="📆" value={weeksRemain}  label="أسبوع متبقي"           color="purple" progress={weeksProg} />
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-3 gap-2">
        <InfoCard icon="⚔️"  value={remainKhidma}   label="خدمة متبقية"           color="orange" progress={khidamProg} />
        <InfoCard icon="🏖️" value={remainVacTotal}  label="يوم إجازة متبقي"       color="gold"   progress={vacProg} />
        <InfoCard icon="🎉"  value={nextVacNum}      label={nextVacLabel}           color="teal"   progress={nextVacProg} />
      </div>
    </section>
  );
}