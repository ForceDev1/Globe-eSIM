"use client";

import { useEffect, useRef, useState } from "react";
import { Wallet, CreditCard, ChevronDown, Minus, Plus } from "lucide-react";

type TopUpSheetProps = {
  open: boolean;
  balance: number;
  onClose: () => void;
  onConfirm: (amount: number) => void;
};

const PRESETS = [5, 10, 15, 20, 50, 100, 200];
const MIN_AMOUNT = 5;
const MAX_AMOUNT = 500;
const STEP = 5;
const HOLD_MS = 650;

export default function TopUpSheet({ open, balance, onClose, onConfirm }: TopUpSheetProps) {
  const [amount, setAmount] = useState(50);
  const [holdProgress, setHoldProgress] = useState(0);
  const [holding, setHolding] = useState(false);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number>(0);

  // Reset the amount whenever the sheet is (re)opened — adjusted during
  // render rather than in an effect, per React's guidance on resetting
  // state from props.
  const openKey = open ? "open" : "closed";
  const [prevOpenKey, setPrevOpenKey] = useState(openKey);
  if (openKey !== prevOpenKey) {
    setPrevOpenKey(openKey);
    if (open) setAmount(50);
  }

  function stopHold(completed: boolean) {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    setHolding(false);
    if (completed) {
      onConfirm(amount);
      setHoldProgress(0);
    } else {
      setHoldProgress(0);
    }
  }

  function startHold() {
    setHolding(true);
    startRef.current = performance.now();
    const tick = (now: number) => {
      const elapsed = now - startRef.current;
      const pct = Math.min(1, elapsed / HOLD_MS);
      setHoldProgress(pct);
      if (pct >= 1) {
        stopHold(true);
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      aria-hidden={!open}
      className={`fixed inset-0 z-50 flex items-end justify-center transition-opacity duration-200 ${
        open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-black/50"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Top up balance"
        className={`relative flex w-full max-w-[420px] flex-col rounded-t-[28px] bg-[var(--card-bg)] pt-3 transition-transform duration-300 ease-out ${
          open ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ maxHeight: "88vh" }}
      >
        <div className="mx-auto h-1 w-9 shrink-0 rounded-full bg-white/15" />

        <div className="min-h-0 flex-1 overflow-y-auto px-5 pt-4">
          <div className="flex items-center justify-between rounded-2xl px-4 py-3.5" style={{ background: "var(--surface-2)" }}>
            <div className="flex items-center gap-3">
              <span
                className="flex h-9 w-9 items-center justify-center rounded-full"
                style={{ background: "linear-gradient(135deg, var(--accent-2), var(--accent))" }}
              >
                <Wallet size={16} strokeWidth={2} className="text-white" />
              </span>
              <div>
                <p className="text-[12px] text-[var(--ink-soft)]">Current Balance</p>
                <p className="text-[15px] font-bold text-[var(--ink)]">
                  ${balance.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between rounded-2xl border px-4 py-3.5" style={{ borderColor: "var(--hairline)" }}>
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full" style={{ background: "var(--surface-2)" }}>
                <CreditCard size={16} strokeWidth={2} className="text-[var(--ink)]" />
              </span>
              <div>
                <p className="text-[12px] text-[var(--ink-soft)]">Debit</p>
                <p className="text-[15px] font-bold text-[var(--ink)]">$90,451.00</p>
              </div>
            </div>
            <ChevronDown size={16} strokeWidth={2} className="text-[var(--ink-soft)]" />
          </div>

          <div className="mt-4 rounded-2xl border px-5 py-5" style={{ borderColor: "var(--hairline)" }}>
            <p className="text-center text-[13px] font-medium text-[var(--ink-soft)]">
              Amount
            </p>
            <div className="mt-2 flex items-center justify-center gap-5">
              <button
                type="button"
                aria-label="Decrease amount"
                onClick={() => setAmount((a) => Math.max(MIN_AMOUNT, a - STEP))}
                className="flex h-9 w-9 items-center justify-center rounded-full border"
                style={{ borderColor: "var(--hairline)" }}
              >
                <Minus size={15} strokeWidth={2} />
              </button>
              <span className="text-[36px] font-bold tabular-nums text-[var(--ink)]">
                ${amount}
              </span>
              <button
                type="button"
                aria-label="Increase amount"
                onClick={() => setAmount((a) => Math.min(MAX_AMOUNT, a + STEP))}
                className="flex h-9 w-9 items-center justify-center rounded-full border"
                style={{ borderColor: "var(--hairline)" }}
              >
                <Plus size={15} strokeWidth={2} />
              </button>
            </div>

            <input
              type="range"
              min={MIN_AMOUNT}
              max={200}
              step={STEP}
              value={Math.min(amount, 200)}
              onChange={(e) => setAmount(Number(e.target.value))}
              aria-label="Amount slider"
              className="mt-5 w-full accent-[var(--ink)]"
            />

            <div className="mt-5 grid grid-cols-4 gap-2">
              {PRESETS.map((value) => {
                const isSelected = value === amount;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setAmount(value)}
                    aria-pressed={isSelected}
                    className="rounded-xl py-2.5 text-[13px] font-semibold"
                    style={{
                      background: isSelected ? "#fff" : "var(--surface-2)",
                      color: isSelected ? "#0a0a0c" : "var(--ink)",
                    }}
                  >
                    ${String(value).padStart(2, "0")}
                  </button>
                );
              })}
              <button
                type="button"
                className="rounded-xl py-2.5 text-[13px] font-semibold"
                style={{ background: "var(--surface-2)", color: "var(--ink)" }}
              >
                Other
              </button>
            </div>
          </div>
        </div>

        <div
          className="flex shrink-0 gap-3 px-5 pb-5 pt-4"
          style={{ paddingBottom: "max(20px, env(safe-area-inset-bottom))" }}
        >
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-2xl py-4 text-center text-[15px] font-semibold text-[var(--ink)]"
            style={{ background: "var(--surface-2)" }}
          >
            Cancel
          </button>
          <button
            type="button"
            onPointerDown={startHold}
            onPointerUp={() => holding && stopHold(false)}
            onPointerLeave={() => holding && stopHold(false)}
            className="relative flex-[1.6] overflow-hidden rounded-2xl py-4 text-center text-[15px] font-semibold text-[var(--ink)] select-none"
            style={{ background: "var(--dark)" }}
          >
            <span
              aria-hidden
              className="absolute inset-y-0 left-0"
              style={{
                width: `${holdProgress * 100}%`,
                background: "var(--accent)",
                transition: holding ? "none" : "width 0.2s ease-out",
              }}
            />
            <span className="relative">Press &amp; Hold to Topup</span>
          </button>
        </div>
      </div>
    </div>
  );
}
