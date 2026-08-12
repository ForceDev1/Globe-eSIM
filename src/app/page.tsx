import {
  SlidersVertical,
  SquarePlus,
  Grid2x2Plus,
  LayoutGrid,
  TrendingUp,
  MessageCircle,
} from "lucide-react";
import RingBadge from "@/components/RingBadge";
import DotGrid from "@/components/DotGrid";
import CalendarBadgeIcon from "@/components/CalendarBadgeIcon";

function IconButton({ children }: { children: React.ReactNode }) {
  return (
    <button
      type="button"
      className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white/90"
    >
      {children}
    </button>
  );
}

export default function Home() {
  return (
    <div className="flex min-h-screen justify-center bg-black">
      <div className="flex w-full max-w-[420px] flex-col px-5 pt-6">
        {/* Header */}
        <header className="flex items-center justify-between pb-5">
          <h1 className="text-[34px] font-bold tracking-tight text-white">
            Workouts
          </h1>
          <div className="flex items-center gap-2.5">
            <IconButton>
              <SlidersVertical size={18} strokeWidth={2} />
            </IconButton>
            <IconButton>
              <SquarePlus size={19} strokeWidth={2} />
            </IconButton>
          </div>
        </header>

        {/* Top two cards */}
        <div className="grid grid-cols-2 gap-3.5">
          <div className="flex h-[180px] flex-col justify-between rounded-[26px] bg-[var(--card-bg)] p-4">
            <div className="flex items-start justify-between">
              <RingBadge value={1} size={40} progress={1} />
              <SlidersVertical
                size={16}
                strokeWidth={2}
                className="mt-1 text-white/50"
              />
            </div>
            <div>
              <p className="text-[15px] font-semibold text-white">
                Chest + Triceps
              </p>
              <p className="mt-0.5 text-[13px] text-[var(--text-secondary)]">
                Saturday
              </p>
            </div>
          </div>

          <div className="flex h-[180px] flex-col justify-between rounded-[26px] bg-[var(--card-bg)] p-4">
            <div className="flex items-start justify-between">
              <span className="text-[30px] font-bold leading-none text-white">
                200
                <span className="ml-1 text-[15px] font-medium text-[var(--text-secondary)]">
                  lbs
                </span>
              </span>
              <SlidersVertical
                size={16}
                strokeWidth={2}
                className="mt-1 text-white/50"
              />
            </div>
            <div>
              <p className="text-[15px] font-semibold text-white">
                Body Weight
              </p>
              <p className="mt-0.5 text-[13px] text-[var(--text-secondary)]">
                31 min ago
              </p>
            </div>
          </div>
        </div>

        {/* Calendar heatmap card */}
        <div className="mt-3.5 rounded-[26px] bg-[var(--card-bg)] p-5">
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Jan", seed: 11, highlights: [7, 15] },
              { label: "Feb", seed: 27, highlights: [10, 16, 22] },
              { label: "Mar", seed: 42, highlights: [4] },
            ].map((month) => (
              <div key={month.label} className="flex flex-col items-center">
                <p className="mb-3 text-[13px] font-medium text-white/80">
                  {month.label}
                </p>
                <DotGrid seed={month.seed} highlights={month.highlights} />
              </div>
            ))}
          </div>

          <div className="my-4 h-px bg-[var(--hairline)]" />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <RingBadge value={2} size={36} progress={1} />
              <div>
                <p className="text-[15px] font-semibold text-white">
                  Back + Biceps + Legs
                </p>
                <p className="mt-0.5 text-[13px] text-[var(--text-secondary)]">
                  Monday
                </p>
              </div>
            </div>
            <SlidersVertical size={16} strokeWidth={2} className="text-white/50" />
          </div>
        </div>

        {/* Volume lifted row */}
        <div className="mt-3.5 flex items-center justify-between rounded-[26px] bg-[var(--card-bg)] px-5 py-4">
          <div>
            <p className="text-[15px] font-semibold text-white">
              Volume lifted
            </p>
            <p className="mt-0.5 text-[13px] text-[var(--text-secondary)]">
              Last 7 days
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[26px] font-bold leading-none text-white">
              3.200
              <span className="ml-1 text-[14px] font-medium text-[var(--text-secondary)]">
                lbs
              </span>
            </span>
            <SlidersVertical size={16} strokeWidth={2} className="text-white/50" />
          </div>
        </div>

        {/* Quick add button */}
        <button
          type="button"
          className="mt-5 flex h-[68px] w-[68px] items-center justify-center rounded-[22px] bg-[var(--card-bg)] text-white/85"
        >
          <Grid2x2Plus size={26} strokeWidth={1.8} />
        </button>

        {/* Spacer before bottom nav */}
        <div className="flex-1 min-h-10" />

        {/* Bottom nav */}
        <nav className="sticky bottom-0 mb-6 flex items-center justify-between rounded-full bg-[#141416] px-8 py-4">
          <button type="button" className="text-white">
            <LayoutGrid size={22} strokeWidth={2} />
          </button>
          <button type="button" className="text-white/60">
            <CalendarBadgeIcon day={10} className="h-[22px] w-[22px]" />
          </button>
          <button type="button" className="text-white/60">
            <TrendingUp size={22} strokeWidth={2} />
          </button>
          <button type="button" className="relative text-white/60">
            <MessageCircle size={22} strokeWidth={2} />
            <span className="absolute -right-0.5 -top-0.5 h-[7px] w-[7px] rounded-full bg-white" />
          </button>
        </nav>
      </div>
    </div>
  );
}
