import { ChevronRightIcon, HeartIcon, MoonIcon, ThermometerIcon, PulseIcon, DropletIcon } from "./icons";

const METRICS = [HeartIcon, MoonIcon, ThermometerIcon, PulseIcon, DropletIcon];

export default function WellbeingCard() {
  return (
    <button
      type="button"
      className="flex flex-col rounded-[22px] bg-white p-4 text-left shadow-[0_2px_14px_rgba(20,20,25,0.05)]"
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-[15px] font-semibold leading-snug text-[#15161a]">
          Start your wellbeing journey
        </p>
        <ChevronRightIcon className="mt-0.5 h-[16px] w-[16px] shrink-0 text-[#c9c8c4]" />
      </div>

      <div className="mt-4 flex items-center gap-2.5">
        {METRICS.map((Icon, i) => (
          <Icon key={i} className="h-4 w-4 text-[#c9c8c4]" />
        ))}
      </div>
      <div className="mt-2.5 flex gap-1.5">
        {METRICS.map((_, i) => (
          <span key={i} className="h-6 flex-1 rounded-md bg-[#f0efec]" />
        ))}
      </div>
    </button>
  );
}
