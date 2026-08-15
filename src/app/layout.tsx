import type { Metadata, Viewport } from "next";
import { caveat } from "./fonts";
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
  themeColor: "#000000",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`h-full ${caveat.variable}`}>
      <body className="min-h-full bg-black text-white antialiased">
        <TelegramInit />
        {children}
      </body>
    </html>
  );
}
