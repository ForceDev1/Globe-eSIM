type DotGridProps = {
  seed: number;
  cols?: number;
  rows?: number;
  highlights?: number[];
};

// Small deterministic pseudo-random generator so the pattern is stable
// between server and client renders.
function mulberry32(a: number) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export default function DotGrid({
  seed,
  cols = 6,
  rows = 5,
  highlights = [],
}: DotGridProps) {
  const rand = mulberry32(seed);
  const total = cols * rows;
  const dots = Array.from({ length: total }, (_, i) => {
    const isHighlight = highlights.includes(i);
    const opacity = isHighlight ? 1 : 0.14 + rand() * 0.5;
    return { isHighlight, opacity };
  });

  return (
    <div
      className="grid justify-center gap-x-[7px] gap-y-[8px]"
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
    >
      {dots.map((dot, i) => (
        <span
          key={i}
          className="block h-[4px] w-[4px] rounded-full bg-white"
          style={{
            opacity: dot.opacity,
            boxShadow: dot.isHighlight
              ? "0 0 6px 1px rgba(255,255,255,0.8)"
              : undefined,
            transform: dot.isHighlight ? "scale(1.35)" : undefined,
          }}
        />
      ))}
    </div>
  );
}
