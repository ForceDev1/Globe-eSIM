import type { RefObject } from "react";
import { PlusIcon, SimCardIcon } from "./icons";

type AddEsimSectionProps = {
  /** Real target for the spotlight tour's first step — must be a genuine
   * interactive element, not a placeholder, so the tour has something
   * authentic to point at. */
  buttonRef: RefObject<HTMLButtonElement | null>;
  onAdd: () => void;
};

/** Minimal "Your eSIMs" section: an empty state plus the one real action
 * (Add eSIM) the post-intro tour walks through. */
export default function AddEsimSection({ buttonRef, onAdd }: AddEsimSectionProps) {
  return (
    <>
      <h2 className="mt-6 text-[20px] font-bold text-[#15161a]">Your eSIMs</h2>
      <div className="mt-3.5 rounded-[22px] bg-white p-5 shadow-[0_2px_14px_rgba(20,20,25,0.05)]">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#f1efec] text-[#15161a]">
            <SimCardIcon className="h-5 w-5" />
          </span>
          <div className="leading-tight">
            <p className="text-[15px] font-semibold text-[#15161a]">No eSIMs yet</p>
            <p className="mt-0.5 text-[13px] text-[#9a9994]">Get connected the moment you land</p>
          </div>
        </div>

        <button
          ref={buttonRef}
          type="button"
          onClick={onAdd}
          className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-full bg-[#15161a] py-3.5 text-[14px] font-semibold text-white"
        >
          <PlusIcon className="h-4 w-4" />
          Add eSIM
        </button>
      </div>
    </>
  );
}
