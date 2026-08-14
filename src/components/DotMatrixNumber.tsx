// Classic 5x7 LED dot-matrix bitmap font — just the glyphs the app's hero
// numbers actually need. Each row is a 5-bit string, '1' = lit dot.
const DIGIT_ROWS: Record<string, string[]> = {
  "0": ["01110", "10001", "10011", "10101", "11001", "10001", "01110"],
  "1": ["00100", "01100", "00100", "00100", "00100", "00100", "01110"],
  "2": ["01110", "10001", "00001", "00010", "00100", "01000", "11111"],
  "3": ["11111", "00010", "00100", "00010", "00001", "10001", "01110"],
  "4": ["00010", "00110", "01010", "10010", "11111", "00010", "00010"],
  "5": ["11111", "10000", "11110", "00001", "00001", "10001", "01110"],
  "6": ["00110", "01000", "10000", "11110", "10001", "10001", "01110"],
  "7": ["11111", "00001", "00010", "00100", "01000", "01000", "01000"],
  "8": ["01110", "10001", "10001", "01110", "10001", "10001", "01110"],
  "9": ["01110", "10001", "10001", "01111", "00001", "00010", "01100"],
  ".": ["00000", "00000", "00000", "00000", "00000", "01100", "01100"],
  " ": ["00000", "00000", "00000", "00000", "00000", "00000", "00000"],
};

function Glyph({ rows, dot, gap }: { rows: string[]; dot: number; gap: number }) {
  const cells = rows.flatMap((row) => row.split(""));
  return (
    <span
      className="dot-matrix-digit"
      style={{ width: dot * 5 + gap * 4, height: dot * 7 + gap * 6, gap }}
    >
      {cells.map((bit, i) => (
        <span
          key={i}
          className="dot-matrix-cell"
          style={{
            width: dot,
            height: dot,
            background: "currentColor",
            opacity: bit === "1" ? 1 : 0.16,
          }}
        />
      ))}
    </span>
  );
}

type DotMatrixNumberProps = {
  value: string;
  dot?: number;
  gap?: number;
  colGap?: number;
  className?: string;
};

/** Renders digits (and '.') as a lit/unlit LED dot-matrix grid, glyph by
 * glyph — the hero-number treatment from the reference (big "70", "8"). */
export default function DotMatrixNumber({
  value,
  dot = 5,
  gap = 3,
  colGap,
  className,
}: DotMatrixNumberProps) {
  const chars = value.split("");
  return (
    <span
      className={`dot-matrix ${className ?? ""}`}
      style={{ gap: colGap ?? gap * 2.4 }}
    >
      {chars.map((ch, i) => {
        const rows = DIGIT_ROWS[ch] ?? DIGIT_ROWS[" "];
        return <Glyph key={i} rows={rows} dot={dot} gap={gap} />;
      })}
    </span>
  );
}
