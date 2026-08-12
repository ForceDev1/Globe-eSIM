"use client";

import { useMemo, useState } from "react";
import { Search, X, Check } from "lucide-react";
import { countries, flagEmoji, type Country } from "@/data/countries";

type CountrySheetProps = {
  open: boolean;
  initialCode: string | null;
  onClose: () => void;
  onConfirm: (country: Country) => void;
};

export default function CountrySheet({
  open,
  initialCode,
  onClose,
  onConfirm,
}: CountrySheetProps) {
  const [query, setQuery] = useState("");
  const [picked, setPicked] = useState<string | null>(initialCode);

  // Re-sync the picked country + search whenever the sheet (re)opens, e.g.
  // from tapping a specific destination chip — adjusted during render
  // rather than in an effect, per React's guidance on resetting state from
  // props (react.dev/learn/you-might-not-need-an-effect).
  const openKey = open ? initialCode ?? "" : "__closed__";
  const [prevOpenKey, setPrevOpenKey] = useState(openKey);
  if (openKey !== prevOpenKey) {
    setPrevOpenKey(openKey);
    if (open) {
      setPicked(initialCode);
      setQuery("");
    }
  }

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return countries;
    return countries.filter((c) => c.name.toLowerCase().includes(q));
  }, [query]);

  const selected = countries.find((c) => c.code === picked) ?? null;

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
        className="absolute inset-0 bg-black/60"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Choose a country"
        className={`relative flex w-full max-w-[420px] flex-col rounded-t-[28px] bg-[var(--sheet-bg)] pt-3 transition-transform duration-300 ease-out ${
          open ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ maxHeight: "82vh" }}
      >
        <div className="mx-auto h-1 w-9 shrink-0 rounded-full bg-white/20" />

        <div className="flex items-center justify-between px-5 pt-4">
          <h2 className="text-[19px] font-semibold text-white">Choose a country</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/80"
          >
            <X size={16} strokeWidth={2} />
          </button>
        </div>

        <div className="px-5 pt-4">
          <div className="flex items-center gap-2 rounded-2xl bg-white/[0.06] px-4 py-3">
            <Search size={17} strokeWidth={2} className="text-white/40" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              type="text"
              inputMode="search"
              placeholder="Search country"
              className="w-full bg-transparent text-[15px] text-white placeholder:text-white/40 focus:outline-none"
            />
          </div>
        </div>

        <ul className="mt-2 min-h-0 flex-1 overflow-y-auto px-2 pb-2">
          {results.length === 0 && (
            <li className="px-3 py-8 text-center text-[14px] text-[var(--text-secondary)]">
              No countries match &ldquo;{query}&rdquo;
            </li>
          )}
          {results.map((country) => {
            const isSelected = country.code === picked;
            return (
              <li key={country.code}>
                <button
                  type="button"
                  onClick={() => setPicked(country.code)}
                  aria-pressed={isSelected}
                  className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left active:bg-white/[0.06] ${
                    isSelected ? "bg-[var(--accent-soft)]" : ""
                  }`}
                >
                  <span className="text-[24px] leading-none">
                    {flagEmoji(country.code)}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[15px] font-medium text-white">
                      {country.name}
                    </span>
                    <span className="block text-[13px] text-[var(--text-secondary)]">
                      from ${country.price}
                    </span>
                  </span>
                  {isSelected && (
                    <span
                      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
                      style={{ background: "var(--accent)" }}
                    >
                      <Check size={14} strokeWidth={2.5} className="text-white" />
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>

        <div
          className="border-t border-white/10 px-5 pb-5 pt-4"
          style={{ paddingBottom: "max(20px, env(safe-area-inset-bottom))" }}
        >
          <button
            type="button"
            disabled={!selected}
            onClick={() => selected && onConfirm(selected)}
            className="w-full rounded-2xl py-4 text-center text-[16px] font-semibold text-white transition-colors disabled:opacity-40"
            style={{ background: "var(--accent)" }}
          >
            {selected ? `Continue with ${selected.name}` : "Select a country"}
          </button>
        </div>
      </div>
    </div>
  );
}
