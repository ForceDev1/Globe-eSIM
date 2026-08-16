"use client";

import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";
import { HELLO_LATIN } from "@/data/helloWords";
import { hapticTick, hapticSuccess } from "@/lib/haptics";
import HoldToSkip from "./HoldToSkip";
import TextSparkles from "./TextSparkles";

const STEP_MS = 1050;
const LETTER_MS = 85;
const FINAL_HOLD_MS = 1500;
const STAGE_EXIT_MS = 700;

// Deterministic pseudo-random in [0, 1) — same seed always gives the same
// value, so server and client render identically (no hydration mismatch).
function seededJitter(seed: number) {
  const v = Math.sin(seed * 12.9898) * 43758.5453;
  return v - Math.floor(v);
}

/**
 * "Handwritten" — each letter lands on its own, with a small randomized
 * tilt and timing offset, like it's actually being written rather than
 * revealed by a machine. More organic, less mechanical than a straight
 * wipe.
 */
export default function HelloVariant2({ onDone }: { onDone: () => void }) {
  const [index, setIndex] = useState(0);
  const [exiting, setExiting] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const wordRef = useRef<HTMLSpanElement>(null);

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

  function skip() {
    if (exiting) return;
    timers.current.forEach(clearTimeout);
    timers.current = [];
    hapticTick("light");
    setExiting(true);
    timers.current.push(setTimeout(onDone, STAGE_EXIT_MS));
  }

  const word = HELLO_LATIN[index];
  const letters = word.split("");

  return (
    <div className={`hello-stage ${exiting ? "exiting" : ""}`}>
      <div className="hello-word-slot">
        <span key={index} ref={wordRef} className="hand-word">
          {letters.map((ch, i) => {
            const jitter = seededJitter(index * 31 + i + 1);
            const rot = (jitter - 0.5) * 16;
            const style: CSSProperties & Record<"--delay" | "--rot", string> = {
              "--delay": `${i * LETTER_MS + jitter * 65}ms`,
              "--rot": `${rot}deg`,
            };
            return (
              <span key={i} className="hand-letter" style={style}>
                {ch === " " ? " " : ch}
              </span>
            );
          })}
        </span>
      </div>
      <TextSparkles targetRef={wordRef} active={!exiting} />
      <HoldToSkip onSkip={skip} />
    </div>
  );
}
