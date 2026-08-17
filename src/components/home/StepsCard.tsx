import { ChevronRightIcon } from "./icons";

export default function StepsCard() {
  return (
    <button
      type="button"
      className="flex flex-col rounded-[22px] bg-white p-4 text-left shadow-[0_2px_14px_rgba(20,20,25,0.05)]"
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-[15px] font-semibold text-[#15161a]">Steps</p>
        <ChevronRightIcon className="mt-0.5 h-[16px] w-[16px] shrink-0 text-[#c9c8c4]" />
      </div>

      <div className="mt-3 flex items-baseline gap-4">
        <span>
          <span className="block text-[18px] font-bold leading-none text-[#15161a]">2,390</span>
          <span className="mt-1 block text-[11px] text-[#a3a29e]">Steps</span>
        </span>
        <span>
          <span className="block text-[18px] font-bold leading-none text-[#15161a]">0.3</span>
          <span className="mt-1 block text-[11px] text-[#a3a29e]">Km</span>
        </span>
      </div>

      <div className="relative mt-6 h-[52px] w-full">
        <span className="absolute left-[52%] -top-6 -translate-x-1/2 whitespace-nowrap rounded bg-[#15161a] px-1.5 py-0.5 text-[10px] font-medium text-white">
          390
        </span>
        <svg viewBox="0 0 140 52" className="h-full w-full" preserveAspectRatio="none">
          <path
            d="M2 40 C 14 38, 22 30, 30 32 S 46 40, 54 22 S 66 6, 74 10 S 90 26, 98 30 S 114 34, 122 30 S 134 22, 138 24"
            fill="none"
            stroke="#d8d7d3"
            strokeWidth="1.6"
          />
        </svg>
        <span className="absolute left-[52%] top-0 h-full w-px bg-[#e4e3df]" />
      </div>
    </button>
  );
}
