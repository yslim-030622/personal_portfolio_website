"use client";

import type {LocalizedOptionalLink} from "@/content";
import {useState} from "react";

export function PresentationPreview({
  link,
  className
}: {
  link: LocalizedOptionalLink;
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  if (!link.href) {
    return null;
  }

  return (
    <details
      className={`group border-y border-border/80 transition-colors duration-200 hover:border-fg/35 open:border-fg/40 ${className ?? "mt-5"}`}
      onToggle={(event) => setOpen(event.currentTarget.open)}
    >
      <summary className="flex min-h-11 cursor-pointer list-none items-center gap-3 transition-colors duration-200 hover:text-fg [&::-webkit-details-marker]:hidden">
        <div className="text-[1.08rem] leading-none text-fg/55 transition duration-200 group-open:rotate-45 group-hover:text-fg">
          +
        </div>
        <span className="min-w-0 flex-1 truncate font-display text-[0.94rem] text-fg/62">
          {link.label}
        </span>
        <a
          aria-label={link.ariaLabel}
          className="shrink-0 font-display text-[0.94rem] text-fg/72 transition-colors duration-200 hover:text-fg"
          href={link.href}
          rel={link.external ? "noreferrer" : undefined}
          target={link.external ? "_blank" : undefined}
          onClick={(event) => event.stopPropagation()}
        >
          open
        </a>
      </summary>
      <div className="aspect-[16/10] bg-bg pt-3">
        {open ? (
          <iframe
            className="h-full w-full"
            loading="lazy"
            src={`${link.href}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
            title={link.ariaLabel ?? link.label}
          />
        ) : null}
      </div>
    </details>
  );
}
