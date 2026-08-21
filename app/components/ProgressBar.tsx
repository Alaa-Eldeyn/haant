type Props = { value: number };

/** Simple reusable progress bar — used inside MainCard */
export default function ProgressBar({ value }: Props) {
  return (
    <div
      style={{
        height: 10,
        background: 'rgba(255,255,255,0.06)',
        borderRadius: 10,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <div
        style={{
          height: '100%',
          borderRadius: 10,
          width: `${Math.min(100, Math.max(0, value))}%`,
          background: 'linear-gradient(90deg,#3a5e3a 0%,#4a7c4a 60%,#FFC107 100%)',
          position: 'relative',
          overflow: 'hidden',
          transition: 'width 1s ease',
        }}
      >
        <div className="progress-shimmer" />
      </div>
    </div>
  );
}