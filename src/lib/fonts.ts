import {Cormorant_Garamond, Fraunces, Geist, Instrument_Serif, Nanum_Myeongjo, Plus_Jakarta_Sans} from "next/font/google";
import localFont from "next/font/local";

export const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
  preload: true
});

export const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-cormorant-garamond",
  display: "optional",
  preload: true
});

export const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  axes: ["SOFT", "WONK", "opsz"],
  display: "optional",
  preload: true
});

export const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "optional",
  preload: true
});

export const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plus-jakarta-sans",
  display: "swap",
  preload: true
});

export const pretendard = localFont({
  src: "../app/fonts/PretendardVariable.woff2",
  variable: "--font-pretendard",
  weight: "45 920",
  style: "normal",
  display: "optional",
  preload: true
});

export const notoSerifKR = localFont({
  src: "../app/fonts/NotoSerifKRPortfolio.woff2",
  variable: "--font-noto-serif-kr",
  weight: "400 900",
  style: "normal",
  display: "swap",
  preload: true
});

export const nanumMyeongjo = Nanum_Myeongjo({
  subsets: ["latin"],
  weight: ["400", "700", "800"],
  variable: "--font-nanum-myeongjo",
  display: "swap",
  preload: false,
});

const englishFontVariables = [
  instrumentSerif.variable,
  cormorantGaramond.variable,
  fraunces.variable,
  geist.variable,
  plusJakartaSans.variable,
].join(" ");

const koreanFontVariables = [pretendard.variable, notoSerifKR.variable, nanumMyeongjo.variable].join(" ");

export function fontVariablesForLocale(locale: "en" | "ko") {
  return locale === "ko" ? koreanFontVariables : englishFontVariables;
}
