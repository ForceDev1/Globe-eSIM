"use client";

import { useEffect, useState } from "react";

type Stage = "tagline" | "transition" | "reveal" | "subtitle" | "bloom";

type Bubble = {
  id: number;
  size: number;
  x: number;
  rise: number;
  delay: number;
  spin: number;
  bobDuration: number;
  bobDelay: number;
};

const STAGE_MS: Record<Exclude<Stage, "bloom">, number> = {
  tagline: 900,
  transition: 1000,
  reveal: 1050,
  subtitle: 650,
};

const BUBBLE_COUNT = 12;

function generateBubbles(): Bubble[] {
  return Array.from({ length: BUBBLE_COUNT }, (_, id) => ({
    id,
    size: 22 + Math.round(Math.random() * 34),
    x: Math.round((Math.random() - 0.5) * 190),
    rise: 90 + Math.round(Math.random() * 170),
    delay: Math.round(Math.random() * 380),
    spin: 4 + Math.random() * 5,
    bobDuration: 2.2 + Math.random() * 1.6,
    bobDelay: Math.random() * 1.5,
  }));
}

/**
 * Full-screen launch animation: tagline -> liquid-glass orb transition ->
 * chromatic-aberration brand reveal -> subtitle -> an iridescent bubble
 * bloom that settles into the entry CTA. Runs once per app open.
 */
export default function LaunchIntro({ onDone }: { onDone: () => void }) {
  const [stage, setStage] = useState<Stage>("tagline");
  const [bubbles, setBubbles] = useState<Bubble[] | null>(null);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const timers: ReturnType<typeof setTimeout>[] = [];
    const at = (ms: number, fn: () => void) => timers.push(setTimeout(fn, ms));

    if (reduced) {
      // Still an effect-scheduled update (not synchronous in the effect
      // body) — just fires on the next tick instead of the full sequence.
      at(0, () => {
        setStage("bloom");
        setBubbles(generateBubbles());
      });
      return () => timers.forEach(clearTimeout);
    }

    at(STAGE_MS.tagline, () => setStage("transition"));
    at(STAGE_MS.tagline + STAGE_MS.transition, () => setStage("reveal"));
    at(STAGE_MS.tagline + STAGE_MS.transition + STAGE_MS.reveal, () => setStage("subtitle"));
    at(
      STAGE_MS.tagline + STAGE_MS.transition + STAGE_MS.reveal + STAGE_MS.subtitle,
      () => {
        setStage("bloom");
        setBubbles(generateBubbles());
      },
    );

    return () => timers.forEach(clearTimeout);
  }, []);

  function handleContinue() {
    setExiting(true);
    setTimeout(onDone, 480);
  }

  const showTagline = stage === "tagline" || stage === "transition";
  const showOrbBottom =
    stage === "tagline" || stage === "transition" || stage === "reveal";
  const orbBottomFading = stage === "reveal";
  const showReveal =
    stage === "reveal" || stage === "subtitle" || stage === "bloom";
  const showSubtitleRow = stage === "subtitle" || stage === "bloom";

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden transition-opacity duration-500 ${
        exiting ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
      style={{
        background: "var(--intro-bg)",
        transform: exiting ? "scale(1.03)" : "scale(1)",
        transition: "opacity 480ms ease, transform 480ms ease",
      }}
    >
      {showTagline && (
        <p
          className="px-10 text-center text-[15px] font-medium"
          style={{
            color: "var(--intro-ink)",
            opacity: stage === "transition" ? 0 : 1,
            filter: stage === "transition" ? "blur(8px)" : "blur(0px)",
            transform: stage === "transition" ? "scale(0.96)" : "scale(1)",
            transition: "opacity 700ms ease, filter 700ms ease, transform 700ms ease",
          }}
        >
          A new era of travel is here.
        </p>
      )}

      {showOrbBottom && (
        <div
          className="pointer-events-none absolute left-1/2 -bottom-[150px] h-[280px] w-[280px] -translate-x-1/2 overflow-hidden rounded-full"
          style={{
            opacity: orbBottomFading ? 0 : 1,
            transition: "opacity 500ms ease",
          }}
        >
          <div className="intro-orb-texture absolute inset-0 rounded-full" />
          {stage === "transition" && (
            <span className="intro-glow absolute left-1/2 bottom-0 h-[220px] w-[220px] -translate-x-1/2 translate-y-1/3 rounded-full" />
          )}
        </div>
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

          {showSubtitleRow && (
            <p
              className="intro-fade-up mt-3 max-w-[280px] text-[15px] leading-snug"
              style={{ color: "var(--intro-ink-soft)" }}
            >
              Instant eSIM data in 190+ countries, one tap away.
            </p>
          )}
        </div>
      )}

      {showSubtitleRow && (
        <div className="intro-fade-up relative mt-8 h-[64px] w-[64px]">
          <div
            className="absolute inset-0 rounded-full"
            style={{ background: "var(--intro-orb)", boxShadow: "var(--intro-orb-shadow)" }}
          />
          <div className="intro-orb-texture absolute inset-0 rounded-full" />

          {stage === "bloom" && bubbles && (
            <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              {bubbles.map((b) => (
                <span
                  key={b.id}
                  className="intro-bubble-rise absolute left-1/2 top-1/2"
                  style={
                    {
                      "--x": `${b.x}px`,
                      "--rise": `${b.rise}px`,
                      animationDelay: `${b.delay}ms`,
                    } as React.CSSProperties
                  }
                >
                  <span
                    className="intro-bubble-bob block"
                    style={{
                      animationDuration: `${b.bobDuration}s`,
                      animationDelay: `${650 + b.delay + b.bobDelay * 1000}ms`,
                    }}
                  >
                    <span
                      className="intro-bubble-spin block overflow-hidden rounded-full"
                      style={{
                        width: b.size,
                        height: b.size,
                        marginLeft: -b.size / 2,
                        marginTop: -b.size / 2,
                        animationDuration: `${b.spin}s`,
                      }}
                    >
                      <span className="intro-bubble-gradient block h-full w-full" />
                    </span>
                    <span
                      className="intro-bubble-highlight pointer-events-none absolute rounded-full"
                      style={{
                        width: b.size * 0.4,
                        height: b.size * 0.4,
                        left: `calc(50% - ${b.size / 2 - b.size * 0.12}px)`,
                        top: `calc(50% - ${b.size / 2 - b.size * 0.1}px)`,
                      }}
                    />
                  </span>
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {stage === "bloom" && (
        <button
          type="button"
          onClick={handleContinue}
          className="intro-fade-up mt-10 rounded-full px-8 py-4 text-[15px] font-semibold text-white"
          style={{ background: "var(--intro-ink)" }}
        >
          Get Started
        </button>
      )}
    </div>
  );
}
