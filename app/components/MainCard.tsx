import ProgressBar from "./ProgressBar";

type MainCardProps = {
  remainingDays: number;
  progress: number;
};

export default function MainCard({
  remainingDays,
  progress,
}: MainCardProps) {
  return (
    <section className="rounded-3xl border border-gold/20 bg-[linear-gradient(145deg,var(--color-bg3),var(--color-army))] p-6 shadow-2xl">
      <p className="mb-3 text-center text-sm font-medium tracking-[0.2em] text-content3">
        ⏳ هانت ينجم فاضلك <span className="text-gold">
          ( {remainingDays} &nbsp;يوم )&nbsp;
        </span>
        وتسلم ⏳
      </p>

      <h1
        className="text-center text-7xl font-black leading-none text-transparent bg-clip-text"
        style={{
          backgroundImage:
            "linear-gradient(180deg,#fff7b8 0%,#FFD700 60%,#B8860B 100%)",
        }}
      >
        {remainingDays}
      </h1>

      <p className="mt-2 text-center text-xl font-semibold text-content2">
        يوم
      </p>

      <div className="mt-8">
        <div className="mb-2 flex items-center justify-between text-sm text-content3">
          <span>🚀 البداية</span>

          <span className="font-bold text-gold">
            {progress.toFixed(1)}%
          </span>

          <span>🏁 الحرية</span>
        </div>

        <ProgressBar value={progress} />
      </div>
    </section>
  );
}