"use client";

import { useState } from "react";
import { HomeNavIcon, ActivitiesNavIcon, InsightsNavIcon } from "./icons";

const ITEMS = [
  { key: "home", label: "Home", Icon: HomeNavIcon },
  { key: "activities", label: "Activities", Icon: ActivitiesNavIcon },
  { key: "insights", label: "Insights", Icon: InsightsNavIcon },
] as const;

export default function BottomNav() {
  const [active, setActive] = useState<(typeof ITEMS)[number]["key"]>("home");

  return (
    <nav
      className="fixed left-1/2 z-40 flex w-[calc(100%-40px)] max-w-[380px] -translate-x-1/2 items-center justify-between rounded-full bg-[#f1efec] p-1.5 shadow-[0_8px_24px_rgba(20,20,25,0.08)]"
      style={{ bottom: "max(20px, calc(env(safe-area-inset-bottom) + 12px))" }}
    >
      {ITEMS.map(({ key, label, Icon }) => {
        const isActive = key === active;
        return (
          <button
            key={key}
            type="button"
            onClick={() => setActive(key)}
            aria-current={isActive ? "page" : undefined}
            className={`flex flex-1 flex-col items-center gap-1 rounded-full py-2.5 transition-colors ${
              isActive ? "bg-white shadow-[0_2px_8px_rgba(20,20,25,0.08)]" : ""
            }`}
          >
            <Icon
              className="h-[19px] w-[19px]"
              style={{ color: isActive ? "#15161a" : "#adaba5" }}
            />
            <span
              className="text-[11px] font-medium"
              style={{ color: isActive ? "#15161a" : "#adaba5" }}
            >
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
