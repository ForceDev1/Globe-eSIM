"use client";

import { useEffect, useRef, useState } from "react";
import { HELLO_WORLD } from "@/data/helloWords";
import { hapticTick, hapticSuccess } from "@/lib/haptics";
import SkipHint from "./SkipHint";

const WORD_HOLD_MS = 950;
const EXIT_MS = 380;
const FINAL_HOLD_MS = 1500;
const STAGE_EXIT_MS = 700;

/**
 * "Classic Boot" — the reference: each word fades up from a blur with a
 * quick spring-scale, cycling through "hello" in its own native script per
 * language (no single font can draw all of these as cursive), landing on
 * the final greeting. The most literal nod to the original boot animation.
 */
export default function HelloVariant3({ onDone }: { onDone: () => void }) {
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [exiting, setExiting] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const push = (ms: number, fn: () => void) => timers.current.push(setTimeout(fn, ms));
    let t = 0;
    HELLO_WORLD.forEach((_, i) => {
      const isLast = i === HELLO_WORLD.length - 1;
      if (i > 0) {
        push(t, () => {
          setIndex(i);
          setLeaving(false);
          hapticTick("light");
        });
      }
      if (!isLast) {
        push(t + WORD_HOLD_MS, () => setLeaving(true));
        t += WORD_HOLD_MS + EXIT_MS;
      } else {
        t += WORD_HOLD_MS;
      }
    });
    push(t, () => hapticSuccess());
    push(t + FINAL_HOLD_MS, () => setExiting(true));
    push(t + FINAL_HOLD_MS + STAGE_EXIT_MS, onDone);
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

  const word = HELLO_WORLD[index];

  return (
    <div className={`hello-stage ${exiting ? "exiting" : ""}`} onClick={skip}>
      <div className="hello-word-slot">
        <span key={index} className={`boot-word ${leaving ? "leaving" : ""}`}>
          {word}
        </span>
      </div>
      <SkipHint />
    </div>
  );
}
