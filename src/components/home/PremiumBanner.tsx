import { ChevronRightIcon } from "./icons";

export default function PremiumBanner() {
  return (
    <button
      type="button"
      className="relative mt-5 flex w-full items-center justify-between overflow-hidden rounded-[22px] px-5 py-4 text-left"
      style={{
        background: "radial-gradient(120% 160% at 15% 0%, #23271d 0%, #0a0b08 55%, #050504 100%)",
      }}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.9) 0.6px, transparent 0.6px)",
          backgroundSize: "9px 9px",
        }}
      />
      <span className="relative flex items-center gap-3">
        <span className="text-[20px] leading-none">⚡</span>
        <span className="leading-tight">
          <span className="block text-[16px] font-semibold text-white">Go premium</span>
          <span className="block text-[12px] text-white/50">1 week free</span>
        </span>
      </span>
      <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-[#15161a]">
        <ChevronRightIcon className="h-[16px] w-[16px]" />
      </span>
    </button>
  );
}
