// Telegram Mini Apps expose a native haptics bridge on window.Telegram.WebApp
// — real taps on iOS/Android, not a vibration hack. Outside Telegram (e.g.
// reviewing this in a normal mobile browser) we fall back to the Vibration
// API where it exists, so the feel is still testable. Both are best-effort:
// neither is guaranteed present, so every call is a safe no-op otherwise.
type ImpactStyle = "light" | "medium" | "heavy" | "rigid" | "soft";

type TelegramWebApp = {
  ready?: () => void;
  expand?: () => void;
  HapticFeedback?: {
    impactOccurred: (style: ImpactStyle) => void;
    notificationOccurred: (type: "error" | "success" | "warning") => void;
    selectionChanged: () => void;
  };
};

declare global {
  interface Window {
    Telegram?: { WebApp?: TelegramWebApp };
  }
}

function webApp(): TelegramWebApp | undefined {
  if (typeof window === "undefined") return undefined;
  return window.Telegram?.WebApp;
}

/** Call once on mount: tells Telegram the app is ready (drops its loading
 * spinner) and expands the webview to full height. No-op outside Telegram. */
export function initTelegramWebApp() {
  const tg = webApp();
  tg?.ready?.();
  tg?.expand?.();
}

const VIBRATE_MS: Record<ImpactStyle, number> = {
  soft: 6,
  light: 8,
  medium: 15,
  rigid: 15,
  heavy: 25,
};

/** A short tap — use for per-step beats in a sequence (each word landing). */
export function hapticTick(style: ImpactStyle = "light") {
  const tg = webApp();
  if (tg?.HapticFeedback) {
    tg.HapticFeedback.impactOccurred(style);
    return;
  }
  navigator.vibrate?.(VIBRATE_MS[style]);
}

/** The final "arrived" beat — use once, at the end of a sequence. */
export function hapticSuccess() {
  const tg = webApp();
  if (tg?.HapticFeedback) {
    tg.HapticFeedback.notificationOccurred("success");
    return;
  }
  navigator.vibrate?.([12, 40, 12]);
}
