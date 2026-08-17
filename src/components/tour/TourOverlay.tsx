"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

export type TourStep = {
  /** The genuine on-screen element this step spotlights — its live
   * bounding rect is tracked every frame, not a fixed/guessed position. */
  ref: RefObject<HTMLElement | null>;
  title: string;
  description: string;
};

type TourOverlayProps = {
  steps: TourStep[];
  stepIndex: number;
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
};

type Box = { top: number; left: number; width: number; height: number };

// Breathing room around the tracked element, and how quickly the displayed
// cutout eases toward the live target rect each frame (0-1, higher = snappier).
const PAD = 10;
const EASE = 0.35;

/**
 * A real spotlight/coach-mark tour, not a carousel: a dark scrim with a
 * cutout that continuously tracks a real element's getBoundingClientRect()
 * via requestAnimationFrame, so it stays glued to the target through sheet
 * open/close animations and step-to-step jumps alike (exponentially eased
 * rather than CSS-transitioned, since a fresh target arrives every frame).
 */
export default function TourOverlay({ steps, stepIndex, onNext, onBack, onSkip }: TourOverlayProps) {
  const [box, setBox] = useState<Box | null>(null);
  const displayed = useRef<Box | null>(null);
  const frame = useRef<number | undefined>(undefined);

  const step = steps[stepIndex];

  useEffect(() => {
    function tick() {
      const el = step?.ref.current;
      if (el) {
        const r = el.getBoundingClientRect();
        const target: Box = {
          top: r.top - PAD,
          left: r.left - PAD,
          width: r.width + PAD * 2,
          height: r.height + PAD * 2,
        };
        const prev = displayed.current ?? target;
        const next: Box = {
          top: prev.top + (target.top - prev.top) * EASE,
          left: prev.left + (target.left - prev.left) * EASE,
          width: prev.width + (target.width - prev.width) * EASE,
          height: prev.height + (target.height - prev.height) * EASE,
        };
        displayed.current = next;
        setBox(next);
      }
      frame.current = requestAnimationFrame(tick);
    }
    frame.current = requestAnimationFrame(tick);
    return () => {
      if (frame.current !== undefined) cancelAnimationFrame(frame.current);
    };
  }, [step]);

  if (!step || !box) return null;

  const placeBelow = box.top < window.innerHeight * 0.55;
  const tooltipPos = placeBelow
    ? { top: box.top + box.height + 14 }
    : { bottom: window.innerHeight - box.top + 14 };

  return (
    <>
      {/* Scrim + cutout. The "hole" is just a transparent box whose
          box-shadow paints the darkened surround — no SVG masking needed. */}
      <div className="fixed inset-0 z-[205]">
        <div
          className="absolute rounded-[18px]"
          style={{
            top: box.top,
            left: box.left,
            width: box.width,
            height: box.height,
            boxShadow: "0 0 0 9999px rgba(8,9,11,0.62)",
          }}
        />
      </div>

      <div className="fixed inset-x-0 z-[210] px-4" style={tooltipPos}>
        <div className="mx-auto w-full max-w-[360px] rounded-[22px] bg-white p-5 shadow-[0_12px_40px_rgba(10,10,12,0.35)]">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[#adaba5]">
            Step {stepIndex + 1} of {steps.length}
          </p>
          <p className="mt-1.5 text-[17px] font-bold text-[#15161a]">{step.title}</p>
          <p className="mt-1.5 text-[13.5px] leading-snug text-[#6f6e6a]">{step.description}</p>

          <div className="mt-4 flex items-center justify-between">
            <button type="button" onClick={onSkip} className="text-[13px] font-medium text-[#9a9994]">
              Skip
            </button>
            <div className="flex items-center gap-2">
              {stepIndex > 0 && (
                <button
                  type="button"
                  onClick={onBack}
                  className="rounded-full bg-[#f1efec] px-4 py-2.5 text-[13px] font-semibold text-[#15161a]"
                >
                  Back
                </button>
              )}
              <button
                type="button"
                onClick={onNext}
                className="rounded-full bg-[#15161a] px-5 py-2.5 text-[13px] font-semibold text-white"
              >
                {stepIndex === steps.length - 1 ? "Got it" : "Next"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
