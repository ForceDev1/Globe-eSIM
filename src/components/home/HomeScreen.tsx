import type { RefObject } from "react";
import Header from "./Header";
import PremiumBanner from "./PremiumBanner";
import AddEsimSection from "./AddEsimSection";
import WellbeingCard from "./WellbeingCard";
import StepsCard from "./StepsCard";
import OverallProgressCard from "./OverallProgressCard";
import PastActivities from "./PastActivities";

type HomeScreenProps = {
  addEsimButtonRef: RefObject<HTMLButtonElement | null>;
  onAddEsim: () => void;
};

/** Home tab content only — layout wrapper, safe-area padding, and the nav
 * bar itself now live in AppShell so every tab shares them. */
export default function HomeScreen({ addEsimButtonRef, onAddEsim }: HomeScreenProps) {
  return (
    <>
      <Header />
      <PremiumBanner />
      <AddEsimSection buttonRef={addEsimButtonRef} onAdd={onAddEsim} />

      <h2 className="mt-6 text-[20px] font-bold text-[#15161a]">Wellness</h2>
      <div className="mt-3.5 grid grid-cols-2 gap-3">
        <WellbeingCard />
        <StepsCard />
      </div>

      <OverallProgressCard />
      <PastActivities />
    </>
  );
}
