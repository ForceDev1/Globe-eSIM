"use client";

import { useState } from "react";
import HelloVariant3 from "@/components/hello/HelloVariant3";
import AppShell from "@/components/home/AppShell";

export default function Home() {
  const [introDone, setIntroDone] = useState(false);

  if (!introDone) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <HelloVariant3 onDone={() => setIntroDone(true)} />
      </div>
    );
  }

  return <AppShell />;
}
