type Props = {
  value: number;
};

export default function ProgressBar({ value }: Props) {
  return (
    <div className="h-3 w-full overflow-hidden rounded-full bg-army2">
      <div
        className="relative h-full overflow-hidden rounded-full bg-gradient-to-r from-army4 via-light to-gold transition-all duration-1000"
        style={{ width: `${value}%` }}
      >
        <div className="progress-shine" />
      </div>
    </div>
  );
}