export interface Settings {
  startDate: string;
  endDate: string;
  amalahDays: number;
  vacDays: number;
  vacTurn: 1 | 2 | 3;
  nextVacDate: string; // override anchor date (fix-vac)
}

export const DEFAULT_SETTINGS: Settings = {
  startDate: '2026-02-25',
  endDate: '2027-02-25',
  amalahDays: 20,
  vacDays: 10,
  vacTurn: 2,
  nextVacDate: '',
};

export interface VacStatus {
  onVac: boolean;
  daysLeft?: number;   // when onVac
  daysIn?: number;     // when onVac
  daysToNext?: number; // when !onVac
}

export interface Stats {
  remainDays: number;
  totalDays: number;
  elapsedDays: number;
  pct: number;

  remainMonths: number;
  weeksRemain: number;

  totalAmalah: number;
  currentAmalah: number;
  remainAmalah: number;

  remainKhidma: number;
  totalKhidma: number;

  remainVacTotal: number;
  totalVac: number;

  vacStatus: VacStatus;
  vacCycleProgress: number;
  nextVacStart: Date;
}

function startOfDay(d: Date): Date {
  const r = new Date(d);
  r.setHours(0, 0, 0, 0);
  return r;
}

function endOfDay(d: Date): Date {
  const r = new Date(d);
  r.setHours(23, 59, 59, 999);
  return r;
}

export function calcStats(settings: Settings): Stats {
  const now = new Date();
  const start = new Date(settings.startDate);
  const end = new Date(settings.endDate);

  const totalMs = end.getTime() - start.getTime();
  const remainMs = end.getTime() - now.getTime();
  const elapsed = now.getTime() - start.getTime();

  const totalDays = Math.max(1, Math.floor(totalMs / 86400000));
  const remainDays = Math.max(0, Math.floor(remainMs / 86400000));
  const elapsedDays = Math.max(0, Math.floor(elapsed / 86400000));
  const pct = Math.min(100, Math.max(0, (elapsedDays / totalDays) * 100));

  const cycle = settings.amalahDays + settings.vacDays;
  const totalCycles = Math.floor(totalDays / cycle);
  const totalAmalah =
    totalCycles +
    Math.ceil(
      Math.max(0, totalDays - totalCycles * cycle - settings.vacDays) /
      settings.amalahDays
    );

  // ── Vacation anchor calculation ──────────────────────────────────────────
  // Base anchor: Turn 2 next vacation starts 2026-09-11 (real confirmed date).
  // Turn 1 = baseTurn2 - vacDays, Turn 3 = baseTurn2 + vacDays.
  // When the user changes their turn, this recalculates correctly.
  // Manual nextVacDate override always takes priority.
  const vacDuration = settings.vacDays;
  let anchorVacStart: Date;

  if (settings.nextVacDate) {
    // Manual override: user has confirmed their exact upcoming vacation date
    anchorVacStart = startOfDay(new Date(settings.nextVacDate));
  } else {
    // Turn 2 anchor is the real-world verified date; other turns are offset from it
    const TURN2_ANCHOR = startOfDay(new Date('2026-09-11'));
    const turnOffset = (settings.vacTurn - 2) * settings.vacDays;
    anchorVacStart = new Date(TURN2_ANCHOR.getTime() + turnOffset * 86400000);
  }

  // Find the correct current/next vacation window
  let tempStart = new Date(anchorVacStart);
  while (
    new Date(tempStart.getTime() + cycle * 86400000) < now
  ) {
    tempStart = new Date(tempStart.getTime() + cycle * 86400000);
  }

  const tempEnd = new Date(
    tempStart.getTime() + (vacDuration - 1) * 86400000
  );

  let vacStart: Date;
  let vacEndD: Date;

  const todayStart = startOfDay(now);
  const todayEnd = endOfDay(now);

  if (now >= tempStart && now <= tempEnd) {
    vacStart = tempStart;
    vacEndD = tempEnd;
  } else if (now < tempStart) {
    vacStart = tempStart;
    vacEndD = tempEnd;
  } else {
    vacStart = new Date(tempStart.getTime() + cycle * 86400000);
    vacEndD = new Date(vacStart.getTime() + (vacDuration - 1) * 86400000);
  }

  // ── Vacation status ──────────────────────────────────────────────────────
  const onVac = todayStart >= vacStart && todayStart <= vacEndD;
  let vacStatus: VacStatus;
  let vacCycleProgress: number;

  if (onVac) {
    const daysIntoVac = Math.floor(
      (todayStart.getTime() - vacStart.getTime()) / 86400000
    );
    const daysLeftVac =
      Math.floor((vacEndD.getTime() - todayStart.getTime()) / 86400000) + 1;
    vacStatus = { onVac: true, daysLeft: daysLeftVac, daysIn: daysIntoVac };
    vacCycleProgress = (daysIntoVac / vacDuration) * 100;
  } else {
    const daysToNext = Math.ceil(
      (vacStart.getTime() - todayEnd.getTime()) / 86400000
    );
    vacStatus = { onVac: false, daysToNext };
    vacCycleProgress = Math.min(
      100,
      ((settings.amalahDays - daysToNext) / settings.amalahDays) * 100
    );
  }

  // ── Service / vacation split ─────────────────────────────────────────────
  const remainDaysExact = Math.max(
    0,
    Math.round((end.getTime() - todayEnd.getTime()) / 86400000)
  );

  let serviceLeftInCurCycle: number;
  let vacLeftInCurCycle: number;

  if (onVac) {
    serviceLeftInCurCycle = 0;
    vacLeftInCurCycle = vacStatus.daysLeft!;
  } else {
    serviceLeftInCurCycle = vacStatus.daysToNext!;
    vacLeftInCurCycle = vacDuration;
  }

  const daysAfterCurCycle = Math.max(
    0,
    remainDaysExact - serviceLeftInCurCycle - vacLeftInCurCycle
  );
  const fullCyclesAfter = Math.floor(daysAfterCurCycle / cycle);
  const extraAfter = daysAfterCurCycle % cycle;
  const extraService = Math.min(extraAfter, settings.amalahDays);

  const remainKhidma =
    Math.min(remainDaysExact, serviceLeftInCurCycle) +
    fullCyclesAfter * settings.amalahDays +
    extraService;
  const remainVacTotal = remainDaysExact - remainKhidma;

  const remainAmalah = Math.floor(remainDaysExact / cycle);
  const currentAmalah = totalAmalah - remainAmalah + 1;

  const remainMonths = Math.floor(remainDays / 30);
  const weeksRemain = Math.floor(remainDays / 7);

  return {
    remainDays,
    totalDays,
    elapsedDays,
    pct: Math.round(pct * 10) / 10,

    remainMonths,
    weeksRemain,

    totalAmalah,
    currentAmalah,
    remainAmalah,

    remainKhidma,
    totalKhidma: totalAmalah * settings.amalahDays,

    remainVacTotal,
    totalVac: totalAmalah * settings.vacDays,

    vacStatus,
    vacCycleProgress,
    nextVacStart: vacStart,
  };
}

export function getRank(elapsedDays: number): string {
  if (elapsedDays < 30) return '🪖 عسكري مستجد 🪖';
  if (elapsedDays < 90) return '🪖 عسكري مستجد 🪖';
  if (elapsedDays < 180) return '💪 عسكري كحول 💪';
  if (elapsedDays < 270) return '⭐ نائب رديف ⭐';
  if (elapsedDays < 365) return '🎖️ رديف 🎖️';
  return '👑 باشا البلد 👑';
}

export function arabicDate(): string {
  return new Date().toLocaleDateString('ar-EG', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
