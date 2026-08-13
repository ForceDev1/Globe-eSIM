"use client";

import { useMemo, useState } from "react";
import { Search, X, ChevronRight } from "lucide-react";
import { countries, flagEmoji, type Country } from "@/data/countries";

type CountrySheetProps = {
  open: boolean;
  onClose: () => void;
  onSelect: (country: Country) => void;
};

export default function CountrySheet({ open, onClose, onSelect }: CountrySheetProps) {
  const [query, setQuery] = useState("");

  // Clear the search whenever the sheet (re)opens — adjusted during render
  // rather than in an effect, per React's guidance on resetting state from
  // props.
  const [prevOpen, setPrevOpen] = useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) setQuery("");
  }

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return countries;
    return countries.filter((c) => c.name.toLowerCase().includes(q));
  }, [query]);

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
        className="absolute inset-0 bg-black/40"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Choose a country"
        className={`relative flex w-full max-w-[420px] flex-col rounded-t-[28px] bg-[var(--card-bg)] pt-3 transition-transform duration-300 ease-out ${
          open ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ maxHeight: "82vh" }}
      >
        <div className="mx-auto h-1 w-9 shrink-0 rounded-full bg-black/10" />

        <div className="flex items-center justify-between px-5 pt-4">
          <h2 className="text-[19px] font-semibold text-[var(--ink)]">
            Choose a country
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f0f2f7] text-[var(--ink)]"
          >
            <X size={16} strokeWidth={2} />
          </button>
        </div>

        <div className="px-5 pt-4">
          <div className="flex items-center gap-2 rounded-2xl bg-[#f0f2f7] px-4 py-3">
            <Search size={17} strokeWidth={2} className="text-[var(--ink-soft)]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              type="text"
              inputMode="search"
              placeholder="Search country"
              className="w-full bg-transparent text-[15px] text-[var(--ink)] placeholder:text-[var(--ink-soft)] focus:outline-none"
            />
          </div>
        </div>

        <ul className="mt-2 min-h-0 flex-1 overflow-y-auto px-2 pb-2" style={{ paddingBottom: "max(16px, env(safe-area-inset-bottom))" }}>
          {results.length === 0 && (
            <li className="px-3 py-8 text-center text-[14px] text-[var(--ink-soft)]">
              No countries match &ldquo;{query}&rdquo;
            </li>
          )}
          {results.map((country) => (
            <li key={country.code}>
              <button
                type="button"
                onClick={() => onSelect(country)}
                className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left active:bg-[#f0f2f7]"
              >
                <span className="text-[24px] leading-none">
                  {flagEmoji(country.code)}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[15px] font-medium text-[var(--ink)]">
                    {country.name}
                  </span>
                  <span className="block text-[13px] text-[var(--ink-soft)]">
                    from ${country.price}
                  </span>
                </span>
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f0f2f7] text-[var(--ink-soft)]">
                  <ChevronRight size={15} strokeWidth={2} />
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
