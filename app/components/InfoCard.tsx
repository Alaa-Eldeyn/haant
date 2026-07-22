// components/ui/InfoCard.tsx

interface InfoCardProps {
  icon: string;
  value: string | number;
  label: string;
  color?: "blue" | "purple" | "green" | "orange" | "gold";
  progress?: number; // 0-100
}

const colorMap = {
  blue: {
    border: "border-blue/40",
    bg: "bg-[#0c2a3a]",
    text: "text-blue",
    progress: "bg-blue",
  },
  purple: {
    border: "border-purple/40",
    bg: "bg-[#1a0a2e]",
    text: "text-purple",
    progress: "bg-purple",
  },
  green: {
    border: "border-green-600/40",
    bg: "bg-[#0a2a0a]",
    text: "text-green-600",
    progress: "bg-green-600",
  },
  orange: {
    border: "border-orange/40",
    bg: "bg-[#2a1a00]",
    text: "text-orange",
    progress: "bg-orange",
  },
  gold: {
    border: "border-gold/40",
    bg: "bg-[#2a1f00]",
    text: "text-gold",
    progress: "bg-gold",
  },
};

export const InfoCard = ({
  icon,
  value,
  label,
  color = "gold",
  progress,
}: InfoCardProps) => {
  const c = colorMap[color];

  return (
    <div
      className={`relative rounded-2xl border ${c.border} ${c.bg} p-4 text-center overflow-hidden flex flex-col items-center gap-1`}
    >
      {/* Icon */}
      <span className="text-2xl">{icon}</span>

      {/* Value */}
      <span className={`font-tajawal text-3xl font-black leading-none ${c.text}`}>
        {value}
      </span>

      {/* Label */}
      <span className="text-content3 text-xs mt-1">{label}</span>

      {/* Progress bar */}
      {progress !== undefined && (
        <div className="w-full mt-2 h-1 rounded-full bg-white/5 overflow-hidden">
          <div
            className={`h-full rounded-full ${c.progress} relative overflow-hidden transition-all duration-700`}
            style={{ width: `${progress}%` }}
          >
            <span className="progress-shine" />
          </div>
        </div>
      )}
    </div>
  );
};