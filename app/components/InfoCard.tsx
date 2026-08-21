type ColorKey = 'green' | 'blue' | 'purple' | 'gold' | 'teal' | 'red' | 'orange';

interface InfoCardProps {
  icon: string;
  value: string | number;
  label: string;
  color: ColorKey;
  progress?: number; // 0–100
}

const colorStyles: Record<
  ColorKey,
  { bg: string; border: string; numColor: string; barColor: string }
> = {
  green:  { bg: 'linear-gradient(145deg,#0d2e12,#1a4a1a)', border: 'rgba(74,124,74,0.4)',   numColor: '#6fcf6f', barColor: '#6fcf6f' },
  blue:   { bg: 'linear-gradient(145deg,#0a1e2e,#0f2d4a)', border: 'rgba(79,195,247,0.3)',  numColor: '#4fc3f7', barColor: '#4fc3f7' },
  purple: { bg: 'linear-gradient(145deg,#1a0d2e,#2e1a4a)', border: 'rgba(206,147,216,0.3)', numColor: '#ce93d8', barColor: '#ce93d8' },
  gold:   { bg: 'linear-gradient(145deg,#2e1f00,#4a3300)', border: 'rgba(255,193,7,0.3)',   numColor: '#FFD700', barColor: '#FFD700' },
  teal:   { bg: 'linear-gradient(145deg,#002e2a,#004a42)', border: 'rgba(79,247,220,0.3)',  numColor: '#4ff7dc', barColor: '#4ff7dc' },
  red:    { bg: 'linear-gradient(145deg,#2e0a0a,#4a1010)', border: 'rgba(247,79,79,0.3)',   numColor: '#f74f4f', barColor: '#f74f4f' },
  orange: { bg: 'linear-gradient(145deg,#2e1800,#4a2800)', border: 'rgba(255,183,77,0.4)',  numColor: '#ffb74d', barColor: '#ffb74d' },
};

export function InfoCard({ icon, value, label, color, progress }: InfoCardProps) {
  const c = colorStyles[color];

  return (
    <div
      style={{
        borderRadius: 14,
        padding: '14px 10px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        background: c.bg,
        border: `1px solid ${c.border}`,
      }}
    >
      {/* hatch overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.08,
          background: `repeating-linear-gradient(
            -45deg,
            transparent,
            transparent 6px,
            rgba(255,255,255,0.5) 6px,
            rgba(255,255,255,0.5) 7px
          )`,
          pointerEvents: 'none',
        }}
      />

      <span style={{ fontSize: 20, display: 'block', marginBottom: 6 }}>{icon}</span>

      <span
        style={{
          fontFamily: "'Tajawal', sans-serif",
          fontSize: 'clamp(26px, 7vw, 36px)',
          fontWeight: 900,
          lineHeight: 1,
          display: 'block',
          color: c.numColor,
        }}
      >
        {value}
      </span>

      <p style={{ fontSize: 11, color: 'var(--c-text3)', marginTop: 4, lineHeight: 1.3 }}>
        {label}
      </p>

      {progress !== undefined && (
        <div
          style={{
            height: 3,
            background: 'rgba(255,255,255,0.08)',
            borderRadius: 3,
            marginTop: 8,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              borderRadius: 3,
              width: `${Math.min(100, Math.max(0, progress))}%`,
              background: c.barColor,
              transition: 'width 1s ease',
            }}
          />
        </div>
      )}
    </div>
  );
}