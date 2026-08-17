"use client";

import { useState } from "react";
import HelloVariant3 from "@/components/hello/HelloVariant3";
import IridescentButton from "@/components/IridescentButton";

export default function Home() {
  const [introDone, setIntroDone] = useState(false);

  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      {!introDone && <HelloVariant3 onDone={() => setIntroDone(true)} />}
      <IridescentButton />
    </div>
  );
}
