type RingBadgeProps = {
  value: React.ReactNode;
  progress?: number;
  size?: number;
};

export default function RingBadge({
  value,
  progress = 0.94,
  size = 44,
}: RingBadgeProps) {
  const stroke = 2;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const fontSize = Math.round(size * 0.42);

  return (
    <div
      className="relative flex shrink-0 items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.16)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#ffffff"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - progress)}
        />
      </svg>
      <span
        className="absolute font-semibold text-white"
        style={{ fontSize }}
      >
        {value}
      </span>
    </div>
  );
}
