"use client";

import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import DotMatrixNumber from "@/components/DotMatrixNumber";
import { flagEmoji, findCountry } from "@/data/countries";
import { planFor, type OwnedEsim } from "@/data/esims";

const WEEKDAYS = ["M", "T", "W", "T", "F", "S", "S"];

function WaveChart() {
  // A calm usage curve with a marked "you are here" point — same beat as
  // the reference's glucose trace, just carrying data-usage instead.
  const path =
    "M4 34 C 20 18, 34 44, 50 30 S 82 10, 98 26 S 130 42, 150 24 S 182 8, 198 20 S 226 36, 246 22";
  return (
    <div className="relative mt-5 h-[64px] w-full">
      <svg viewBox="0 0 250 60" className="h-full w-full" preserveAspectRatio="none">
        <path d={path} fill="none" stroke="var(--ink-faint)" strokeWidth="1.5" />
        <path
          d={path}
          fill="none"
          stroke="var(--mark)"
          strokeWidth="1.5"
          strokeDasharray="150 300"
        />
      </svg>
      <div className="absolute" style={{ left: "60%", top: "38%" }}>
        <div
          className="h-0 w-0"
          style={{
            borderLeft: "5px solid transparent",
            borderRight: "5px solid transparent",
            borderTop: "7px solid var(--mark)",
          }}
        />
      </div>
    </div>
  );
}

function RingStat({ value, size = 56 }: { value: number; size?: number }) {
  const stroke = 4;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - value / 100)}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[13px] font-semibold">
        {value}
      </span>
    </div>
  );
}

export default function UsageView({ esim, onBack }: { esim: OwnedEsim; onBack: () => void }) {
  const [activeDay, setActiveDay] = useState(1);
  const country = findCountry(esim.countryCode);
  const plan = planFor(esim);
  const todayMb = Math.round(esim.dataUsedGb * 1000 * 0.18);

  return (
    <div
      className="flex flex-col px-5 pb-10"
      style={{ paddingTop: "max(24px, calc(env(safe-area-inset-top) + 12px))" }}
    >
        {/* Header: back + weekday selector */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onBack}
            aria-label="Back"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
            style={{ background: "var(--surface)" }}
          >
            <ChevronLeft size={18} strokeWidth={2} />
          </button>
          <div className="flex flex-1 items-center justify-between">
            {WEEKDAYS.map((d, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveDay(i)}
                aria-pressed={activeDay === i}
                aria-label={`Day ${i + 1}`}
                className="flex h-10 w-10 items-center justify-center rounded-full text-[13px] font-medium"
                style={{
                  background: activeDay === i ? "#fff" : "transparent",
                  color: activeDay === i ? "#0a0a0c" : "var(--ink-soft)",
                  border: activeDay === i ? "none" : "1px solid var(--hairline)",
                }}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Hero stat */}
        <div className="mt-8 flex flex-col items-center text-center">
          <p className="flex items-center gap-1.5 text-[13px] text-[var(--ink-soft)]">
            {country ? flagEmoji(country.code) : "🌐"} {country?.name ?? "Global+"} · Data used
          </p>
          <DotMatrixNumber value={String(todayMb)} dot={7} gap={4} className="mt-4" />
          <p className="mt-2 text-[13px] text-[var(--ink-soft)]">MB today</p>
          <WaveChart />
        </div>

        {/* Stat grid */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <div
            className="col-span-2 flex items-center justify-between rounded-[24px] p-4"
            style={{ background: "var(--glow-pink)" }}
          >
            <div>
              <p className="text-[12px]" style={{ color: "var(--glow-pink-ink)", opacity: 0.85 }}>
                Average Usage
              </p>
              <p className="mt-2 text-[22px] font-bold">
                84 <span className="text-[13px] font-medium opacity-70">MB/day</span>
              </p>
            </div>
            <div style={{ color: "var(--glow-pink-ink)" }}>
              <RingStat value={84} />
            </div>
          </div>

          <div className="rounded-[24px] p-4" style={{ background: "var(--glow-green)" }}>
            <p className="text-[12px]" style={{ color: "var(--glow-green-ink)", opacity: 0.85 }}>
              Time Active
            </p>
            <div className="mt-6 h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.18)" }}>
              <div className="relative h-full w-full rounded-full" style={{ background: "var(--glow-green-ink)" }}>
                <span
                  className="absolute -top-[7px] right-0 h-0 w-0"
                  style={{
                    borderLeft: "4px solid transparent",
                    borderRight: "4px solid transparent",
                    borderTop: "6px solid var(--mark)",
                  }}
                />
              </div>
            </div>
            <p className="mt-3 text-[22px] font-bold">
              100<span className="text-[13px] font-medium opacity-70">%</span>
            </p>
          </div>

          <div className="rounded-[24px] p-4" style={{ background: "var(--glow-pink)" }}>
            <p className="text-[12px]" style={{ color: "var(--glow-pink-ink)", opacity: 0.85 }}>
              Variability
            </p>
            <div className="mt-3 grid grid-cols-8 gap-1">
              {Array.from({ length: 24 }, (_, i) => (
                <span
                  key={i}
                  className="h-1 w-1 rounded-full"
                  style={{ background: "#fff", opacity: 0.25 + ((i * 37) % 60) / 100 }}
                />
              ))}
            </div>
            <p className="mt-3 text-[22px] font-bold">
              6.8<span className="text-[13px] font-medium opacity-70">%</span>
            </p>
          </div>

          <div className="rounded-[24px] p-4" style={{ background: "var(--glow-blue)" }}>
            <p className="text-[12px]" style={{ color: "var(--glow-blue-ink)", opacity: 0.85 }}>
              Signal
            </p>
            <div className="mt-3 flex items-end gap-[3px]">
              {Array.from({ length: 14 }, (_, i) => (
                <span
                  key={i}
                  className="w-[3px] rounded-full"
                  style={{
                    height: 6 + ((i * 13) % 16),
                    background: i === 9 ? "var(--mark)" : "rgba(255,255,255,0.35)",
                  }}
                />
              ))}
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <p className="text-[22px] font-bold">83</p>
              <span className="text-[11px] font-medium" style={{ color: "var(--glow-blue-ink)" }}>
                Good
              </span>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[24px] p-4" style={{ background: "var(--glow-orange)" }}>
            <div
              className="pointer-events-none absolute -right-3 top-1/2 h-16 w-16 -translate-y-1/2 rounded-full"
              style={{ background: "#3f6bff", filter: "blur(18px)", opacity: 0.8 }}
            />
            <p className="relative text-[12px]" style={{ color: "var(--glow-orange-ink)", opacity: 0.85 }}>
              Roaming Spikes
            </p>
            <p className="relative mt-6 text-[22px] font-bold">
              0<span className="text-[13px] font-medium opacity-70">%</span>
            </p>
          </div>
        </div>

      <p className="mt-6 text-center text-[12px] text-[var(--ink-soft)]">
        {plan.dataGb}GB plan · {esim.expiresLabel}
      </p>
    </div>
  );
}
