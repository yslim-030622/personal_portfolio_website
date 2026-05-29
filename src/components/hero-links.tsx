"use client";

import { useState } from "react";
import { Mail, Github, Linkedin, ExternalLink } from "lucide-react";
import type { LocalizedPortfolioContent } from "@/content";

type HeroLinksProps = {
  links: LocalizedPortfolioContent["hero"]["links"];
};

export function HeroLinks({ links }: HeroLinksProps) {
  const [copied, setCopied] = useState(false);

  const handleEmailCopy = (email: string) => {
    navigator.clipboard.writeText(email).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const getIcon = (label: string) => {
    const lowercase = label.toLowerCase();
    if (lowercase.includes("email") || lowercase.includes("mail") || lowercase.includes("이메일")) {
      return <Mail size={14} className="shrink-0 transition-transform duration-300 group-hover:scale-110" />;
    }
    if (lowercase.includes("github") || lowercase.includes("깃허브")) {
      return <Github size={14} className="shrink-0 transition-transform duration-300 group-hover:scale-110" />;
    }
    if (lowercase.includes("linkedin") || lowercase.includes("링크드인")) {
      return <Linkedin size={14} className="shrink-0 transition-transform duration-300 group-hover:scale-110" />;
    }
    return <ExternalLink size={13} className="shrink-0 opacity-80 transition-transform duration-300 group-hover:scale-110" />;
  };

  const btnClass = "hero-glass-btn group";

  return (
    <div className="flex flex-wrap items-center justify-start gap-[clamp(0.3rem,1.2vw,0.6rem)] gap-y-3 font-display text-[clamp(0.68rem,1.5vw,0.92rem)] tracking-wide text-fg w-full min-w-0">
      {links.map((link) => {
        const isEmail = link.href?.startsWith("mailto:");
        const email = isEmail ? link.href!.replace("mailto:", "") : null;
        const icon = getIcon(link.label);

        return (
          <div key={link.label} className="relative shrink-0">
            {isEmail ? (
              <>
                <button
                  aria-label={link.ariaLabel}
                  className={btnClass}
                  onClick={() => handleEmailCopy(email!)}
                  type="button"
                >
                  {icon}
                  <span>{link.label}</span>
                </button>
                <span
                  className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 rounded bg-fg px-2 py-1 text-[0.72rem] font-medium text-bg transition-all duration-300 whitespace-nowrap shadow-md z-30"
                  style={{
                    opacity: copied ? 1 : 0,
                    transform: copied ? "translate(-50%, 0)" : "translate(-50%, 8px)",
                  }}
                >
                  Copied!
                </span>
              </>
            ) : link.href ? (
              <a
                aria-label={link.ariaLabel}
                className={btnClass}
                href={link.href}
                rel={link.external ? "noreferrer" : undefined}
                target={link.external ? "_blank" : undefined}
              >
                {icon}
                <span>{link.label}</span>
              </a>
            ) : (
              <div className="hero-glass-btn opacity-40 cursor-default pointer-events-none">
                {icon}
                <span>{link.label}</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
