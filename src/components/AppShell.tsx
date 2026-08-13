"use client";

import { useState } from "react";
import LaunchIntro from "@/components/LaunchIntro";
import EsimHome from "@/components/EsimHome";

export default function AppShell() {
  const [introDone, setIntroDone] = useState(false);

  return (
    <>
      <EsimHome />
      {!introDone && <LaunchIntro onDone={() => setIntroDone(true)} />}
    </>
  );
}
