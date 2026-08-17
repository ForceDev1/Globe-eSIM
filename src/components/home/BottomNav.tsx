"use client";

import { hapticSelect } from "@/lib/haptics";
import { HomeNavIcon, ActivitiesNavIcon, InsightsNavIcon, ProfileNavIcon } from "./icons";

export type NavTab = "home" | "activities" | "insights" | "profile";

const ITEMS: { key: NavTab; label: string; Icon: typeof HomeNavIcon }[] = [
  { key: "home", label: "Home", Icon: HomeNavIcon },
  { key: "activities", label: "Activities", Icon: ActivitiesNavIcon },
  { key: "insights", label: "Insights", Icon: InsightsNavIcon },
  { key: "profile", label: "Profile", Icon: ProfileNavIcon },
];

type BottomNavProps = {
  active: NavTab;
  onSelect: (tab: NavTab) => void;
};

export default function BottomNav({ active, onSelect }: BottomNavProps) {
  function select(tab: NavTab) {
    if (tab !== active) hapticSelect();
    onSelect(tab);
  }

  return (
    <nav
      className="fixed left-1/2 z-40 flex w-[calc(100%-32px)] max-w-[380px] -translate-x-1/2 items-center justify-between rounded-full bg-[#f1efec] p-1.5 shadow-[0_8px_24px_rgba(20,20,25,0.08)]"
      style={{ bottom: "max(20px, calc(env(safe-area-inset-bottom) + 12px))" }}
    >
      {ITEMS.map(({ key, label, Icon }) => {
        const isActive = key === active;
        return (
          <button
            key={key}
            type="button"
            onClick={() => select(key)}
            aria-current={isActive ? "page" : undefined}
            className={`flex flex-1 flex-col items-center gap-1 rounded-full py-2.5 transition-colors ${
              isActive ? "bg-white shadow-[0_2px_8px_rgba(20,20,25,0.08)]" : ""
            }`}
          >
            <Icon
              className="h-[18px] w-[18px]"
              style={{ color: isActive ? "#15161a" : "#adaba5" }}
            />
            <span
              className="text-[10px] font-medium"
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
