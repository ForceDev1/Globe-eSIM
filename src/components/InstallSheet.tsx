"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import {
  X,
  Zap,
  Keyboard,
  QrCode as QrCodeIcon,
  Copy,
  Check,
  Loader2,
  CircleCheck,
} from "lucide-react";
import { findCountry, flagEmoji } from "@/data/countries";
import { planFor, type OwnedEsim } from "@/data/esims";

type Method = "quick" | "manual" | "qr";

type InstallSheetProps = {
  open: boolean;
  esim: OwnedEsim | null;
  onClose: () => void;
  onInstalled: (esimId: string) => void;
};

const METHODS: { key: Method; label: string; icon: typeof Zap }[] = [
  { key: "quick", label: "Quick", icon: Zap },
  { key: "manual", label: "Manual", icon: Keyboard },
  { key: "qr", label: "QR Code", icon: QrCodeIcon },
];

function FieldRow({
  label,
  value,
  copied,
  onCopy,
}: {
  label: string;
  value: string;
  copied: boolean;
  onCopy: () => void;
}) {
  return (
    <div
      className="flex items-center justify-between rounded-2xl border px-4 py-3"
      style={{ borderColor: "var(--hairline)" }}
    >
      <div className="min-w-0">
        <p className="text-[11px] text-[var(--ink-soft)]">{label}</p>
        <p className="truncate text-[14px] font-semibold text-[var(--ink)]">{value}</p>
      </div>
      <button
        type="button"
        onClick={onCopy}
        aria-label={`Copy ${label}`}
        className="ml-3 flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
        style={{
          background: copied ? "var(--status-good-soft)" : "#f0f2f7",
          color: copied ? "var(--status-good)" : "var(--ink-soft)",
        }}
      >
        {copied ? <Check size={15} strokeWidth={2.5} /> : <Copy size={15} strokeWidth={2} />}
      </button>
    </div>
  );
}

export default function InstallSheet({ open, esim, onClose, onInstalled }: InstallSheetProps) {
  const [method, setMethod] = useState<Method>("quick");
  const [quickState, setQuickState] = useState<"idle" | "installing" | "done">("idle");
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [qrSvg, setQrSvg] = useState("");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Reset the sheet's local UI whenever it (re)opens for a different eSIM —
  // adjusted during render rather than in an effect, per React's guidance
  // on resetting state from props.
  const openKey = open ? (esim?.id ?? "") : "__closed__";
  const [prevOpenKey, setPrevOpenKey] = useState(openKey);
  if (openKey !== prevOpenKey) {
    setPrevOpenKey(openKey);
    if (open) {
      setMethod("quick");
      setQuickState("idle");
      setCopiedField(null);
    }
  }

  // Generate the LPA activation QR from the (trusted, locally-generated)
  // activation string — a genuine async side effect, not a state-from-props
  // derivation.
  useEffect(() => {
    if (!esim) return;
    const data = `LPA:1$${esim.smdpAddress}$${esim.activationCode}`;
    let cancelled = false;
    QRCode.toString(data, {
      type: "svg",
      margin: 0,
      width: 208,
      color: { dark: "#14161b", light: "#00000000" },
    })
      .then((svg) => {
        if (!cancelled) setQrSvg(svg);
      })
      .catch(() => {
        if (!cancelled) setQrSvg("");
      });
    return () => {
      cancelled = true;
    };
  }, [esim]);

  useEffect(() => {
    const list = timers.current;
    return () => {
      list.forEach(clearTimeout);
    };
  }, []);

  function copyField(field: string, value: string) {
    navigator.clipboard
      ?.writeText(value)
      .then(() => {
        setCopiedField(field);
        timers.current.push(setTimeout(() => setCopiedField(null), 1600));
      })
      .catch(() => {
        // Clipboard blocked (e.g. insecure context) — the value is still
        // visible to copy by hand.
      });
  }

  function startQuickInstall() {
    if (!esim) return;
    setQuickState("installing");
    timers.current.push(
      setTimeout(() => {
        setQuickState("done");
        onInstalled(esim.id);
        timers.current.push(setTimeout(onClose, 900));
      }, 1400),
    );
  }

  function confirmInstalled() {
    if (!esim) return;
    onInstalled(esim.id);
    onClose();
  }

  const country = esim ? findCountry(esim.countryCode) : null;
  const plan = esim ? planFor(esim) : null;
  const activeIndex = METHODS.findIndex((m) => m.key === method);

  return (
    <div
      aria-hidden={!open}
      className={`fixed inset-0 z-50 flex items-end justify-center transition-opacity duration-200 ${
        open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-black/45"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Install eSIM"
        className={`relative flex w-full max-w-[420px] flex-col rounded-t-[28px] bg-[var(--card-bg)] pt-3 transition-transform duration-300 ease-out ${
          open ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ maxHeight: "88vh" }}
      >
        <div className="mx-auto h-1 w-9 shrink-0 rounded-full bg-black/10" />

        <div className="flex items-center justify-between px-5 pt-4">
          <div>
            <h2 className="text-[19px] font-semibold text-[var(--ink)]">Install eSIM</h2>
            {esim && (
              <p className="mt-0.5 flex items-center gap-1.5 text-[13px] text-[var(--ink-soft)]">
                {country ? flagEmoji(country.code) : "🌐"} {country?.name ?? "Global+"} ·{" "}
                {plan?.dataGb}GB
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f0f2f7] text-[var(--ink)]"
          >
            <X size={16} strokeWidth={2} />
          </button>
        </div>

        <div className="px-5 pt-4">
          <div className="relative grid grid-cols-3 rounded-2xl bg-[#f0f2f7] p-1">
            <span
              aria-hidden
              className="absolute inset-y-1 rounded-xl bg-white shadow-sm transition-transform duration-200 ease-out"
              style={{ width: "calc(100% / 3)", transform: `translateX(${activeIndex * 100}%)` }}
            />
            {METHODS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => setMethod(key)}
                aria-pressed={method === key}
                className="relative z-10 flex flex-col items-center gap-1 rounded-xl py-2.5 text-[12px] font-semibold"
                style={{ color: method === key ? "var(--ink)" : "var(--ink-soft)" }}
              >
                <Icon size={16} strokeWidth={2} />
                {label}
              </button>
            ))}
          </div>
        </div>

        {esim && (
          <div className="min-h-0 flex-1 overflow-y-auto px-5">
            {method === "quick" && (
              <div className="flex flex-col items-center px-1 py-6 text-center">
                <span
                  className="flex h-14 w-14 items-center justify-center rounded-full"
                  style={{ background: "var(--accent-soft)" }}
                >
                  <Zap size={24} strokeWidth={2} style={{ color: "var(--accent)" }} />
                </span>
                <p className="mt-4 text-[16px] font-bold text-[var(--ink)]">Quick install</p>
                <p className="mt-1.5 text-[13px] text-[var(--ink-soft)]">
                  On supported iPhone and Android devices your eSIM installs automatically in a
                  few seconds — no codes to type.
                </p>
                <button
                  type="button"
                  onClick={startQuickInstall}
                  disabled={quickState !== "idle"}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-[15px] font-semibold text-white disabled:opacity-80"
                  style={{
                    background: quickState === "done" ? "var(--status-good)" : "var(--dark)",
                  }}
                >
                  {quickState === "idle" && "Install now"}
                  {quickState === "installing" && (
                    <>
                      <Loader2 size={17} strokeWidth={2} className="animate-spin" />
                      Installing…
                    </>
                  )}
                  {quickState === "done" && (
                    <>
                      <CircleCheck size={17} strokeWidth={2} />
                      Installed
                    </>
                  )}
                </button>
              </div>
            )}

            {method === "manual" && (
              <div className="py-6">
                <div className="flex flex-col gap-3">
                  <FieldRow
                    label="SM-DP+ Address"
                    value={esim.smdpAddress}
                    copied={copiedField === "smdp"}
                    onCopy={() => copyField("smdp", esim.smdpAddress)}
                  />
                  <FieldRow
                    label="Activation Code"
                    value={esim.activationCode}
                    copied={copiedField === "code"}
                    onCopy={() => copyField("code", esim.activationCode)}
                  />
                </div>
                <ol className="mt-4 flex flex-col gap-1.5 text-[13px] text-[var(--ink-soft)]">
                  <li>1. Open Settings → Cellular → Add eSIM</li>
                  <li>2. Choose &ldquo;Enter Details Manually&rdquo;</li>
                  <li>3. Paste the address and code above</li>
                </ol>
                <button
                  type="button"
                  onClick={confirmInstalled}
                  className="mt-5 w-full rounded-2xl py-4 text-[15px] font-semibold text-white"
                  style={{ background: "var(--dark)" }}
                >
                  I&rsquo;ve installed it
                </button>
              </div>
            )}

            {method === "qr" && (
              <div className="flex flex-col items-center px-1 py-6 text-center">
                <div
                  className="flex h-[236px] w-[236px] items-center justify-center rounded-2xl border"
                  style={{ borderColor: "var(--hairline)" }}
                >
                  {qrSvg ? (
                    <div
                      className="h-[208px] w-[208px] [&>svg]:h-full [&>svg]:w-full"
                      dangerouslySetInnerHTML={{ __html: qrSvg }}
                    />
                  ) : (
                    <Loader2 size={22} strokeWidth={2} className="animate-spin text-[var(--ink-soft)]" />
                  )}
                </div>
                <p className="mt-4 text-[13px] text-[var(--ink-soft)]">
                  Scan with your camera in Settings → Cellular → Add eSIM
                </p>
                <button
                  type="button"
                  onClick={confirmInstalled}
                  className="mt-5 w-full rounded-2xl py-4 text-[15px] font-semibold text-white"
                  style={{ background: "var(--dark)" }}
                >
                  I&rsquo;ve scanned it
                </button>
              </div>
            )}
          </div>
        )}

        <div style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))" }} />
      </div>
    </div>
  );
}
