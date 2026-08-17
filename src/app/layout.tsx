import type { Metadata, Viewport } from "next";
import Script from "next/script";
import TelegramInit from "@/components/TelegramInit";
import "./globals.css";

export const metadata: Metadata = {
  title: "Globe eSIM",
  description: "Buy and manage travel eSIMs by country",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#efeeec",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full bg-[#efeeec] text-[#15161a] antialiased">
        {/* window.Telegram.WebApp does not exist just because the page is
            opened inside Telegram — the client only wires it up once this
            SDK script has run. beforeInteractive gets it in before our own
            code (TelegramInit, haptics) ever touches window.Telegram. */}
        <Script src="https://telegram.org/js/telegram-web-app.js" strategy="beforeInteractive" />
        <TelegramInit />
        {children}
      </body>
    </html>
  );
}
