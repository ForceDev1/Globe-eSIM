"use client";

import { CardSim, ChevronDown, ChevronRight, Search, Wallet, Gift } from "lucide-react";
import DotMatrixNumber from "@/components/DotMatrixNumber";
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

type HomeViewProps = {
  balance: number;
  onSearch: () => void;
  onTopUp: () => void;
  onDestination: (country: Country) => void;
  onPlanChip: (planId: string) => void;
};

export default function HomeView({
  balance,
  onSearch,
  onTopUp,
  onDestination,
  onPlanChip,
}: HomeViewProps) {
  const [dollars, cents] = balance.toFixed(2).split(".");

  return (
    <div
      className="flex flex-col px-5 pt-6"
      style={{ paddingTop: "max(24px, calc(env(safe-area-inset-top) + 12px))" }}
    >
      {/* Header */}
      <header className="flex items-center justify-between">
        <button
          type="button"
          className="flex items-center gap-2.5 rounded-full py-1.5 pl-1.5 pr-3"
          style={{ background: "var(--surface)" }}
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full" style={{ background: "var(--surface-2)" }}>
            <CardSim size={16} strokeWidth={2} className="text-[var(--ink)]" />
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
        onClick={onSearch}
        className="mt-5 flex items-center gap-2.5 rounded-2xl px-4 py-3.5 text-left"
        style={{ background: "var(--surface)" }}
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

      {/* Balance — the hero glow card */}
      <div
        className="mt-4 flex items-center justify-between rounded-[26px] p-5"
        style={{ background: "var(--glow-pink)", boxShadow: "var(--shadow-card)" }}
      >
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <Wallet size={15} strokeWidth={2} style={{ color: "var(--glow-pink-ink)" }} />
            <p className="text-[12px]" style={{ color: "var(--glow-pink-ink)", opacity: 0.85 }}>
              Current Balance
            </p>
          </div>
          <div className="mt-2 flex items-baseline gap-1" style={{ color: "#fff" }}>
            <span className="text-[22px] font-medium opacity-70">$</span>
            <DotMatrixNumber value={dollars} dot={6} gap={3.5} />
            <span className="text-[18px] font-medium opacity-70">.{cents}</span>
          </div>
        </div>
        <button
          type="button"
          onClick={onTopUp}
          className="flex items-center gap-1 rounded-full py-2.5 pl-4 pr-3 text-[13px] font-semibold text-[var(--ink)]"
          style={{ background: "var(--dark)" }}
        >
          Top Up
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white text-[11px] leading-none text-[#0a0a0c]">
            +
          </span>
        </button>
      </div>

      {/* Destination for you */}
      <div className="mt-6 flex items-center justify-between">
        <h2 className="text-[16px] font-bold text-[var(--ink)]">Destination for you</h2>
        <button
          type="button"
          onClick={onSearch}
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
            onClick={() => onDestination(country)}
            className="flex flex-col items-center gap-2"
          >
            <span
              className="relative flex h-16 w-16 items-center justify-center rounded-full text-[30px]"
              style={{ background: "var(--surface)" }}
            >
              {flagEmoji(country.code)}
              <span
                className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full text-[#0a0a0c]"
                style={{ background: "#fff" }}
              >
                <ChevronRight size={13} strokeWidth={2.5} />
              </span>
            </span>
            <span className="text-[13px] font-medium text-[var(--ink)]">{country.name}</span>
          </button>
        ))}
      </div>

      {/* Promo banner */}
      <button
        type="button"
        onClick={onTopUp}
        className="mt-6 flex items-center gap-4 rounded-[26px] p-5 text-left"
        style={{ background: "var(--glow-orange)" }}
      >
        <div className="min-w-0 flex-1">
          <p
            className="text-[11px] font-bold uppercase tracking-wide"
            style={{ color: "var(--glow-orange-ink)", opacity: 0.85 }}
          >
            Gift Balance
          </p>
          <p className="mt-1 text-[18px] font-extrabold leading-snug text-white">
            25% Gift Balance Get Instantly!
          </p>
          <p className="mt-1 text-[12px]" style={{ color: "var(--glow-orange-ink)", opacity: 0.85 }}>
            Get 25% extra credit on every top-up.
          </p>
          <span
            className="mt-3 inline-block rounded-full px-4 py-2 text-[13px] font-semibold text-[var(--ink)]"
            style={{ background: "var(--dark)" }}
          >
            Buy Now
          </span>
        </div>
        <Gift size={44} strokeWidth={1.5} className="shrink-0 text-white" />
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
            onClick={() => onPlanChip(plan.id)}
            className="flex w-[128px] shrink-0 flex-col items-start gap-2 rounded-2xl p-3.5 text-left"
            style={{ background: "var(--surface)" }}
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full" style={{ background: "var(--surface-2)" }}>
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
  );
}
