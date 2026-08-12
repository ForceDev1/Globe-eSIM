"use client";

import { useEffect, useState } from "react";
import {
  Search,
  QrCode,
  ChevronRight,
  Globe,
  House,
  CardSim,
  Signal,
  MessageCircle,
  CircleUserRound,
} from "lucide-react";
import RingBadge from "@/components/RingBadge";
import CountrySheet from "@/components/CountrySheet";
import {
  countries,
  flagEmoji,
  findCountry,
  popularCountryCodes,
  type Country,
} from "@/data/countries";

const popularDestinations = popularCountryCodes
  .map((code) => countries.find((c) => c.code === code))
  .filter((c): c is Country => Boolean(c));

function IconButton({
  children,
  label,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white/90"
    >
      {children}
    </button>
  );
}

function NavButton({
  children,
  label,
  active = false,
}: {
  children: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-current={active ? "page" : undefined}
      className={`flex h-11 w-11 items-center justify-center rounded-full ${
        active ? "text-white" : "text-white/55"
      }`}
    >
      {children}
    </button>
  );
}

export default function EsimHome() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [prefillCode, setPrefillCode] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const activeEsim = findCountry("FR");

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(timer);
  }, [toast]);

  function openSheet(code: string | null = null) {
    setPrefillCode(code);
    setSheetOpen(true);
  }

  function handleConfirm(country: Country) {
    setSheetOpen(false);
    setToast(`Activating your eSIM for ${country.name}…`);
  }

  return (
    <div className="flex min-h-screen justify-center bg-black">
      <div
        className="flex w-full max-w-[420px] flex-col px-5 pt-6"
        style={{ paddingBottom: "max(16px, env(safe-area-inset-bottom))" }}
      >
        {/* Toast — sits below the header row so it never overlaps the
            search / QR icon buttons */}
        <div
          role="status"
          aria-live="polite"
          className={`fixed left-1/2 z-[60] w-[calc(100%-40px)] max-w-[380px] -translate-x-1/2 rounded-2xl bg-[var(--sheet-bg)] px-4 py-3 text-center text-[14px] font-medium text-white shadow-lg transition-all duration-300 ${
            toast ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-3 opacity-0"
          }`}
          style={{ top: "calc(env(safe-area-inset-top, 0px) + 84px)" }}
        >
          {toast}
        </div>

        {/* Header */}
        <header className="flex items-center justify-between pb-5">
          <h1 className="text-[28px] font-bold tracking-tight text-white">
            eSIM
          </h1>
          <div className="flex items-center gap-2.5">
            <IconButton label="Search countries" onClick={() => openSheet()}>
              <Search size={18} strokeWidth={2} />
            </IconButton>
            <IconButton label="Scan QR to activate">
              <QrCode size={18} strokeWidth={2} />
            </IconButton>
          </div>
        </header>

        {/* Primary CTA */}
        <button
          type="button"
          onClick={() => openSheet()}
          className="flex items-center gap-3.5 rounded-[26px] p-4 text-left"
          style={{ background: "var(--accent-soft)" }}
        >
          <span
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full"
            style={{ background: "var(--accent)" }}
          >
            <Globe size={22} strokeWidth={2} className="text-white" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[16px] font-semibold text-white">
              Connect eSIM
            </span>
            <span className="block text-[13px] text-[var(--text-secondary)]">
              Instant data in 190+ countries
            </span>
          </span>
          <ChevronRight size={18} strokeWidth={2} className="shrink-0 text-white/50" />
        </button>

        {/* Top two cards */}
        <div className="mt-3.5 grid grid-cols-2 gap-3.5">
          <div className="flex h-[164px] flex-col justify-between rounded-[26px] bg-[var(--card-bg)] p-4">
            <div className="flex items-start justify-between">
              <RingBadge
                value={activeEsim ? flagEmoji(activeEsim.code) : "—"}
                size={40}
                progress={0.68}
              />
              <span className="mt-1 text-[11px] font-medium text-[var(--text-secondary)]">
                68%
              </span>
            </div>
            <div>
              <p className="text-[15px] font-semibold text-white">
                {activeEsim?.name ?? "Active eSIM"}
              </p>
              <p className="mt-0.5 text-[13px] text-[var(--text-secondary)]">
                Expires in 12 days
              </p>
            </div>
          </div>

          <div className="flex h-[164px] flex-col justify-between rounded-[26px] bg-[var(--card-bg)] p-4">
            <div className="flex items-start justify-between">
              <span className="text-[28px] font-bold leading-none text-white">
                3.6
                <span className="ml-1 text-[15px] font-medium text-[var(--text-secondary)]">
                  GB
                </span>
              </span>
              <Signal size={16} strokeWidth={2} className="mt-1 text-white/50" />
            </div>
            <div>
              <p className="text-[15px] font-semibold text-white">
                Data left
              </p>
              <p className="mt-0.5 text-[13px] text-[var(--text-secondary)]">
                of 5 GB total
              </p>
            </div>
          </div>
        </div>

        {/* Popular destinations */}
        <div className="mt-3.5 rounded-[26px] bg-[var(--card-bg)] py-5">
          <div className="flex items-center justify-between px-5">
            <h2 className="text-[15px] font-semibold text-white">
              Popular destinations
            </h2>
            <button
              type="button"
              onClick={() => openSheet()}
              className="text-[13px] font-medium"
              style={{ color: "var(--accent)" }}
            >
              See all
            </button>
          </div>

          <div className="mt-3.5 flex gap-3 overflow-x-auto px-5 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {popularDestinations.map((country) => (
              <button
                key={country.code}
                type="button"
                onClick={() => openSheet(country.code)}
                className="flex w-[112px] shrink-0 flex-col items-start gap-2 rounded-2xl bg-white/[0.05] p-3 text-left"
              >
                <span className="text-[26px] leading-none">
                  {flagEmoji(country.code)}
                </span>
                <span className="text-[13px] font-medium leading-tight text-white">
                  {country.name}
                </span>
                <span className="text-[12px] text-[var(--text-secondary)]">
                  from ${country.price}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Spend row */}
        <div className="mt-3.5 flex items-center justify-between rounded-[26px] bg-[var(--card-bg)] px-5 py-4">
          <div>
            <p className="text-[15px] font-semibold text-white">
              Total spent
            </p>
            <p className="mt-0.5 text-[13px] text-[var(--text-secondary)]">
              This month
            </p>
          </div>
          <span className="text-[26px] font-bold leading-none text-white">
            $18
            <span className="ml-1 text-[14px] font-medium text-[var(--text-secondary)]">
              .50
            </span>
          </span>
        </div>

        {/* Spacer before bottom nav */}
        <div className="min-h-8 flex-1" />

        {/* Bottom nav */}
        <nav className="sticky bottom-0 mt-5 flex items-center justify-between rounded-full bg-[#141416] px-3 py-2">
          <NavButton label="Home" active>
            <House size={22} strokeWidth={2} />
          </NavButton>
          <NavButton label="My eSIMs">
            <CardSim size={22} strokeWidth={2} />
          </NavButton>
          <NavButton label="Usage">
            <Signal size={22} strokeWidth={2} />
          </NavButton>
          <NavButton label="Support chat">
            <span className="relative flex">
              <MessageCircle size={22} strokeWidth={2} />
              <span className="absolute -right-0.5 -top-0.5 h-[7px] w-[7px] rounded-full bg-white" />
            </span>
          </NavButton>
          <NavButton label="Profile">
            <CircleUserRound size={22} strokeWidth={2} />
          </NavButton>
        </nav>
      </div>

      <CountrySheet
        open={sheetOpen}
        initialCode={prefillCode}
        onClose={() => setSheetOpen(false)}
        onConfirm={handleConfirm}
      />
    </div>
  );
}
