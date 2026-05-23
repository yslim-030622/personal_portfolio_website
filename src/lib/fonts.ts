import {Fraunces, Geist} from "next/font/google";
import localFont from "next/font/local";

export const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  axes: ["SOFT", "WONK", "opsz"],
  display: "optional",
  preload: false
});

export const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "optional",
  preload: false
});

export const notoSerifKr = localFont({
  src: "../app/fonts/NotoSerifKRPortfolio.woff2",
  variable: "--font-noto-serif-kr",
  weight: "500",
  style: "normal",
  display: "optional",
  preload: false
});

export const pretendard = localFont({
  src: "../app/fonts/PretendardPortfolio.woff2",
  variable: "--font-pretendard",
  weight: "45 920",
  style: "normal",
  display: "optional",
  preload: false
});

const englishFontVariables = [
  fraunces.variable,
  geist.variable
].join(" ");

const koreanFontVariables = [
  notoSerifKr.variable,
  pretendard.variable
].join(" ");

export function fontVariablesForLocale(locale: "en" | "ko") {
  return locale === "ko" ? koreanFontVariables : englishFontVariables;
}
