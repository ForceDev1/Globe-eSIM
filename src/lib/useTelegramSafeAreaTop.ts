"use client";

import { useEffect, useState } from "react";
import { getTelegramWebApp } from "./haptics";

/**
 * Extra top inset (px) to clear Telegram's own fullscreen-mode controls
 * (close/more buttons) plus the device's own safe area, on top of whatever
 * this page's own `env(safe-area-inset-top)` already accounts for.
 * Reactive: Telegram fires contentSafeAreaChanged/safeAreaChanged when the
 * layout shifts (e.g. rotation). `fallbackPx` is what's used outside
 * Telegram (or before the SDK has reported real values) so there's still a
 * sensible small gap in a plain browser preview.
 *
 * `scale` shrinks the *real* Telegram-reported inset too (not just the
 * fallback) — full clearance read as too much padding in practice, so this
 * deliberately doesn't clear the whole reported area.
 */
export function useTelegramSafeAreaTop(fallbackPx = 24, scale = 1): number {
  const [top, setTop] = useState(fallbackPx);

  useEffect(() => {
    const tg = getTelegramWebApp();
    if (!tg) return;

    function update() {
      const contentTop = tg?.contentSafeAreaInset?.top ?? 0;
      const deviceTop = tg?.safeAreaInset?.top ?? 0;
      const total = (contentTop + deviceTop) * scale;
      setTop(total > 0 ? total : fallbackPx);
    }

    update();
    tg.onEvent?.("contentSafeAreaChanged", update);
    tg.onEvent?.("safeAreaChanged", update);
    return () => {
      tg.offEvent?.("contentSafeAreaChanged", update);
      tg.offEvent?.("safeAreaChanged", update);
    };
    // fallbackPx is a constant per call site, not expected to change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return top;
}
