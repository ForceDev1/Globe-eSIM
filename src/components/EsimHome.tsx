"use client";

import { useEffect, useState } from "react";
import BottomNav, { type NavTab } from "@/components/BottomNav";
import HomeView from "@/components/HomeView";
import MyEsimsView from "@/components/MyEsimsView";
import CountrySheet from "@/components/CountrySheet";
import PlanSheet from "@/components/PlanSheet";
import TopUpSheet from "@/components/TopUpSheet";
import InstallSheet from "@/components/InstallSheet";
import { type Country } from "@/data/countries";
import { plans } from "@/data/plans";
import { createEsim, initialEsims, planFor, type OwnedEsim } from "@/data/esims";

export default function EsimHome() {
  const [activeTab, setActiveTab] = useState<Exclude<NavTab, "explore">>("home");
  const [balance, setBalance] = useState(24.8);
  const [esims, setEsims] = useState<OwnedEsim[]>(initialEsims);

  const [countrySheetOpen, setCountrySheetOpen] = useState(false);
  const [topUpOpen, setTopUpOpen] = useState(false);

  const [planOpen, setPlanOpen] = useState(false);
  const [planCountry, setPlanCountry] = useState<Country | null>(null);
  const [planPreselect, setPlanPreselect] = useState<string | null>(null);

  const [installOpen, setInstallOpen] = useState(false);
  const [installEsim, setInstallEsim] = useState<OwnedEsim | null>(null);

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

  function handleNavSelect(tab: NavTab) {
    if (tab === "explore") {
      setCountrySheetOpen(true);
      return;
    }
    if (tab === "home" || tab === "esims") {
      setActiveTab(tab);
    }
    // "profile" has no dedicated screen yet.
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
  }: {
    country: Country | null;
    planId: string;
    quantity: number;
  }) {
    const plan = plans.find((p) => p.id === planId);
    setPlanOpen(false);
    const place = country ? country.name : "Global+";
    setToast(`eSIM for ${place} (${plan?.dataGb}GB) purchased — let's get it installed.`);

    const newEsim = createEsim(country ? country.code : null, planId);
    setEsims((list) => [newEsim, ...list]);
    setTimeout(() => {
      setInstallEsim(newEsim);
      setInstallOpen(true);
    }, 260);
  }

  function handleTopUp(amount: number) {
    setTopUpOpen(false);
    setBalance((b) => b + amount);
    setToast(`$${amount.toFixed(2)} added to your balance.`);
  }

  function handleInstallRequest(esim: OwnedEsim) {
    setInstallEsim(esim);
    setInstallOpen(true);
  }

  function handleInstalled(esimId: string) {
    setEsims((list) =>
      list.map((e) =>
        e.id === esimId && e.status === "pending"
          ? { ...e, status: "active", expiresLabel: `Expires in ${planFor(e).days} days` }
          : e,
      ),
    );
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

        {activeTab === "home" ? (
          <HomeView
            balance={balance}
            onSearch={() => setCountrySheetOpen(true)}
            onTopUp={() => setTopUpOpen(true)}
            onDestination={(country) => openPlan(country)}
            onPlanChip={(planId) => openPlan(null, planId)}
          />
        ) : (
          <MyEsimsView
            esims={esims}
            onInstall={handleInstallRequest}
            onAddNew={() => setCountrySheetOpen(true)}
          />
        )}
      </div>

      <BottomNav active={activeTab} onSelect={handleNavSelect} />

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
      <InstallSheet
        open={installOpen}
        esim={installEsim}
        onClose={() => setInstallOpen(false)}
        onInstalled={handleInstalled}
      />
    </div>
  );
}
