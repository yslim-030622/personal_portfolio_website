import {getPortfolioContent, type Locale} from "@/content";
import {ImageResponse} from "next/og";

export const ogSize = {
  width: 1200,
  height: 630
};

export function createOgImage(locale: Locale) {
  const content = getPortfolioContent(locale);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0F0E0C",
          color: "#EDE7DD",
          padding: "78px 86px",
          fontFamily: locale === "ko" ? "serif" : "Georgia, serif"
        }}
      >
        <div
          style={{
            fontFamily: "monospace",
            fontSize: 24,
            letterSpacing: 0,
            color: "#8A847B"
          }}
        >
          {content.hero.eyebrow}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 28
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              maxWidth: 920,
              fontSize: locale === "ko" ? 76 : 82,
              lineHeight: 0.98,
              fontWeight: 500,
              letterSpacing: 0
            }}
          >
            {content.hero.headline.before}
            <span style={{color: "#FB923C", fontStyle: "italic"}}>
              {content.hero.headline.italic}
            </span>
            {content.hero.headline.after}
          </div>
          <div
            style={{
              width: 180,
              height: 2,
              background: "#FB923C"
            }}
          />
        </div>
        <div
          style={{
            fontFamily: "monospace",
            fontSize: 24,
            color: "#8A847B"
          }}
        >
          {content.seo.person.email}
        </div>
      </div>
    ),
    ogSize
  );
}
