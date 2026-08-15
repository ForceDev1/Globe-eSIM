"use client";

import { useEffect, useRef, useState } from "react";
import { HELLO_LATIN } from "@/data/helloWords";
import { hapticTick, hapticSuccess } from "@/lib/haptics";

const STEP_MS = 560;
const FINAL_HOLD_MS = 900;
const STAGE_EXIT_MS = 520;

/**
 * "Ink Reveal" — a cursive word is wiped into view left-to-right by an
 * animated mask (a soft-edged gradient sliding across the text), with a
 * small glowing dot leading the reveal like a pen tip. Cycles through
 * "hello" in several languages before landing.
 */
export default function HelloVariant1({ onDone }: { onDone: () => void }) {
  const [index, setIndex] = useState(0);
  const [exiting, setExiting] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const push = (ms: number, fn: () => void) => timers.current.push(setTimeout(fn, ms));
    HELLO_LATIN.forEach((_, i) => {
      if (i === 0) return;
      push(i * STEP_MS, () => {
        setIndex(i);
        hapticTick("light");
      });
    });
    const endOfWords = HELLO_LATIN.length * STEP_MS;
    push(endOfWords, () => hapticSuccess());
    push(endOfWords + FINAL_HOLD_MS, () => setExiting(true));
    push(endOfWords + FINAL_HOLD_MS + STAGE_EXIT_MS, onDone);
    const list = timers.current;
    return () => list.forEach(clearTimeout);
    // Intentionally one-shot: runs the full sequence once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const word = HELLO_LATIN[index];
  const isLast = index === HELLO_LATIN.length - 1;

  return (
    <div className={`hello-stage ${exiting ? "exiting" : ""}`}>
      <div className="hello-word-slot">
        <span
          key={index}
          className="ink-word"
          style={isLast ? { fontSize: "clamp(56px, 18vw, 112px)" } : undefined}
        >
          {word}
        </span>
        <span key={`tip-${index}`} className="ink-tip" aria-hidden />
      </div>
    </div>
  );
}
