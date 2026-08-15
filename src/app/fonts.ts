import { Caveat } from "next/font/google";

// A monoline cursive font — close enough to real handwriting to sell the
// "ink" reveal effect, and legible enough to still read as a greeting.
export const caveat = Caveat({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-caveat",
});
