"use client";

import { useEffect, useState } from "react";
import { CardSim, ChevronDown, ChevronRight, Search, Wallet, Gift } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import CountrySheet from "@/components/CountrySheet";
import PlanSheet from "@/components/PlanSheet";
import TopUpSheet from "@/components/TopUpSheet";
import {
  countries,
  flagEmoji,
  suggestedForYouCodes,
  type Country,
} from "@/data/countries";
import { plans } from "@/data/plans";

const destinationSuggestions = suggestedForYouCodes
  .map((code) => countries.find((c) => c.code === code))
  .filter((c): c is Country => Boolean(c));

const USER_NAME = "Alex";
const USER_INITIALS = "A";

export default function EsimHome() {
  const [balance, setBalance] = useState(24.8);

  const [countrySheetOpen, setCountrySheetOpen] = useState(false);
  const [topUpOpen, setTopUpOpen] = useState(false);

  const [planOpen, setPlanOpen] = useState(false);
  const [planCountry, setPlanCountry] = useState<Country | null>(null);
  const [planPreselect, setPlanPreselect] = useState<string | null>(null);

  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(timer);
  }, [toast]);

  function openPlan(country: Country | null, planId: string | null = null) {
    setPlanCountry(country);
    setPlanPreselect(planId);
    setPlanOpen(true);
  }

  function handleCountrySelected(country: Country) {
    setCountrySheetOpen(false);
    // Let the country sheet finish closing before the plan sheet slides up,
    // so the two transitions read as a sequence rather than a jump-cut.
    setTimeout(() => openPlan(country), 220);
  }

  function handleCheckout({
    country,
    planId,
    quantity,
  }: {
    country: Country | null;
    planId: string;
    quantity: number;
  }) {
    const plan = plans.find((p) => p.id === planId);
    setPlanOpen(false);
    const place = country ? country.name : "Global+";
    setToast(
      `${quantity > 1 ? `${quantity} eSIMs` : "eSIM"} for ${place} (${plan?.dataGb}GB) added — check out securely next.`,
    );
  }

  function handleTopUp(amount: number) {
    setTopUpOpen(false);
    setBalance((b) => b + amount);
    setToast(`$${amount.toFixed(2)} added to your balance.`);
  }

  return (
    <div className="flex min-h-screen justify-center bg-[var(--page-bg)]">
      <div
        className="flex w-full max-w-[420px] flex-col pb-32"
        style={{
          background: "linear-gradient(180deg, var(--header-wash) 0%, var(--page-bg) 300px)",
        }}
      >
        {/* Toast */}
        <div
          role="status"
          aria-live="polite"
          className={`fixed left-1/2 z-[60] w-[calc(100%-40px)] max-w-[380px] -translate-x-1/2 rounded-2xl px-4 py-3 text-center text-[14px] font-medium text-white shadow-lg transition-all duration-300 ${
            toast ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-3 opacity-0"
          }`}
          style={{
            top: "calc(env(safe-area-inset-top, 0px) + 16px)",
            background: "var(--dark)",
          }}
        >
          {toast}
        </div>

        <div
          className="flex flex-col px-5 pt-6"
          style={{ paddingTop: "max(24px, calc(env(safe-area-inset-top) + 12px))" }}
        >
          {/* Header */}
          <header className="flex items-center justify-between">
            <button
              type="button"
              className="flex items-center gap-2.5 rounded-full bg-white/70 py-1.5 pl-1.5 pr-3 shadow-sm"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--dark)]">
                <CardSim size={16} strokeWidth={2} className="text-white" />
              </span>
              <span className="text-left leading-tight">
                <span className="block text-[13px] font-semibold text-[var(--ink)]">
                  eSIM Line
                </span>
                <span className="block text-[11px] text-[var(--ink-soft)]">
                  +1 555 010 0199
                </span>
              </span>
              <ChevronDown size={14} strokeWidth={2} className="text-[var(--ink-soft)]" />
            </button>

            <button
              type="button"
              aria-label="Profile"
              className="flex h-11 w-11 items-center justify-center rounded-full text-[15px] font-bold text-white"
              style={{ background: "linear-gradient(135deg, var(--accent-2), var(--accent))" }}
            >
              {USER_INITIALS}
            </button>
          </header>

          {/* Search */}
          <button
            type="button"
            onClick={() => setCountrySheetOpen(true)}
            className="mt-5 flex items-center gap-2.5 rounded-2xl bg-white px-4 py-3.5 text-left shadow-sm"
          >
            <Search size={17} strokeWidth={2} className="text-[var(--ink-soft)]" />
            <span className="text-[15px] text-[var(--ink-soft)]">Search a country…</span>
          </button>

          {/* Greeting */}
          <div className="mt-5">
            <p className="text-[20px] font-bold text-[var(--ink)]">Hi {USER_NAME},</p>
            <p className="mt-0.5 text-[13px] text-[var(--ink-soft)]">
              Overview of your recent usage
            </p>
          </div>

          {/* Balance */}
          <div className="mt-4 flex items-center justify-between rounded-[24px] bg-white p-4 shadow-[var(--shadow-card)]">
            <div className="flex items-center gap-3">
              <span
                className="flex h-11 w-11 items-center justify-center rounded-full"
                style={{ background: "linear-gradient(135deg, var(--accent-2), var(--accent))" }}
              >
                <Wallet size={18} strokeWidth={2} className="text-white" />
              </span>
              <div>
                <p className="text-[12px] text-[var(--ink-soft)]">Current Balance</p>
                <p className="text-[19px] font-bold text-[var(--ink)]">
                  ${balance.toFixed(2)}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setTopUpOpen(true)}
              className="flex items-center gap-1 rounded-full py-2.5 pl-4 pr-3 text-[13px] font-semibold text-white"
              style={{ background: "var(--dark)" }}
            >
              Top Up
              <span className="text-[16px] leading-none">+</span>
            </button>
          </div>

          {/* Destination for you */}
          <div className="mt-6 flex items-center justify-between">
            <h2 className="text-[16px] font-bold text-[var(--ink)]">
              Destination for you
            </h2>
            <button
              type="button"
              onClick={() => setCountrySheetOpen(true)}
              className="text-[13px] font-medium text-[var(--ink-soft)]"
            >
              See all
            </button>
          </div>

          <div className="mt-3.5 grid grid-cols-3 gap-3">
            {destinationSuggestions.map((country) => (
              <button
                key={country.code}
                type="button"
                onClick={() => openPlan(country)}
                className="flex flex-col items-center gap-2"
              >
                <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-white text-[30px] shadow-sm">
                  {flagEmoji(country.code)}
                  <span
                    className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full text-white"
                    style={{ background: "var(--dark)" }}
                  >
                    <ChevronRight size={13} strokeWidth={2.5} />
                  </span>
                </span>
                <span className="text-[13px] font-medium text-[var(--ink)]">
                  {country.name}
                </span>
              </button>
            ))}
          </div>

          {/* Promo banner */}
          <button
            type="button"
            onClick={() => setTopUpOpen(true)}
            className="mt-6 flex items-center gap-4 rounded-[24px] p-5 text-left"
            style={{ background: "var(--pink)" }}
          >
            <div className="min-w-0 flex-1">
              <p
                className="text-[11px] font-bold uppercase tracking-wide"
                style={{ color: "var(--pink-ink)", opacity: 0.8 }}
              >
                Gift Balance
              </p>
              <p className="mt-1 text-[18px] font-extrabold leading-snug" style={{ color: "var(--pink-ink)" }}>
                25% Gift Balance Get Instantly!
              </p>
              <p className="mt-1 text-[12px]" style={{ color: "var(--pink-ink)", opacity: 0.85 }}>
                Get 25% extra credit on every top-up.
              </p>
              <span
                className="mt-3 inline-block rounded-full px-4 py-2 text-[13px] font-semibold text-white"
                style={{ background: "var(--dark)" }}
              >
                Buy Now
              </span>
            </div>
            <Gift size={44} strokeWidth={1.5} style={{ color: "var(--pink-ink)" }} className="shrink-0" />
          </button>

          {/* Popular plans */}
          <div className="mt-6 flex items-center justify-between">
            <h2 className="text-[16px] font-bold text-[var(--ink)]">Popular plans</h2>
          </div>

          <div className="mt-3.5 flex gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {plans.map((plan) => (
              <button
                key={plan.id}
                type="button"
                onClick={() => openPlan(null, plan.id)}
                className="flex w-[128px] shrink-0 flex-col items-start gap-2 rounded-2xl bg-white p-3.5 text-left shadow-sm"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f0f2f7]">
                  <Wallet size={15} strokeWidth={2} className="text-[var(--ink)]" />
                </span>
                <span className="text-[13px] font-semibold text-[var(--ink)]">
                  {plan.dataGb}GB Plan
                </span>
                <span className="text-[12px] text-[var(--ink-soft)]">
                  ${plan.price.toFixed(2)} · {plan.days}d
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <BottomNav active="home" onExplore={() => setCountrySheetOpen(true)} />

      <CountrySheet
        open={countrySheetOpen}
        onClose={() => setCountrySheetOpen(false)}
        onSelect={handleCountrySelected}
      />
      <PlanSheet
        open={planOpen}
        country={planCountry}
        initialPlanId={planPreselect}
        onClose={() => setPlanOpen(false)}
        onCheckout={handleCheckout}
      />
      <TopUpSheet
        open={topUpOpen}
        balance={balance}
        onClose={() => setTopUpOpen(false)}
        onConfirm={handleTopUp}
      />
    </div>
  );
}
