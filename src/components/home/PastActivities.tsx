import { ChevronDownIcon, ChevronRightIcon, RunningIcon } from "./icons";

export default function PastActivities() {
  return (
    <div className="mt-7">
      <div className="flex items-center justify-between">
        <p className="text-[19px] font-bold text-[#15161a]">Past Activities</p>
        <ChevronDownIcon className="h-[18px] w-[18px] text-[#15161a]" />
      </div>
      <p className="mt-1 text-[13px] text-[#a3a29e]">1 Activity . Oct 25 – Nov 2</p>

      <button
        type="button"
        className="mt-3 flex w-full items-center gap-3 rounded-[20px] bg-white p-3.5 text-left shadow-[0_2px_14px_rgba(20,20,25,0.05)]"
      >
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#151a2e] text-white">
          <RunningIcon className="h-5 w-5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[15px] font-semibold text-[#15161a]">0.55 mi Running</span>
          <span className="block text-[12px] text-[#a3a29e]">Wednesday, October 29</span>
        </span>
        <ChevronRightIcon className="h-[16px] w-[16px] shrink-0 text-[#c9c8c4]" />
      </button>
    </div>
  );
}
