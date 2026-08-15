"use client";

import { useEffect } from "react";
import { initTelegramWebApp } from "@/lib/haptics";

/** Mounted once at the root. No-op outside an actual Telegram Mini App. */
export default function TelegramInit() {
  useEffect(() => {
    initTelegramWebApp();
  }, []);
  return null;
}
