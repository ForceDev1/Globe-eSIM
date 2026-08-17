import { ChevronRightIcon, ProfileNavIcon, BellIcon, ShieldIcon, HelpCircleIcon, LogoutIcon } from "./icons";

const MENU = [
  { label: "Personal Details", Icon: ProfileNavIcon },
  { label: "Notifications", Icon: BellIcon },
  { label: "Privacy & Security", Icon: ShieldIcon },
  { label: "Help & Support", Icon: HelpCircleIcon },
] as const;

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-1 flex-col items-center rounded-[22px] bg-white py-4 shadow-[0_2px_14px_rgba(20,20,25,0.05)]">
      <span className="text-[19px] font-bold text-[#15161a]">{value}</span>
      <span className="mt-0.5 text-[12px] text-[#a3a29e]">{label}</span>
    </div>
  );
}

function MenuRow({
  Icon,
  label,
  last,
  danger,
}: {
  Icon: typeof ProfileNavIcon;
  label: string;
  last?: boolean;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      className={`flex w-full items-center gap-3 px-4 py-3.5 text-left ${last ? "" : "border-b border-[#f0efec]"}`}
    >
      <span
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
        style={{ background: danger ? "#fbeceb" : "#f1efec", color: danger ? "#c14a3c" : "#15161a" }}
      >
        <Icon className="h-[17px] w-[17px]" />
      </span>
      <span className="flex-1 text-[14px] font-medium" style={{ color: danger ? "#c14a3c" : "#15161a" }}>
        {label}
      </span>
      {!danger && <ChevronRightIcon className="h-[16px] w-[16px] shrink-0 text-[#c9c8c4]" />}
    </button>
  );
}

export default function ProfileScreen() {
  return (
    <>
      <div className="flex flex-col items-center pt-2 text-center">
        <span className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-[#dcdad6]">
          <svg viewBox="0 0 24 24" fill="none" className="h-12 w-12 text-[#8b8985]">
            <circle cx="12" cy="9" r="3.4" fill="currentColor" />
            <path d="M4.5 20c1-3.6 4-5.6 7.5-5.6s6.5 2 7.5 5.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none" />
          </svg>
        </span>
        <p className="mt-3 text-[19px] font-bold text-[#15161a]">Hadi</p>
        <p className="text-[13px] text-[#a3a29e]">Member since 2024</p>
      </div>

      <div className="mt-6 flex gap-3">
        <StatCard value="12" label="Activities" />
        <StatCard value="5" label="Day streak" />
        <StatCard value="2,390" label="Steps today" />
      </div>

      <h2 className="mt-7 text-[20px] font-bold text-[#15161a]">Settings</h2>
      <div className="mt-3.5 overflow-hidden rounded-[22px] bg-white shadow-[0_2px_14px_rgba(20,20,25,0.05)]">
        {MENU.map(({ label, Icon }) => (
          <MenuRow key={label} label={label} Icon={Icon} />
        ))}
        <MenuRow label="Log Out" Icon={LogoutIcon} danger last />
      </div>
    </>
  );
}
