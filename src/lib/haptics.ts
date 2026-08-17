// Telegram Mini Apps expose a native haptics bridge on window.Telegram.WebApp
// — real taps on iOS/Android, not a vibration hack. Outside Telegram (e.g.
// reviewing this in a normal mobile browser) we fall back to the Vibration
// API where it exists, so the feel is still testable. Both are best-effort:
// neither is guaranteed present, so every call is a safe no-op otherwise.
type ImpactStyle = "light" | "medium" | "heavy" | "rigid" | "soft";

type SafeAreaInset = { top: number; bottom: number; left: number; right: number };

type TelegramWebApp = {
  ready?: () => void;
  expand?: () => void;
  // Bot API 8.0+ — true edge-to-edge fullscreen (extends behind the system
  // status bar/notch), distinct from expand() which only maximizes the
  // webview within Telegram's own chrome. Undefined on older clients.
  requestFullscreen?: () => void;
  // Bot API 7.7+ — by default, a downward swipe starting on the app's own
  // content is Telegram's gesture for minimizing/closing the Mini App.
  // This turns that off so swiping around inside the app (e.g. the
  // press-and-hold gesture) can't accidentally collapse it.
  disableVerticalSwipes?: () => void;
  // Bot API 8.0+ — the device's own safe area (notch/status bar), and
  // separately, the area additionally obstructed by Telegram's own
  // floating controls (close/more buttons) in fullscreen mode. The two
  // are additive: content needs to clear both.
  safeAreaInset?: SafeAreaInset;
  contentSafeAreaInset?: SafeAreaInset;
  onEvent?: (event: string, handler: () => void) => void;
  offEvent?: (event: string, handler: () => void) => void;
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

export function getTelegramWebApp(): TelegramWebApp | undefined {
  if (typeof window === "undefined") return undefined;
  return window.Telegram?.WebApp;
}

/** Call once on mount: tells Telegram the app is ready (drops its loading
 * spinner), expands the webview to full height, requests true edge-to-edge
 * fullscreen, and disables the swipe-down-to-close gesture so scrolling or
 * dragging inside the app can't accidentally minimize it. No-op outside
 * Telegram; each individual call no-ops on older clients missing that
 * particular method. */
export function initTelegramWebApp() {
  const tg = getTelegramWebApp();
  tg?.ready?.();
  tg?.expand?.();
  tg?.requestFullscreen?.();
  tg?.disableVerticalSwipes?.();
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
  const tg = getTelegramWebApp();
  if (tg?.HapticFeedback) {
    tg.HapticFeedback.impactOccurred(style);
    return;
  }
  navigator.vibrate?.(VIBRATE_MS[style]);
}

/** The final "arrived" beat — use once, at the end of a sequence. */
export function hapticSuccess() {
  const tg = getTelegramWebApp();
  if (tg?.HapticFeedback) {
    tg.HapticFeedback.notificationOccurred("success");
    return;
  }
  navigator.vibrate?.([12, 40, 12]);
}

/** Picker/tab-style feedback — use for switching between options (nav tabs,
 * segmented controls), distinct from an impact tick. */
export function hapticSelect() {
  const tg = getTelegramWebApp();
  if (tg?.HapticFeedback) {
    tg.HapticFeedback.selectionChanged();
    return;
  }
  navigator.vibrate?.(6);
}
