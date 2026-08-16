"use client";

import type { CSSProperties, RefObject } from "react";
import { useEffect, useRef, useState } from "react";

const SPAWN_INTERVAL_MS = 90;
const RAY_COUNT = 9;
const LIFE_MS = 750;

type Sparkle = { id: number; x: number; y: number; dx: number; dy: number; size: number };

let sparkleSeq = 0;

/**
 * Ambient decoration: reuses the exact same particle (.hold-sparkle /
 * sparkleFly) as the press-and-hold skip gesture, but sourced from the
 * greeting word's own bounding box instead of a fingertip — a handful of
 * evenly-spaced rays (randomly rotated so it's not identical every time)
 * radiate outward continuously while the word is on screen, reading as
 * streaks rather than a random scatter.
 */
export default function TextSparkles({
  targetRef,
  active,
}: {
  targetRef: RefObject<HTMLElement | null>;
  active: boolean;
}) {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const rayIndexRef = useRef(0);
  // Randomized in the effect below (not here) — Math.random() during render
  // is impure and React flags it; the effect only ever runs client-side.
  const baseAngleRef = useRef(0);

  useEffect(() => {
    if (!active) return;
    baseAngleRef.current = Math.random() * Math.PI * 2;

    function spawn() {
      const el = targetRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      const ray = rayIndexRef.current++ % RAY_COUNT;
      const angle =
        baseAngleRef.current + ray * ((Math.PI * 2) / RAY_COUNT) + (Math.random() - 0.5) * 0.3;
      const originX = cx + Math.cos(angle) * rect.width * 0.22;
      const originY = cy + Math.sin(angle) * rect.height * 0.22;
      const dist = 46 + Math.random() * 84;
      const id = sparkleSeq++;

      setSparkles((list) => [
        ...list.slice(-50),
        {
          id,
          x: originX,
          y: originY,
          dx: Math.cos(angle) * dist,
          dy: Math.sin(angle) * dist,
          size: 2 + Math.random() * 3,
        },
      ]);
      setTimeout(() => {
        setSparkles((list) => list.filter((s) => s.id !== id));
      }, LIFE_MS);
    }

    spawn();
    const timer = setInterval(spawn, SPAWN_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [active, targetRef]);

  return (
    <>
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
    </>
  );
}
