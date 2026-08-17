import Header from "./Header";
import PremiumBanner from "./PremiumBanner";
import WellbeingCard from "./WellbeingCard";
import StepsCard from "./StepsCard";
import OverallProgressCard from "./OverallProgressCard";
import PastActivities from "./PastActivities";
import BottomNav from "./BottomNav";

export default function HomeScreen() {
  return (
    <div className="min-h-screen w-full bg-[#efeeec]">
      <div className="mx-auto flex w-full max-w-[420px] flex-col px-5 pb-32" style={{ paddingTop: "max(20px, env(safe-area-inset-top))" }}>
        <Header />
        <PremiumBanner />

        <h2 className="mt-6 text-[20px] font-bold text-[#15161a]">Wellness</h2>
        <div className="mt-3.5 grid grid-cols-2 gap-3">
          <WellbeingCard />
          <StepsCard />
        </div>

        <OverallProgressCard />
        <PastActivities />
      </div>
      <BottomNav />
    </div>
  );
}
