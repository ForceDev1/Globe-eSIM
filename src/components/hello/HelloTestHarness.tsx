"use client";

import { useState } from "react";
import HelloVariant1 from "./HelloVariant1";
import HelloVariant2 from "./HelloVariant2";
import HelloVariant3 from "./HelloVariant3";

const VARIANTS = [
  { key: "1", label: "1 · Ink", Component: HelloVariant1 },
  { key: "2", label: "2 · Handwritten", Component: HelloVariant2 },
  { key: "3", label: "3 · Classic", Component: HelloVariant3 },
] as const;

/**
 * Review harness for comparing the three greeting-animation takes side by
 * side. Not the production gate (that's a one-line localStorage check to
 * add once a variant is picked) — this always replays so it's easy to
 * flip between options.
 */
export default function HelloTestHarness() {
  const [variant, setVariant] = useState<(typeof VARIANTS)[number]["key"]>("1");
  const [runId, setRunId] = useState(0);
  const [done, setDone] = useState(false);

  const active = VARIANTS.find((v) => v.key === variant)!;

  function play(key: (typeof VARIANTS)[number]["key"]) {
    setVariant(key);
    setDone(false);
    setRunId((n) => n + 1);
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <main className="flex min-h-screen flex-col items-center justify-center gap-2 p-6 text-center">
        <h1 className="text-2xl font-semibold">Globe eSIM</h1>
        <p className="text-sm text-white/50">Design coming soon.</p>
      </main>

      {!done && (
        <active.Component key={`${variant}-${runId}`} onDone={() => setDone(true)} />
      )}

      <div className="fixed left-1/2 top-4 z-[200] flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/15 bg-black/70 px-2 py-2 backdrop-blur-md">
        {VARIANTS.map((v) => (
          <button
            key={v.key}
            type="button"
            onClick={() => play(v.key)}
            className="rounded-full px-3 py-1.5 text-[12px] font-medium transition-colors"
            style={{
              background: variant === v.key && !done ? "#fff" : "transparent",
              color: variant === v.key && !done ? "#000" : "rgba(255,255,255,0.7)",
            }}
          >
            {v.label}
          </button>
        ))}
        <span className="mx-1 h-4 w-px bg-white/15" aria-hidden />
        <button
          type="button"
          onClick={() => play(variant)}
          className="rounded-full bg-white/10 px-3 py-1.5 text-[12px] font-medium text-white"
        >
          Replay
        </button>
      </div>
    </div>
  );
}
