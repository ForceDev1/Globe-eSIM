"use client";

import { useEffect, useRef, useState } from "react";

type Stage = "idle" | "holding" | "revealing" | "ready" | "committed";

type FlyIcon = {
  id: number;
  x: number;
  y: number;
  dx: number;
  dy: number;
  size: number;
  spin: number;
  bobDuration: number;
};

const HOLD_MS = 700;
const DRAG_COMMIT_PX = 70;
const MAX_ICONS = 16;
const SPAWN_INTERVAL_MS = 90;

// Where the draggable orb lives, as a fraction of the viewport — computed
// on layout/resize so the drag math has a stable anchor to measure from.
const ANCHOR_Y_FRACTION = 0.62;

let iconSeq = 0;

/**
 * Full-screen launch experience: press-and-hold the orb to reveal the
 * brand, then drag it — a liquid-glass blob stretches toward your finger
 * and colorful bubbles fling out of it — to reveal the entry CTA.
 */
export default function LaunchIntro({ onDone }: { onDone: () => void }) {
  const [stage, setStage] = useState<Stage>("idle");
  const [holdProgress, setHoldProgress] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [dragPos, setDragPos] = useState({ x: 0, y: 0 });
  const [icons, setIcons] = useState<FlyIcon[]>([]);
  const [exiting, setExiting] = useState(false);

  const anchorRef = useRef<HTMLDivElement | null>(null);
  const anchorPointRef = useRef({ x: 0, y: 0 });
  const holdRafRef = useRef<number | null>(null);
  const holdStartRef = useRef(0);
  const lastSpawnRef = useRef(0);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      if (holdRafRef.current) cancelAnimationFrame(holdRafRef.current);
      timers.forEach(clearTimeout);
    };
  }, []);

  function at(ms: number, fn: () => void) {
    timersRef.current.push(setTimeout(fn, ms));
  }

  // ---- press-and-hold: charges the orb, then plays the brand reveal ----
  function startHold() {
    if (stage !== "idle") return;
    setStage("holding");
    holdStartRef.current = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - holdStartRef.current) / HOLD_MS);
      setHoldProgress(p);
      if (p >= 1) {
        setStage("revealing");
        at(1050, () => setStage("ready"));
        return;
      }
      holdRafRef.current = requestAnimationFrame(tick);
    };
    holdRafRef.current = requestAnimationFrame(tick);
  }

  function cancelHold() {
    if (stage !== "holding") return;
    if (holdRafRef.current) cancelAnimationFrame(holdRafRef.current);
    setHoldProgress(0);
    setStage("idle");
  }

  // ---- drag: the orb follows the pointer, flinging bubbles as it goes ----
  function spawnIconTowards(x: number, y: number) {
    const now = performance.now();
    if (now - lastSpawnRef.current < SPAWN_INTERVAL_MS) return;
    if (icons.length >= MAX_ICONS) return;
    lastSpawnRef.current = now;

    const { x: ax, y: ay } = anchorPointRef.current;
    const dirX = x - ax;
    const dirY = y - ay;
    const dist = Math.hypot(dirX, dirY) || 1;
    const baseAngle = Math.atan2(dirY, dirX);
    const angle = baseAngle + (Math.random() - 0.5) * 1.1;
    const flyDist = 55 + Math.random() * 110 + dist * 0.35;

    setIcons((list) => [
      ...list,
      {
        id: iconSeq++,
        x,
        y,
        dx: Math.cos(angle) * flyDist,
        dy: Math.sin(angle) * flyDist,
        size: 20 + Math.random() * 30,
        spin: 4 + Math.random() * 5,
        bobDuration: 2 + Math.random() * 1.6,
      },
    ]);
  }

  function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (stage !== "ready" && stage !== "committed") return;
    const rect = anchorRef.current?.getBoundingClientRect();
    if (!rect) return;
    anchorPointRef.current = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    setDragging(true);
    setDragPos({ x: e.clientX, y: e.clientY });
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!dragging) return;
    setDragPos({ x: e.clientX, y: e.clientY });
    spawnIconTowards(e.clientX, e.clientY);
  }

  function handlePointerUp() {
    if (!dragging) return;
    setDragging(false);
    const { x: ax, y: ay } = anchorPointRef.current;
    const dist = Math.hypot(dragPos.x - ax, dragPos.y - ay);
    setDragPos({ x: ax, y: ay });
    if (dist >= DRAG_COMMIT_PX && stage === "ready") {
      at(260, () => setStage("committed"));
    }
  }

  function handleContinue() {
    setExiting(true);
    setTimeout(onDone, 480);
  }

  const showTagline = stage === "idle" || stage === "holding";
  const showOrbBottom = stage !== "revealing" && stage !== "ready" && stage !== "committed";
  const showReveal = stage === "revealing" || stage === "ready" || stage === "committed";
  const showInteractiveOrb = stage === "ready" || stage === "committed";
  const orbGlowOpacity = stage === "holding" ? holdProgress : 0;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center overflow-hidden pt-[26vh] transition-opacity duration-500 ${
        exiting ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
      style={{
        background: "var(--intro-bg)",
        transform: exiting ? "scale(1.03)" : "scale(1)",
        transition: "opacity 480ms ease, transform 480ms ease",
      }}
    >
      {/* goo filter used to blend the anchor orb with the drag handle into
          one liquid blob */}
      <svg width="0" height="0" aria-hidden className="absolute">
        <defs>
          <filter id="intro-goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="9" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 24 -12" />
          </filter>
        </defs>
      </svg>

      {showTagline && (
        <p
          className="px-10 text-center text-[15px] font-medium"
          style={{
            color: "var(--intro-ink)",
            opacity: stage === "holding" ? 1 - holdProgress * 0.7 : 1,
            filter: stage === "holding" ? `blur(${holdProgress * 6}px)` : "blur(0px)",
            transition: "opacity 150ms linear, filter 150ms linear",
          }}
        >
          A new era of travel is here.
        </p>
      )}

      {showReveal && (
        <div className="flex flex-col items-center px-10 text-center">
          <div className="intro-chroma relative">
            <span className="intro-chroma-layer intro-chroma-layer--a">Meet Globe.</span>
            <span className="intro-chroma-layer intro-chroma-layer--b">Meet Globe.</span>
            <span className="intro-chroma-layer intro-chroma-layer--c">Meet Globe.</span>
            <span
              className="intro-chroma-layer intro-chroma-layer--solid"
              style={{ color: "var(--intro-ink)" }}
            >
              Meet Globe.
            </span>
          </div>

          {(stage === "ready" || stage === "committed") && (
            <p
              className="intro-fade-up mt-3 max-w-[280px] text-[15px] leading-snug"
              style={{ color: "var(--intro-ink-soft)" }}
            >
              {stage === "committed"
                ? "Instant eSIM data in 190+ countries, one tap away."
                : "Drag the orb — watch what it's carrying."}
            </p>
          )}
        </div>
      )}

      {/* Rim-light glow — deliberately OUTSIDE the goo filter below: goo's
          alpha-threshold contrast boost is built for solid shapes, and
          flattens a soft translucent gradient into almost nothing. */}
      {showOrbBottom && (
        <div className="pointer-events-none fixed left-1/2 -bottom-[150px] h-[280px] w-[280px] -translate-x-1/2 overflow-hidden rounded-full">
          <span
            className="absolute left-1/2 bottom-0 h-[220px] w-[220px] -translate-x-1/2 translate-y-1/3 rounded-full"
            style={{
              background:
                "radial-gradient(closest-side, #7dd3fc 0%, #3b82f6 45%, #8b5cf6 78%, transparent 100%)",
              filter: "blur(14px)",
              opacity: orbGlowOpacity,
              transform: `translate(-50%, 33%) scale(${0.7 + holdProgress * 0.5})`,
            }}
          />
        </div>
      )}

      {/* Liquid blob: bottom orb (pre-reveal) and the draggable orb + its
          drag handle (post-reveal) share one goo-filtered layer, so
          overlapping solid shapes visually merge like liquid glass. */}
      <div className="pointer-events-none fixed inset-0" style={{ filter: "url(#intro-goo)" }}>
        {showOrbBottom && (
          <div className="absolute left-1/2 -bottom-[150px] h-[280px] w-[280px] -translate-x-1/2 overflow-hidden rounded-full">
            <div className="intro-orb-texture absolute inset-0 rounded-full" />
          </div>
        )}

        {showInteractiveOrb && (
          <div
            ref={anchorRef}
            className="absolute h-[68px] w-[68px] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{ left: "50%", top: `${ANCHOR_Y_FRACTION * 100}vh` }}
          >
            <div className="intro-orb-texture absolute inset-0 rounded-full" />
          </div>
        )}

        {dragging && (
          <div
            className="absolute h-[68px] w-[68px] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{ left: dragPos.x, top: dragPos.y }}
          >
            <div className="intro-orb-texture absolute inset-0 rounded-full" />
          </div>
        )}
      </div>

      {/* The real, invisible hit-target for pointer events — sits above the
          filtered visual layer (filters don't affect hit-testing anyway,
          but keeping the handlers on a dedicated element is simplest). */}
      {showInteractiveOrb && (
        <div
          className="fixed h-[84px] w-[84px] -translate-x-1/2 -translate-y-1/2 touch-none select-none rounded-full"
          style={{ left: "50%", top: `${ANCHOR_Y_FRACTION * 100}vh` }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          role="button"
          aria-label="Drag to explore"
        />
      )}

      {/* Bubbles flung out while dragging */}
      <div className="pointer-events-none fixed inset-0">
        {icons.map((icon) => (
          <span
            key={icon.id}
            className="intro-bubble-pop absolute"
            style={
              {
                left: icon.x,
                top: icon.y,
                "--dx": `${icon.dx}px`,
                "--dy": `${icon.dy}px`,
              } as React.CSSProperties
            }
          >
            <span
              className="intro-bubble-bob block"
              style={{ animationDuration: `${icon.bobDuration}s`, animationDelay: "550ms" }}
            >
              <span
                className="intro-bubble-spin block overflow-hidden rounded-full"
                style={{
                  width: icon.size,
                  height: icon.size,
                  marginLeft: -icon.size / 2,
                  marginTop: -icon.size / 2,
                  animationDuration: `${icon.spin}s`,
                }}
              >
                <span className="intro-bubble-gradient block h-full w-full" />
              </span>
              <span
                className="intro-bubble-highlight pointer-events-none absolute rounded-full"
                style={{
                  width: icon.size * 0.4,
                  height: icon.size * 0.4,
                  left: `calc(50% - ${icon.size / 2 - icon.size * 0.12}px)`,
                  top: `calc(50% - ${icon.size / 2 - icon.size * 0.1}px)`,
                }}
              />
            </span>
          </span>
        ))}
      </div>

      {stage === "committed" && (
        <button
          type="button"
          onClick={handleContinue}
          className="intro-fade-up fixed left-1/2 -translate-x-1/2 rounded-full px-8 py-4 text-[15px] font-semibold text-white"
          style={{ top: `${ANCHOR_Y_FRACTION * 100}vh`, marginTop: 74, background: "var(--intro-ink)" }}
        >
          Get Started
        </button>
      )}

      {stage === "idle" && (
        <div
          className="pointer-events-none fixed left-1/2 -translate-x-1/2 text-center text-[12px]"
          style={{ bottom: 92, color: "var(--intro-ink-soft)" }}
        >
          Press and hold
        </div>
      )}

      {/* Invisible full-orb hit target for the hold gesture, positioned over
          the bottom orb. */}
      {stage !== "revealing" && stage !== "ready" && stage !== "committed" && (
        <div
          className="fixed left-1/2 bottom-0 h-[170px] w-[280px] -translate-x-1/2 touch-none select-none"
          onPointerDown={startHold}
          onPointerUp={cancelHold}
          onPointerLeave={cancelHold}
          onPointerCancel={cancelHold}
          role="button"
          aria-label="Press and hold to continue"
        />
      )}
    </div>
  );
}
