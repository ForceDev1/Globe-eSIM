"use client";

import { Plus, Globe as GlobeIcon, ChevronRight } from "lucide-react";
import { flagEmoji, findCountry } from "@/data/countries";
import { planFor, type OwnedEsim, type EsimStatus } from "@/data/esims";

type MyEsimsViewProps = {
  esims: OwnedEsim[];
  onInstall: (esim: OwnedEsim) => void;
  onViewUsage: (esim: OwnedEsim) => void;
  onAddNew: () => void;
};

const STATUS_COPY: Record<EsimStatus, string> = {
  pending: "Not installed",
  active: "Active",
  expiring: "Expiring soon",
  expired: "Expired",
};

const STATUS_TOKENS: Record<EsimStatus, { fg: string; bg: string }> = {
  pending: { fg: "var(--accent)", bg: "var(--accent-soft)" },
  active: { fg: "var(--status-good)", bg: "var(--status-good-soft)" },
  expiring: { fg: "var(--status-warn)", bg: "var(--status-warn-soft)" },
  expired: { fg: "var(--status-muted)", bg: "var(--status-muted-soft)" },
};

function StatusPill({ status }: { status: EsimStatus }) {
  const tokens = STATUS_TOKENS[status];
  return (
    <span
      className="shrink-0 rounded-full px-3 py-1 text-[11px] font-semibold"
      style={{ color: tokens.fg, background: tokens.bg }}
    >
      {STATUS_COPY[status]}
    </span>
  );
}

function EsimCard({
  esim,
  onInstall,
  onViewUsage,
}: {
  esim: OwnedEsim;
  onInstall: (esim: OwnedEsim) => void;
  onViewUsage: (esim: OwnedEsim) => void;
}) {
  const country = findCountry(esim.countryCode);
  const plan = planFor(esim);
  const pct = Math.min(100, Math.round((esim.dataUsedGb / plan.dataGb) * 100));
  const barColor = STATUS_TOKENS[esim.status].fg;
  const canViewUsage = esim.status !== "pending";

  return (
    <div
      className="rounded-[24px] p-4"
      style={{ background: "var(--surface)", boxShadow: "var(--shadow-card)" }}
    >
      <button
        type="button"
        onClick={() => canViewUsage && onViewUsage(esim)}
        disabled={!canViewUsage}
        className="flex w-full items-center justify-between gap-3 text-left"
      >
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[22px]" style={{ background: "var(--surface-2)" }}>
            {country ? flagEmoji(country.code) : <GlobeIcon size={20} strokeWidth={2} className="text-[var(--ink)]" />}
          </span>
          <div className="min-w-0">
            <p className="truncate text-[15px] font-semibold text-[var(--ink)]">
              {country?.name ?? "Global+"}
            </p>
            <p className="text-[12px] text-[var(--ink-soft)]">
              {plan.dataGb}GB · {plan.days} days
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <StatusPill status={esim.status} />
          {canViewUsage && <ChevronRight size={16} strokeWidth={2} className="text-[var(--ink-faint)]" />}
        </div>
      </button>

      {esim.status === "pending" ? (
        <p className="mt-3.5 text-[12px] text-[var(--ink-soft)]">
          Ready to activate — tap Install to set it up on this device.
        </p>
      ) : (
        <div className="mt-3.5">
          <div className="h-1.5 overflow-hidden rounded-full" style={{ background: "var(--surface-2)" }}>
            <div
              className="h-full rounded-full"
              style={{ width: `${pct}%`, background: barColor }}
            />
          </div>
          <p className="mt-1.5 text-[12px] text-[var(--ink-soft)]">
            {esim.dataUsedGb.toFixed(1)}GB of {plan.dataGb}GB used
          </p>
        </div>
      )}

      <div className="mt-3.5 flex items-center justify-between">
        <span className="text-[12px] text-[var(--ink-soft)]">{esim.expiresLabel}</span>
        <button
          type="button"
          onClick={() => onInstall(esim)}
          className="rounded-full px-4 py-2 text-[13px] font-semibold text-[var(--ink)]"
          style={{ background: "var(--dark)" }}
        >
          Install
        </button>
      </div>
    </div>
  );
}

export default function MyEsimsView({ esims, onInstall, onViewUsage, onAddNew }: MyEsimsViewProps) {
  return (
    <div className="flex flex-col px-5 pt-6" style={{ paddingTop: "max(24px, calc(env(safe-area-inset-top) + 12px))" }}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[24px] font-bold tracking-tight text-[var(--ink)]">My eSIMs</h1>
          <p className="mt-0.5 text-[13px] text-[var(--ink-soft)]">
            {esims.length} {esims.length === 1 ? "eSIM" : "eSIMs"} on your account
          </p>
        </div>
        <button
          type="button"
          onClick={onAddNew}
          aria-label="Add a new eSIM"
          className="flex h-11 w-11 items-center justify-center rounded-full"
          style={{ background: "var(--surface)", boxShadow: "var(--shadow-card)" }}
        >
          <Plus size={19} strokeWidth={2} className="text-[var(--ink)]" />
        </button>
      </div>

      {esims.length === 0 ? (
        <div
          className="mt-8 flex flex-col items-center gap-3 rounded-[24px] p-8 text-center"
          style={{ background: "var(--surface)", boxShadow: "var(--shadow-card)" }}
        >
          <GlobeIcon size={28} strokeWidth={1.6} className="text-[var(--ink-soft)]" />
          <p className="text-[14px] text-[var(--ink-soft)]">
            No eSIMs yet — buy one for your next trip.
          </p>
          <button
            type="button"
            onClick={onAddNew}
            className="rounded-full px-4 py-2 text-[13px] font-semibold text-[var(--ink)]"
            style={{ background: "var(--dark)" }}
          >
            Browse destinations
          </button>
        </div>
      ) : (
        <div className="mt-4 flex flex-col gap-3.5">
          {esims.map((esim) => (
            <EsimCard key={esim.id} esim={esim} onInstall={onInstall} onViewUsage={onViewUsage} />
          ))}
        </div>
      )}
    </div>
  );
}
