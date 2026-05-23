import Image from "next/image";
import type {CSSProperties} from "react";

import type {LocalizedPortfolioContent} from "@/content";
import {HeroLinks} from "@/components/hero-links";

type HeroProps = {
  content: LocalizedPortfolioContent["hero"];
};

type Token = {type: "word" | "space"; content: string};

function tokenize(text: string): Token[] {
  return text
    .split(/(\s+)/)
    .filter((s) => s.length > 0)
    .map((s) => ({type: /\s+/.test(s) ? "space" : "word", content: s}));
}

function countWords(text: string): number {
  return tokenize(text).filter((t) => t.type === "word").length;
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

  const BASE_DELAY = 60;
  const PER_WORD = 58;
  let wordIdx = startWordIndex;

  const renderToken = (token: Token, isItalic: boolean, key: string) => {
    if (token.type === "space") {
      return <span key={key}>{token.content}</span>;
    }
    const delay = BASE_DELAY + wordIdx++ * PER_WORD;
    const inner = isItalic ? (
      <em className="font-display italic">{token.content}</em>
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
  const nameWordCount = countWords(content.headline.name);

  return (
    <section
      className="mx-auto grid w-full max-w-[1480px] items-start overflow-hidden px-6 pb-8 pt-20 md:min-h-[70svh] md:grid-cols-[minmax(0,50vw)_minmax(0,50vw)] md:px-10 md:pb-8 md:pt-28 xl:px-14"
    >
      <div className="relative z-10 min-w-0 md:pr-8 xl:pr-12">
        <div className="hero-reveal" style={{animationDelay: "40ms"}}>
          <p className="hero-name-glow hero-headline font-display text-[clamp(2.65rem,4.7vw,4.05rem)] font-medium leading-[1.02] tracking-normal text-white md:leading-[0.98]">
            {content.headline.name}
          </p>
        </div>

        <h1
          className="hero-headline mt-3 max-w-[16.5ch] font-display text-[clamp(2.65rem,4.7vw,4.05rem)] font-medium leading-[1.07] tracking-normal text-fg md:mt-4 md:max-w-[17ch] md:leading-[1.03] lg:max-w-[17.5ch]"
        >
          <HeadlineWords
            before={content.headline.before}
            italic={content.headline.italic}
            after={content.headline.after}
            startWordIndex={nameWordCount}
          />
        </h1>

        <p
          className="hero-reveal mt-6 max-w-[38ch] font-display text-[1rem] font-normal leading-[1.62] text-fg/85 [hyphens:none] [overflow-wrap:break-word] md:mt-8 md:max-w-[34ch] md:text-[1.12rem] md:leading-[1.6]"
          style={{animationDelay: "180ms"}}
        >
          {content.subline}
        </p>

        <figure
          className="hero-reveal hero-photo hero-photo-mobile mt-6 md:hidden"
          style={{animationDelay: "300ms"}}
        >
          <div className="hero-photo-frame relative aspect-[16/10] w-full overflow-hidden">
            <Image
              alt={content.image.alt}
              className="hero-photo-image object-cover object-[58%_58%]"
              fill
              sizes="92vw"
              src={content.image.src}
            />
          </div>
        </figure>
      </div>

      <figure
        className="hero-reveal hero-photo hero-photo-desktop pointer-events-none relative hidden h-[calc(70svh-5rem)] min-h-[500px] w-full md:block"
        style={{animationDelay: "260ms"}}
      >
        <div className="hero-photo-frame relative h-full w-full overflow-hidden">
          <Image
            alt={content.image.alt}
            className="hero-photo-image object-cover object-[56%_58%]"
            fill
            sizes="(min-width: 1280px) 41vw, (min-width: 1024px) 41vw, 92vw"
            src={content.image.src}
          />
        </div>
      </figure>

      <div
        className="hero-reveal mt-7 pb-6 md:col-span-2 md:mt-8 md:flex md:items-center md:justify-end"
        style={{animationDelay: "420ms"}}
      >
        <HeroLinks links={content.links} />
      </div>

    </section>
  );
}
