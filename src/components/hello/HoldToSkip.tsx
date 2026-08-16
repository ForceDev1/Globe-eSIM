"use client";

import type { CSSProperties, PointerEvent as ReactPointerEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { hapticTick, hapticSuccess } from "@/lib/haptics";

const HOLD_MS = 1500;
// Both rattle and sparkles start slow and ramp up the longer you hold —
// interval shrinks from *_START to *_END, eased so it stays close to the
// start for a while before racing toward the end (a "winding up" feel
// rather than a linear one).
const HAPTIC_START_MS = 150;
const HAPTIC_END_MS = 28;
const SPARKLE_START_MS = 100;
const SPARKLE_END_MS = 20;
const SPARKLES_PER_TICK = 2;
const SPARKLE_LIFE_MS = 700;

type Sparkle = { id: number; x: number; y: number; dx: number; dy: number; size: number };

let sparkleSeq = 0;

/**
 * Full-stage press-and-hold layer: hold anywhere for HOLD_MS (1.5s) to skip
 * the rest of the sequence. While held, faint gray sparkles drift outward
 * from the finger and a haptic tick repeats — both start out slow and
 * accelerate the longer you hold, "winding up" toward the skip rather than
 * buzzing at a flat rate — stopping (with no skip) if released early.
 */
export default function HoldToSkip({ onSkip }: { onSkip: () => void }) {
  const [holding, setHolding] = useState(false);
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const holdStartRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const lastHapticRef = useRef(0);
  const lastSparkleRef = useRef(0);
  const pointerRef = useRef({ x: 0, y: 0 });
  const triggeredRef = useRef(false);

  function clearTimers() {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
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
    lastHapticRef.current = holdStartRef.current;
    lastSparkleRef.current = holdStartRef.current;
    hapticTick("light"); // immediate first tick, don't wait a full interval
    spawnSparkles();

    const tick = (now: number) => {
      const elapsed = now - holdStartRef.current;
      const eased = Math.min(1, elapsed / HOLD_MS) ** 2; // stays slow, then races

      const hapticInterval = HAPTIC_START_MS - (HAPTIC_START_MS - HAPTIC_END_MS) * eased;
      if (now - lastHapticRef.current >= hapticInterval) {
        lastHapticRef.current = now;
        hapticTick("light");
      }

      const sparkleInterval = SPARKLE_START_MS - (SPARKLE_START_MS - SPARKLE_END_MS) * eased;
      if (now - lastSparkleRef.current >= sparkleInterval) {
        lastSparkleRef.current = now;
        spawnSparkles();
      }

      if (elapsed >= HOLD_MS) {
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
