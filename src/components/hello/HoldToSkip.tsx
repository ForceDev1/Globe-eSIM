"use client";

import type { CSSProperties, PointerEvent as ReactPointerEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { hapticTick, hapticSuccess } from "@/lib/haptics";

const HOLD_MS = 1000;
const SPARKLE_INTERVAL_MS = 40;
const SPARKLES_PER_TICK = 2;
const SPARKLE_LIFE_MS = 700;
const HAPTIC_INTERVAL_MS = 50;

type Sparkle = { id: number; x: number; y: number; dx: number; dy: number; size: number };

let sparkleSeq = 0;

/**
 * Full-stage press-and-hold layer: hold anywhere for HOLD_MS to skip the
 * rest of the sequence. While held, faint gray sparkles drift outward from
 * the finger and a light haptic tick repeats — a "rattle" rather than one
 * discrete buzz — stopping (with no skip) if released early.
 */
export default function HoldToSkip({ onSkip }: { onSkip: () => void }) {
  const [holding, setHolding] = useState(false);
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const holdStartRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const sparkleTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hapticTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pointerRef = useRef({ x: 0, y: 0 });
  const triggeredRef = useRef(false);

  function clearTimers() {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (sparkleTimerRef.current) clearInterval(sparkleTimerRef.current);
    if (hapticTimerRef.current) clearInterval(hapticTimerRef.current);
    rafRef.current = null;
    sparkleTimerRef.current = null;
    hapticTimerRef.current = null;
  }

  useEffect(() => clearTimers, []);

  function spawnSparkles() {
    const { x, y } = pointerRef.current;
    const fresh: Sparkle[] = [];
    for (let i = 0; i < SPARKLES_PER_TICK; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = 16 + Math.random() * 52;
      const id = sparkleSeq++;
      fresh.push({ id, x, y, dx: Math.cos(angle) * dist, dy: Math.sin(angle) * dist, size: 3 + Math.random() * 4 });
    }
    setSparkles((list) => [...list.slice(-60), ...fresh]);
    fresh.forEach(({ id }) => {
      setTimeout(() => {
        setSparkles((list) => list.filter((s) => s.id !== id));
      }, SPARKLE_LIFE_MS);
    });
  }

  function endHold() {
    setHolding(false);
    clearTimers();
  }

  function startHold(x: number, y: number) {
    pointerRef.current = { x, y };
    setHolding(true);
    triggeredRef.current = false;
    holdStartRef.current = performance.now();

    sparkleTimerRef.current = setInterval(spawnSparkles, SPARKLE_INTERVAL_MS);
    hapticTimerRef.current = setInterval(() => hapticTick("light"), HAPTIC_INTERVAL_MS);

    const tick = (now: number) => {
      if (now - holdStartRef.current >= HOLD_MS) {
        if (!triggeredRef.current) {
          triggeredRef.current = true;
          hapticSuccess();
          endHold();
          onSkip();
        }
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }

  function handlePointerDown(e: ReactPointerEvent<HTMLDivElement>) {
    e.currentTarget.setPointerCapture(e.pointerId);
    startHold(e.clientX, e.clientY);
  }

  function handlePointerMove(e: ReactPointerEvent<HTMLDivElement>) {
    if (!holding) return;
    pointerRef.current = { x: e.clientX, y: e.clientY };
  }

  return (
    <div
      className="hold-skip-layer"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endHold}
      onPointerCancel={endHold}
      onPointerLeave={() => holding && endHold()}
    >
      {sparkles.map((s) => {
        const style: CSSProperties & Record<"--dx" | "--dy", string> = {
          left: s.x,
          top: s.y,
          width: s.size,
          height: s.size,
          "--dx": `${s.dx}px`,
          "--dy": `${s.dy}px`,
        };
        return <span key={s.id} className="hold-sparkle" style={style} aria-hidden />;
      })}

      <div className="hello-skip-hint" aria-hidden>
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m6 17 5-5-5-5" />
          <path d="m13 17 5-5-5-5" />
        </svg>
        <span>Удерживай чтобы пропустить</span>
      </div>
    </div>
  );
}
