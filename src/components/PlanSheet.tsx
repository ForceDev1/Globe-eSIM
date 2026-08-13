"use client";

import { useState } from "react";
import { ChevronLeft, Signal, Gift, Minus, Plus } from "lucide-react";
import TravelHero from "@/components/TravelHero";
import { flagEmoji, type Country } from "@/data/countries";
import { plans, defaultPlanId } from "@/data/plans";

type PlanSheetProps = {
  open: boolean;
  country: Country | null;
  initialPlanId: string | null;
  onClose: () => void;
  onCheckout: (args: { country: Country | null; planId: string; quantity: number }) => void;
};

export default function PlanSheet({
  open,
  country,
  initialPlanId,
  onClose,
  onCheckout,
}: PlanSheetProps) {
  const [planId, setPlanId] = useState(initialPlanId ?? defaultPlanId);
  const [quantity, setQuantity] = useState(1);

  // Re-sync the sheet's local selection whenever it (re)opens for a
  // different country / preselected plan — adjusted during render, per
  // React's guidance on resetting state from props.
  const openKey = open ? `${country?.code ?? "global"}:${initialPlanId ?? ""}` : "__closed__";
  const [prevOpenKey, setPrevOpenKey] = useState(openKey);
  if (openKey !== prevOpenKey) {
    setPrevOpenKey(openKey);
    if (open) {
      setPlanId(initialPlanId ?? defaultPlanId);
      setQuantity(1);
    }
  }

  const selectedPlan = plans.find((p) => p.id === planId) ?? plans[0];
  const total = selectedPlan.price * quantity;
  const heroTitle = country ? country.name : "Global+";

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
        aria-label={`${heroTitle} plans`}
        className={`relative flex w-full max-w-[420px] flex-col overflow-hidden rounded-t-[28px] bg-[var(--card-bg)] transition-transform duration-300 ease-out ${
          open ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ maxHeight: "88vh" }}
      >
        {/* Hero */}
        <div className="relative h-[190px] shrink-0">
          <TravelHero className="absolute inset-0 h-full w-full" />
          <div className="relative flex items-center justify-between p-4">
            <button
              type="button"
              onClick={onClose}
              aria-label="Back"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/25 text-white backdrop-blur-md"
            >
              <ChevronLeft size={18} strokeWidth={2} />
            </button>
            <span className="rounded-full bg-white/25 px-3 py-1.5 text-[12px] font-semibold text-white backdrop-blur-md">
              $ USD
            </span>
          </div>
          <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between">
            <div>
              <p className="flex items-center gap-2 text-[22px] font-bold leading-none text-white">
                {country && <span className="text-[20px]">{flagEmoji(country.code)}</span>}
                {heroTitle}
              </p>
              <p className="mt-1 text-[13px] text-white/85">Select your days plan</p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="min-h-0 flex-1 overflow-y-auto px-5 pt-4">
          <div className="flex flex-col gap-3">
            {plans.map((plan) => {
              const isSelected = plan.id === planId;
              return (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => setPlanId(plan.id)}
                  aria-pressed={isSelected}
                  className="flex items-center gap-3 rounded-2xl border px-4 py-3.5 text-left transition-colors"
                  style={{
                    borderColor: isSelected ? "var(--ink)" : "var(--hairline)",
                    borderWidth: isSelected ? 2 : 1,
                  }}
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f0f2f7]">
                    <Signal size={17} strokeWidth={2} className="text-[var(--ink)]" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[15px] font-semibold text-[var(--ink)]">
                      {plan.dataGb}GB Plan
                    </span>
                    <span className="block text-[13px] text-[var(--ink-soft)]">
                      Valid for {plan.days} Days
                    </span>
                  </span>
                  <span className="shrink-0 text-[16px] font-bold text-[var(--ink)]">
                    ${plan.price.toFixed(2)}
                  </span>
                </button>
              );
            })}
          </div>

          <div
            className="mt-4 flex items-center gap-3 rounded-2xl p-4"
            style={{ background: "var(--pink)" }}
          >
            <Gift size={26} strokeWidth={1.8} style={{ color: "var(--pink-ink)" }} />
            <div className="min-w-0 flex-1">
              <p className="text-[14px] font-bold" style={{ color: "var(--pink-ink)" }}>
                25% Gift Balance
              </p>
              <p className="text-[12px]" style={{ color: "var(--pink-ink)", opacity: 0.85 }}>
                With every purchase
              </p>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between py-2">
            <span className="text-[15px] font-semibold text-[var(--ink)]">
              eSim Quantity
            </span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                aria-label="Decrease quantity"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="flex h-8 w-8 items-center justify-center rounded-full border"
                style={{ borderColor: "var(--hairline)" }}
              >
                <Minus size={14} strokeWidth={2} />
              </button>
              <span className="w-4 text-center text-[15px] font-semibold tabular-nums">
                {quantity}
              </span>
              <button
                type="button"
                aria-label="Increase quantity"
                onClick={() => setQuantity((q) => Math.min(9, q + 1))}
                className="flex h-8 w-8 items-center justify-center rounded-full border"
                style={{ borderColor: "var(--hairline)" }}
              >
                <Plus size={14} strokeWidth={2} />
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className="shrink-0 px-5 pb-5 pt-3"
          style={{ paddingBottom: "max(20px, env(safe-area-inset-bottom))" }}
        >
          <button
            type="button"
            onClick={() => onCheckout({ country, planId, quantity })}
            className="w-full rounded-2xl py-4 text-center text-[16px] font-semibold text-white"
            style={{ background: "var(--dark)" }}
          >
            Checkout ${total.toFixed(2)} USD
          </button>
        </div>
      </div>
    </div>
  );
}
