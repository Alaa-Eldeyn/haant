export interface Settings {
  startDate: string;
  endDate: string;
  amalahDays: number;
  vacDays: number;
  vacTurn: 1 | 2 | 3;
  nextVacDate: string; // override anchor date (fix-vac)
  endOfDayTime: string;       // "HH:MM" — time to send end-of-day notification
  notificationsEnabled: boolean;
}

export const DEFAULT_SETTINGS: Settings = {
  startDate: '2026-02-25',
  endDate: '2027-02-25',
  amalahDays: 20,
  vacDays: 10,
  vacTurn: 2,
  nextVacDate: '',
  endOfDayTime: '22:00',
  notificationsEnabled: false,
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
  while (tempStart > now && new Date(tempStart.getTime() - cycle * 86400000) >= startOfDay(new Date(settings.startDate))) {
    tempStart = new Date(tempStart.getTime() - cycle * 86400000);
  }
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

// ── Eid Checker ────────────────────────────────────────────────────────────────
// Known Egyptian Eid dates (approximate - Islamic calendar 2026-2028)
export interface EidEntry {
  name: string;
  emoji: string;
  start: string; // 'YYYY-MM-DD'
  end: string;   // 'YYYY-MM-DD' (last day of holiday)
}

export interface EidMatch {
  eid: EidEntry;
  vacStart: Date;
  vacEnd: Date;
}

export interface EidPastItem {
  eid: EidEntry;
  wasOnVac: boolean;
  vacStart?: Date;
  vacEnd?: Date;
}

export interface EidCheckResult {
  matches: EidMatch[];     // Upcoming Eids that land ON vacation
  missed: EidEntry[];      // Upcoming Eids that land ON duty
  past: EidPastItem[];     // Eids that already passed during service
  hasUpcomingEids: boolean; // Whether any Eid exists between today and service end
}

function toDateString(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/**
 * Automatically discovers all Eid al-Fitr (1-3 Shawwal) and Eid al-Adha (9-13 Dhu al-Hijjah)
 * occurrences for ANY service period in any year dynamically via the built-in Islamic calendar API.
 */
export function discoverEids(serviceStart: Date, serviceEnd: Date): EidEntry[] {
  let fmt: Intl.DateTimeFormat;
  try {
    fmt = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', { day: 'numeric', month: 'numeric' });
  } catch {
    fmt = new Intl.DateTimeFormat('en-u-ca-islamic', { day: 'numeric', month: 'numeric' });
  }

  // Scan with a 7-day padding to accurately capture Eids spanning boundaries
  let cur = new Date(serviceStart.getTime() - 7 * 86400000);
  cur.setHours(0, 0, 0, 0);
  const finish = new Date(serviceEnd.getTime() + 7 * 86400000);
  finish.setHours(0, 0, 0, 0);

  const eids: EidEntry[] = [];
  let inFitr = false;
  let fitrStart: Date | null = null;
  let inAdha = false;
  let adhaStart: Date | null = null;

  while (cur <= finish) {
    let month = 0;
    let day = 0;
    try {
      const parts = fmt.formatToParts(cur);
      for (const p of parts) {
        if (p.type === 'month') month = parseInt(p.value, 10);
        if (p.type === 'day') day = parseInt(p.value, 10);
      }
    } catch {
      /* ignore */
    }

    // Eid al-Fitr: 1 to 3 Shawwal (month 10)
    if (month === 10 && day >= 1 && day <= 3) {
      if (!inFitr) {
        inFitr = true;
        fitrStart = new Date(cur);
      }
    } else if (inFitr && fitrStart) {
      const prev = new Date(cur.getTime() - 86400000);
      eids.push({
        name: `عيد الفطر ${fitrStart.getFullYear()}`,
        emoji: '🌙',
        start: toDateString(fitrStart),
        end: toDateString(prev),
      });
      inFitr = false;
      fitrStart = null;
    }

    // Eid al-Adha: 9 (Arafah) to 13 Dhu al-Hijjah (month 12)
    if (month === 12 && day >= 9 && day <= 13) {
      if (!inAdha) {
        inAdha = true;
        adhaStart = new Date(cur);
      }
    } else if (inAdha && adhaStart) {
      const prev = new Date(cur.getTime() - 86400000);
      eids.push({
        name: `عيد الأضحى ${adhaStart.getFullYear()}`,
        emoji: '🐑',
        start: toDateString(adhaStart),
        end: toDateString(prev),
      });
      inAdha = false;
      adhaStart = null;
    }

    cur = new Date(cur.getTime() + 86400000);
  }

  // Flush in case period ends while inside an Eid
  if (inFitr && fitrStart) {
    const prev = new Date(finish);
    eids.push({
      name: `عيد الفطر ${fitrStart.getFullYear()}`,
      emoji: '🌙',
      start: toDateString(fitrStart),
      end: toDateString(prev),
    });
  }
  if (inAdha && adhaStart) {
    const prev = new Date(finish);
    eids.push({
      name: `عيد الأضحى ${adhaStart.getFullYear()}`,
      emoji: '🐑',
      start: toDateString(adhaStart),
      end: toDateString(prev),
    });
  }

  return eids;
}

export function calcEidStatus(settings: Settings): EidCheckResult {
  const now          = new Date();
  const todayStart   = startOfDay(now);
  const serviceStart = startOfDay(new Date(settings.startDate));
  const serviceEnd   = startOfDay(new Date(settings.endDate));
  const cycle        = settings.amalahDays + settings.vacDays;
  const vacDuration  = settings.vacDays;

  let anchorVacStart: Date;
  if (settings.nextVacDate) {
    anchorVacStart = startOfDay(new Date(settings.nextVacDate));
  } else {
    const TURN2_ANCHOR = startOfDay(new Date('2026-09-11'));
    const turnOffset = (settings.vacTurn - 2) * settings.vacDays;
    anchorVacStart = new Date(TURN2_ANCHOR.getTime() + turnOffset * 86400000);
  }

  // Walk backwards to first vac window on/after serviceStart
  let cursor = new Date(anchorVacStart);
  while (new Date(cursor.getTime() - cycle * 86400000) >= serviceStart) {
    cursor = new Date(cursor.getTime() - cycle * 86400000);
  }

  // Collect all vacation windows during service period
  const vacWindows: { start: Date; end: Date }[] = [];
  while (cursor <= serviceEnd) {
    const wStart = new Date(cursor);
    const wEnd   = new Date(cursor.getTime() + (vacDuration - 1) * 86400000);
    if (wStart <= serviceEnd) vacWindows.push({ start: wStart, end: wEnd });
    cursor = new Date(cursor.getTime() + cycle * 86400000);
  }

  // Dynamically discover all Eids occurring in this service range for any year!
  const discoveredEids = discoverEids(serviceStart, serviceEnd);

  const matches: EidMatch[] = [];
  const missed: EidEntry[] = [];
  const past: EidPastItem[] = [];

  for (const eid of discoveredEids) {
    const eidStart = startOfDay(new Date(eid.start));
    const eidEnd   = startOfDay(new Date(eid.end));

    // Must be within the overall service period
    if (eidEnd < serviceStart || eidStart > serviceEnd) {
      continue;
    }

    const hit = vacWindows.find((w) => eidStart <= w.end && eidEnd >= w.start);

    // Check if Eid is already in the past (ended before today)
    if (eidEnd < todayStart) {
      past.push({
        eid,
        wasOnVac: !!hit,
        vacStart: hit?.start,
        vacEnd: hit?.end,
      });
    } else {
      // Future or current Eid
      if (hit) {
        matches.push({ eid, vacStart: hit.start, vacEnd: hit.end });
      } else {
        missed.push(eid);
      }
    }
  }

  const hasUpcomingEids = matches.length > 0 || missed.length > 0;

  return { matches, missed, past, hasUpcomingEids };
}


