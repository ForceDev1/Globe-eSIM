"use client";

import { useEffect, useState, type RefObject } from "react";
import { hapticSelect, hapticSuccess } from "@/lib/haptics";
import { CheckIcon, CloseIcon } from "./icons";

const COUNTRIES = [
  { code: "US", flag: "🇺🇸", name: "USA" },
  { code: "GB", flag: "🇬🇧", name: "UK" },
  { code: "FR", flag: "🇫🇷", name: "France" },
  { code: "JP", flag: "🇯🇵", name: "Japan" },
  { code: "TH", flag: "🇹🇭", name: "Thailand" },
];

const PLANS = [
  { id: "1gb", data: "1 GB", days: 7, price: 4.99 },
  { id: "3gb", data: "3 GB", days: 15, price: 9.99 },
  { id: "5gb", data: "5 GB", days: 30, price: 14.99 },
];

type AddEsimSheetProps = {
  open: boolean;
  onClose: () => void;
  /** Real targets for steps 2-4 of the spotlight tour. */
  countryRef: RefObject<HTMLDivElement | null>;
  planRef: RefObject<HTMLDivElement | null>;
  confirmRef: RefObject<HTMLButtonElement | null>;
};

/** Minimal, real "Add eSIM" flow — country + plan + confirm, with a simple
 * success state. Not a full purchase flow (no payment/QR/install screens) —
 * this is deliberately the minimum needed for the setup tour to have
 * genuine elements to spotlight. */
export default function AddEsimSheet({ open, onClose, countryRef, planRef, confirmRef }: AddEsimSheetProps) {
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0].code);
  const [selectedPlan, setSelectedPlan] = useState(PLANS[1].id);
  const [success, setSuccess] = useState(false);

  // Reset the success state after the close transition finishes, so
  // reopening the sheet starts fresh instead of flashing the old result.
  useEffect(() => {
    if (open) return;
    const id = setTimeout(() => setSuccess(false), 300);
    return () => clearTimeout(id);
  }, [open]);

  const activePlan = PLANS.find((p) => p.id === selectedPlan) ?? PLANS[0];
  const activeCountry = COUNTRIES.find((c) => c.code === selectedCountry) ?? COUNTRIES[0];

  function handleConfirm() {
    hapticSuccess();
    setSuccess(true);
  }

  return (
    <div
      className={`fixed inset-0 z-[60] transition-opacity duration-300 ${
        open ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
      aria-hidden={!open}
    >
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div
        className={`absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-[28px] bg-[#efeeec] px-5 pt-5 transition-transform duration-300 ${
          open ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ paddingBottom: "max(32px, calc(env(safe-area-inset-bottom) + 16px))" }}
      >
        <div className="flex items-center justify-between">
          <p className="text-[18px] font-bold text-[#15161a]">Add eSIM</p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#15161a] shadow-[0_2px_10px_rgba(20,20,25,0.08)]"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>

        {success ? (
          <div className="flex flex-col items-center py-8 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#15161a] text-white">
              <CheckIcon className="h-7 w-7" />
            </span>
            <p className="mt-4 text-[17px] font-bold text-[#15161a]">eSIM added!</p>
            <p className="mt-1.5 text-[13.5px] text-[#9a9994]">
              Your {activeCountry.name} eSIM is ready to activate.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-6 w-full rounded-full bg-[#15161a] py-3.5 text-[14px] font-semibold text-white"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <p className="mt-5 text-[12.5px] font-semibold uppercase tracking-wide text-[#adaba5]">
              Destination
            </p>
            <div ref={countryRef} className="mt-2.5 flex gap-2 overflow-x-auto pb-1">
              {COUNTRIES.map((c) => {
                const isActive = c.code === selectedCountry;
                return (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => {
                      hapticSelect();
                      setSelectedCountry(c.code);
                    }}
                    className={`flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2.5 text-[13px] font-semibold transition-colors ${
                      isActive
                        ? "bg-[#15161a] text-white"
                        : "bg-white text-[#15161a] shadow-[0_2px_10px_rgba(20,20,25,0.06)]"
                    }`}
                  >
                    <span className="text-[16px] leading-none">{c.flag}</span>
                    {c.name}
                  </button>
                );
              })}
            </div>

            <p className="mt-5 text-[12.5px] font-semibold uppercase tracking-wide text-[#adaba5]">
              Data plan
            </p>
            <div ref={planRef} className="mt-2.5 flex flex-col gap-2">
              {PLANS.map((p) => {
                const isActive = p.id === selectedPlan;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      hapticSelect();
                      setSelectedPlan(p.id);
                    }}
                    className={`flex items-center justify-between rounded-2xl px-4 py-3.5 text-left transition-colors ${
                      isActive
                        ? "bg-[#15161a] text-white"
                        : "bg-white text-[#15161a] shadow-[0_2px_10px_rgba(20,20,25,0.06)]"
                    }`}
                  >
                    <span>
                      <span className="block text-[14.5px] font-semibold">{p.data}</span>
                      <span className={`block text-[12px] ${isActive ? "text-white/60" : "text-[#9a9994]"}`}>
                        {p.days} days
                      </span>
                    </span>
                    <span className="text-[15px] font-bold">${p.price.toFixed(2)}</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-5 flex items-center justify-between rounded-2xl bg-white px-4 py-3.5 shadow-[0_2px_10px_rgba(20,20,25,0.06)]">
              <span className="text-[13.5px] font-medium text-[#6f6e6a]">Total</span>
              <span className="text-[16px] font-bold text-[#15161a]">${activePlan.price.toFixed(2)}</span>
            </div>

            <button
              ref={confirmRef}
              type="button"
              onClick={handleConfirm}
              className="mt-4 w-full rounded-full bg-[#15161a] py-4 text-[14.5px] font-semibold text-white"
            >
              Get eSIM
            </button>
          </>
        )}
      </div>
    </div>
  );
}
