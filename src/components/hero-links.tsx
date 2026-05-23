"use client";

import {useState} from "react";
import type {LocalizedPortfolioContent} from "@/content";

type HeroLinksProps = {
  links: LocalizedPortfolioContent["hero"]["links"];
};

export function HeroLinks({links}: HeroLinksProps) {
  const [copied, setCopied] = useState(false);

  const handleEmailCopy = (email: string) => {
    navigator.clipboard.writeText(email).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[1rem] tracking-wide text-fg">
      {links.map((link, index) => {
        const isEmail = link.href?.startsWith("mailto:");
        const email = isEmail ? link.href!.replace("mailto:", "") : null;

        return (
          <span className="flex items-center gap-x-3" key={link.label}>
            {isEmail ? (
              <button
                aria-label={link.ariaLabel}
                className="link-underline relative cursor-pointer"
                onClick={() => handleEmailCopy(email!)}
                type="button"
              >
                {link.label}
                <span
                  className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 rounded bg-fg px-2 py-1 text-[0.72rem] font-medium text-bg transition-opacity duration-200 whitespace-nowrap"
                  style={{opacity: copied ? 1 : 0}}
                >
                  Copied!
                </span>
              </button>
            ) : link.href ? (
              <a
                aria-label={link.ariaLabel}
                className="link-underline"
                href={link.href}
                rel={link.external ? "noreferrer" : undefined}
                target={link.external ? "_blank" : undefined}
              >
                {link.label}
              </a>
            ) : (
              <span className="text-fg-muted">{link.label}</span>
            )}
            {index < links.length - 1 ? (
              <span aria-hidden="true" className="text-fg-muted">
                ·
              </span>
            ) : null}
          </span>
        );
      })}
    </div>
  );
}
