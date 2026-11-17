export interface Rank {
  title: string;
  icon: string;
}

/**
 * Returns the soldier's rank based on how much of their total service
 * period has elapsed (pct = 0–100).
 *
 * < 25%  → عسكري مستجد  🪖
 * 25–50% → عسكري كحول   💪
 * 50–75% → نائب رديف    ⭐
 * 75–95% → رديف         🎖️
 * 95–100% → ملكي        👑
 */
export function getRank(pct: number): Rank {
  // console.log(pct)
  if (pct >= 95) {
    return { title: 'ملكي', icon: '👑' };
  }
  if (pct >= 75) {
    return { title: 'رديف', icon: '🎖️' };
  }
  if (pct >= 50) {
    return { title: 'نائب رديف', icon: '⭐' };
  }
  if (pct >= 25) {
    return { title: 'عسكري كحول', icon: '💪' };
  }
  return { title: 'عسكري مستجد', icon: '🪖' };
}
