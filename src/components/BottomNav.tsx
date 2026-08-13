"use client";

import { House, CardSim, Globe, UserRound } from "lucide-react";

type NavTab = "home" | "esims" | "explore" | "profile";

type BottomNavProps = {
  active: NavTab;
  onExplore: () => void;
};

const items: {
  key: NavTab;
  label: string;
  icon: typeof House;
}[] = [
  { key: "home", label: "Home", icon: House },
  { key: "esims", label: "My eSIMs", icon: CardSim },
  { key: "explore", label: "Explore", icon: Globe },
  { key: "profile", label: "Profile", icon: UserRound },
];

/**
 * Fixed, frosted "liquid glass" tab bar: a blurred translucent panel with a
 * soft top highlight, floating above content regardless of scroll position.
 */
export default function BottomNav({ active, onExplore }: BottomNavProps) {
  return (
    <nav
      className="glass-surface fixed left-1/2 z-40 flex w-[calc(100%-40px)] max-w-[380px] -translate-x-1/2 items-center justify-between rounded-full px-3 py-2"
      style={{ bottom: "max(20px, calc(env(safe-area-inset-bottom) + 12px))" }}
    >
      {items.map(({ key, label, icon: Icon }) => {
        const isActive = key === active;
        return (
          <button
            key={key}
            type="button"
            aria-label={label}
            aria-current={isActive ? "page" : undefined}
            onClick={key === "explore" ? onExplore : undefined}
            className="relative flex h-11 w-11 items-center justify-center rounded-full"
          >
            {isActive && (
              <span
                aria-hidden
                className="absolute inset-0 rounded-full"
                style={{
                  background: "var(--glass-bubble)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.35)",
                }}
              />
            )}
            <Icon
              size={21}
              strokeWidth={2}
              className={`relative ${isActive ? "text-white" : "text-white/55"}`}
            />
          </button>
        );
      })}
    </nav>
  );
}
