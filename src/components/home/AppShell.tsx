"use client";

import { useEffect, useRef, useState } from "react";
import { hapticSelect } from "@/lib/haptics";
import { useTelegramSafeAreaTop } from "@/lib/useTelegramSafeAreaTop";
import TourOverlay, { type TourStep } from "@/components/tour/TourOverlay";
import BottomNav, { type NavTab } from "./BottomNav";
import HomeScreen from "./HomeScreen";
import ProfileScreen from "./ProfileScreen";
import ComingSoonScreen from "./ComingSoonScreen";
import AddEsimSheet from "./AddEsimSheet";

export default function AppShell() {
  const [activeTab, setActiveTab] = useState<NavTab>("home");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [tourStep, setTourStep] = useState<number | null>(null);
  // Clears Telegram's own fullscreen-mode controls (close/more buttons) at
  // the top, which otherwise sit directly over the page's content — see
  // useTelegramSafeAreaTop for the real Bot API 8.0 values this reads.
  const extraTop = useTelegramSafeAreaTop(6, 0.5);

  // Real targets for the setup tour below — the tour spotlights these exact
  // elements, it doesn't fake positions.
  const addEsimBtnRef = useRef<HTMLButtonElement>(null);
  const countryRef = useRef<HTMLDivElement>(null);
  const planRef = useRef<HTMLDivElement>(null);
  const confirmRef = useRef<HTMLButtonElement>(null);

  // AppShell only mounts once the greeting intro finishes (see page.tsx), so
  // starting the tour here is naturally "right after the greeting".
  useEffect(() => {
    const id = setTimeout(() => setTourStep(0), 600);
    return () => clearTimeout(id);
  }, []);

  const tourSteps: TourStep[] = [
    {
      ref: addEsimBtnRef,
      title: "Add your first eSIM",
      description: "Tap here to get connected in any country — no physical SIM needed.",
    },
    {
      ref: countryRef,
      title: "Choose a destination",
      description: "Pick the country you're traveling to.",
    },
    {
      ref: planRef,
      title: "Pick a data plan",
      description: "Choose how much data you need for the trip.",
    },
    {
      ref: confirmRef,
      title: "Get your eSIM",
      description: "Confirm and it's ready to activate — that's the whole flow.",
    },
  ];

  function openSheet() {
    setSheetOpen(true);
  }

  function closeSheet() {
    setSheetOpen(false);
    // The sheet's own contents are steps 2-4 — closing it mid-tour would
    // leave the spotlight pointing at a hidden element, so end the tour too.
    if (tourStep !== null && tourStep >= 1) setTourStep(null);
  }

  function tourNext() {
    hapticSelect();
    setTourStep((step) => {
      if (step === null) return step;
      if (step === 0) setSheetOpen(true);
      if (step >= tourSteps.length - 1) return null;
      return step + 1;
    });
  }

  function tourBack() {
    hapticSelect();
    setTourStep((step) => {
      if (step === null || step === 0) return step;
      if (step === 1) setSheetOpen(false);
      return step - 1;
    });
  }

  function tourSkip() {
    setTourStep(null);
  }

  return (
    <div className="min-h-screen w-full bg-[#efeeec]">
      <div
        className="mx-auto flex w-full max-w-[420px] flex-col px-5 pb-32"
        style={{ paddingTop: `calc(max(5px, env(safe-area-inset-top)) + ${extraTop}px)` }}
      >
        {activeTab === "home" && <HomeScreen addEsimButtonRef={addEsimBtnRef} onAddEsim={openSheet} />}
        {activeTab === "profile" && <ProfileScreen />}
        {activeTab === "activities" && <ComingSoonScreen title="Activities" />}
        {activeTab === "insights" && <ComingSoonScreen title="Insights" />}
      </div>
      <BottomNav active={activeTab} onSelect={setActiveTab} />

      <AddEsimSheet
        open={sheetOpen}
        onClose={closeSheet}
        countryRef={countryRef}
        planRef={planRef}
        confirmRef={confirmRef}
      />

      {tourStep !== null && (
        <TourOverlay steps={tourSteps} stepIndex={tourStep} onNext={tourNext} onBack={tourBack} onSkip={tourSkip} />
      )}
    </div>
  );
}
