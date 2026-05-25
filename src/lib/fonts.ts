import {Fraunces, Geist, Gowun_Batang, Nanum_Myeongjo} from "next/font/google";
import localFont from "next/font/local";

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

export const notoSerifKr = localFont({
  src: "../app/fonts/NotoSerifKRPortfolio.woff2",
  variable: "--font-noto-serif-kr",
  weight: "500",
  style: "normal",
  display: "optional",
  preload: true
});

export const gowunBatang = Gowun_Batang({
  weight: ["400", "700"],
  variable: "--font-gowun-batang",
  display: "optional",
  preload: false
});

export const nanumMyeongjo = Nanum_Myeongjo({
  weight: ["400", "700", "800"],
  variable: "--font-nanum-myeongjo",
  display: "optional",
  preload: false
});

export const pretendard = localFont({
  src: "../app/fonts/PretendardPortfolio.woff2",
  variable: "--font-pretendard",
  weight: "45 920",
  style: "normal",
  display: "optional",
  preload: true
});

const englishFontVariables = [
  fraunces.variable,
  geist.variable
].join(" ");

const koreanFontVariables = [
  nanumMyeongjo.variable,
  gowunBatang.variable,
  notoSerifKr.variable,
  pretendard.variable
].join(" ");

export function fontVariablesForLocale(locale: "en" | "ko") {
  return locale === "ko" ? koreanFontVariables : englishFontVariables;
}
