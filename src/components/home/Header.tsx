import { BellIcon } from "./icons";

export default function Header() {
  return (
    <header className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-[#dcdad6]">
          <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7 text-[#8b8985]">
            <circle cx="12" cy="9" r="3.4" fill="currentColor" />
            <path d="M4.5 20c1-3.6 4-5.6 7.5-5.6s6.5 2 7.5 5.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none" />
          </svg>
        </span>
        <div className="leading-tight">
          <p className="text-[13px] text-[#9a9994]">Welcome back</p>
          <p className="text-[19px] font-semibold text-[#15161a]">Hadi</p>
        </div>
      </div>

      <button
        type="button"
        aria-label="Notifications"
        className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#15161a] shadow-[0_2px_10px_rgba(20,20,25,0.08)]"
      >
        <BellIcon className="h-[19px] w-[19px]" />
      </button>
    </header>
  );
}
