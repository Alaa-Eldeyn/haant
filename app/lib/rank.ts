export function getRank(progress: number) {
  if (progress >= 100) {
    return {
      title: "باشا البلد",
      icon: "👑",
    };
  }

  if (progress >= 75) {
    return {
      title: "رديف",
      icon: "🎖️",
    };
  }

  if (progress >= 50) {
    return {
      title: "نائب رديف",
      icon: "⭐",
    };
  }

  if (progress >= 25) {
    return {
      title: "عسكري كحول",
      icon: "💪",
    };
  }

  return {
    title: "عسكري مستجد",
    icon: "🪖",
  };
}