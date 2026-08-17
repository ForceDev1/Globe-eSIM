"use client";

import { useState } from "react";
import { useTelegramSafeAreaTop } from "@/lib/useTelegramSafeAreaTop";
import BottomNav, { type NavTab } from "./BottomNav";
import HomeScreen from "./HomeScreen";
import ProfileScreen from "./ProfileScreen";
import ComingSoonScreen from "./ComingSoonScreen";

export default function AppShell() {
  const [activeTab, setActiveTab] = useState<NavTab>("home");
  // Clears Telegram's own fullscreen-mode controls (close/more buttons) at
  // the top, which otherwise sit directly over the page's content — see
  // useTelegramSafeAreaTop for the real Bot API 8.0 values this reads.
  const extraTop = useTelegramSafeAreaTop(6, 0.5);

  return (
    <div className="min-h-screen w-full bg-[#efeeec]">
      <div
        className="mx-auto flex w-full max-w-[420px] flex-col px-5 pb-32"
        style={{ paddingTop: `calc(max(5px, env(safe-area-inset-top)) + ${extraTop}px)` }}
      >
        {activeTab === "home" && <HomeScreen />}
        {activeTab === "profile" && <ProfileScreen />}
        {activeTab === "activities" && <ComingSoonScreen title="Activities" />}
        {activeTab === "insights" && <ComingSoonScreen title="Insights" />}
      </div>
      <BottomNav active={activeTab} onSelect={setActiveTab} />
    </div>
  );
}
