// One dumbbell: a bar through two square weight plates, drawn around its
// own local origin so it can be positioned/rotated as a unit.
function Dumbbell({ transform }: { transform: string }) {
  return (
    <g transform={transform}>
      <rect x="-16" y="-3.2" width="32" height="6.4" rx="3.2" fill="url(#bar)" />
      <rect x="-22" y="-11" width="13" height="22" rx="4" fill="url(#weight)" />
      <rect x="9" y="-11" width="13" height="22" rx="4" fill="url(#weight)" />
      <rect x="-19.5" y="-7" width="2.2" height="14" rx="1.1" fill="rgba(255,255,255,0.18)" />
      <rect x="11.5" y="-7" width="2.2" height="14" rx="1.1" fill="rgba(255,255,255,0.18)" />
    </g>
  );
}

function DumbbellPhoto() {
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full">
      <defs>
        <linearGradient id="bar" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#5a5c60" />
          <stop offset="50%" stopColor="#2a2b2e" />
          <stop offset="100%" stopColor="#5a5c60" />
        </linearGradient>
        <linearGradient id="weight" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#55565a" />
          <stop offset="100%" stopColor="#101113" />
        </linearGradient>
      </defs>
      <Dumbbell transform="translate(50 44) rotate(-32) scale(0.95)" />
      <Dumbbell transform="translate(50 58) rotate(32) scale(0.95)" />
    </svg>
  );
}

export default function OverallProgressCard() {
  return (
    <div className="mt-4 flex items-center justify-between gap-4 rounded-[22px] bg-[#f6f2ee] p-5">
      <div className="min-w-0">
        <p className="text-[12px] text-[#a9a29b]">30 Days Experiment</p>
        <p className="mt-1 text-[19px] font-bold text-[#15161a]">Overall Progress</p>
        <p className="mt-2 text-[13px] leading-snug text-[#8f8a84]">
          Elevate Your Health Commit to Cardiovascular Fitness
        </p>
        <button
          type="button"
          className="mt-4 rounded-full bg-[#15161a] px-5 py-2.5 text-[13px] font-semibold text-white"
        >
          Start now
        </button>
      </div>

      <div className="relative flex h-[124px] w-[124px] shrink-0 items-center justify-center">
        <svg viewBox="0 0 124 124" className="absolute inset-0 h-full w-full -rotate-90">
          <circle cx="62" cy="62" r="58" fill="none" stroke="#eae5df" strokeWidth="1.5" />
          <circle
            cx="62"
            cy="62"
            r="58"
            fill="none"
            stroke="#15161a"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 58}
            strokeDashoffset={2 * Math.PI * 58 * (1 - 0.22)}
          />
        </svg>
        <span className="flex h-[100px] w-[100px] items-center justify-center rounded-full bg-white p-4 shadow-[0_2px_10px_rgba(20,20,25,0.06)]">
          <DumbbellPhoto />
        </span>
      </div>
    </div>
  );
}
