// This hook is superseded by useStats from AppContext.
// Kept as a no-op stub to avoid breaking any leftover imports.
export const useCountdown = () => ({
  totalDays: 0,
  elapsedDays: 0,
  remainingDays: 0,
  progress: 0,
  remainingWeeks: 0,
  remainingMonths: 0,
});