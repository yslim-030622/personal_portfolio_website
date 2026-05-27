import Image from "next/image";
import type {CSSProperties} from "react";

import type {LocalizedPortfolioContent} from "@/content";
import {HeroLinks} from "@/components/hero-links";
import {WaveHand} from "@/components/wave-hand";

type HeroProps = {
  content: LocalizedPortfolioContent["hero"];
};

type Token = {type: "word" | "space"; content: string};

function tokenize(text: string): Token[] {
  return text
    .split(/(\n|\s+)/)
    .filter((s) => s.length > 0)
    .map((s) => ({type: /\s+/.test(s) ? "space" : "word", content: s}));
}

function HeadlineWords({
  before,
  italic,
  after,
  startWordIndex = 0,
}: {
  before: string;
  italic: string;
  after: string;
  startWordIndex?: number;
}) {
  const beforeTokens = tokenize(before);
  const italicTokens = tokenize(italic);
  const afterTokens = tokenize(after);

  const BASE_DELAY = 30;
  const PER_WORD = 38;
  let wordIdx = startWordIndex;

  const renderToken = (token: Token, isItalic: boolean, key: string) => {
    if (token.type === "space") {
      if (token.content.includes("\n")) {
        return <br key={key} />;
      }

      return <span key={key}>{token.content}</span>;
    }
    const delay = BASE_DELAY + wordIdx++ * PER_WORD;
    const isWaveEmoji = token.content === "👋";

    if (isWaveEmoji) {
      return (
        <WaveHand key={key} slideDelay={delay} waveDelay={delay + 600} />
      );
    }

    const inner = isItalic ? (
      <em className="hero-name-accent font-display not-italic">{token.content}</em>
    ) : (
      token.content
    );

    const clipStyle: CSSProperties = {
      display: "inline-block",
      overflow: "hidden",
      verticalAlign: "bottom",
      paddingBottom: "0.22em",
      marginBottom: "-0.22em",
      paddingTop: "0.1em",
      marginTop: "-0.1em",
      ...(isItalic && {
        paddingLeft: "0.14em",
        marginLeft: "-0.14em",
        paddingRight: "0.14em",
        marginRight: "-0.14em",
      }),
    };

    return (
      <span key={key} style={clipStyle}>
        <span className="word-slide" style={{animationDelay: `${delay}ms`}}>
          {inner}
        </span>
      </span>
    );
  };

  return (
    <>
      {beforeTokens.map((t, i) => renderToken(t, false, `b${i}`))}
      {italicTokens.map((t, i) => renderToken(t, true, `e${i}`))}
      {afterTokens.map((t, i) => renderToken(t, false, `a${i}`))}
    </>
  );
}

export function Hero({content}: HeroProps) {
  return (
    <section
      className="mx-auto grid w-full max-w-[1480px] content-start items-start overflow-hidden overflow-x-hidden px-6 pb-0 pt-10 md:min-h-[100svh] md:grid-cols-[minmax(0,50vw)_minmax(0,50vw)] md:content-start md:items-start md:px-10 md:pb-10 md:pt-12 lg:pt-14 xl:px-14"
    >
      <div className="relative z-10 min-w-0 max-w-[540px] md:max-w-none md:pr-8 xl:pr-12">
        <h1
          className="hero-headline mt-3 max-w-[17ch] font-display text-[clamp(3.1rem,6vw,5.65rem)] font-medium leading-[1.02] tracking-normal text-fg md:mt-4 md:max-w-[18ch] md:leading-[0.98] lg:max-w-[18.5ch]"
        >
          <span className="block text-left">
            <HeadlineWords
              before={content.headline.before.replace(/\n/g, "")}
              italic=""
              after=""
            />
          </span>
          <span className="block text-right md:text-left">
            <HeadlineWords
              before=""
              italic={content.headline.italic}
              after={content.headline.after}
              startWordIndex={content.headline.before.split(/\s+/).filter(Boolean).length}
            />
          </span>
        </h1>

        <p
          className="hero-reveal hero-subline mt-6 hidden max-w-[42ch] font-display text-[1.34rem] font-normal leading-[1.58] text-fg/88 [hyphens:none] [overflow-wrap:break-word] md:mt-8 md:block xl:max-w-[44ch] xl:text-[1.42rem]"
          style={{animationDelay: "120ms"}}
        >
          {content.subline}
        </p>

        <div
          className="hero-reveal mt-6 hidden md:flex"
          style={{animationDelay: "280ms"}}
        >
          <HeroLinks links={content.links} />
        </div>

      </div>

      <div className="hero-photo-reveal mt-5 max-w-[540px] md:hidden" style={{animationDelay: "60ms"}}>
        <figure className="hero-photo hero-photo-mobile overflow-hidden rounded-[6px]">
          <div className="hero-photo-frame relative h-[48vh] min-h-[260px] w-full overflow-hidden">
            <Image
              alt={content.image.alt}
              className="hero-photo-image object-cover object-[56%_28%]"
              decoding="async"
              fill
              priority
              sizes="92vw"
              src={content.image.src}
            />
          </div>
        </figure>
        <p
          className="hero-subline mt-5 font-display text-[1.16rem] font-normal leading-[1.62] text-fg/88 [hyphens:none] [overflow-wrap:break-word]"
        >
          {content.subline}
        </p>
        <div className="px-1 py-5">
          <HeroLinks links={content.links} />
        </div>
      </div>

      <figure
        className="hero-photo-reveal hero-photo hero-photo-desktop pointer-events-none relative hidden h-[min(78svh,820px)] min-h-[620px] w-full md:mt-5 md:block"
        style={{animationDelay: "80ms"}}
      >
        <div className="hero-photo-frame relative h-full w-full overflow-hidden">
            <Image
              alt={content.image.alt}
              className="hero-photo-image object-cover object-[56%_58%]"
              decoding="async"
              fill
              priority
              sizes="(min-width: 1280px) 41vw, (min-width: 768px) 50vw, 92vw"
              src={content.image.src}
            />
        </div>
      </figure>

    </section>
  );
}
