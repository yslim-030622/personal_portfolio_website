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
      className={`liquid-preview group overflow-hidden rounded-md transition duration-300 focus-within:ring-2 focus-within:ring-accent/35 focus-within:ring-offset-2 focus-within:ring-offset-bg ${className ?? "mt-5"}`}
      onToggle={(event) => setOpen(event.currentTarget.open)}
    >
      <summary className="flex min-h-13 cursor-pointer list-none items-center gap-3 px-4 transition-colors duration-200 hover:text-fg focus-visible:outline-none md:px-5 [&::-webkit-details-marker]:hidden">
        <span
          aria-hidden="true"
          className="liquid-dot h-2.5 w-2.5 flex-none rounded-full"
        />
        <span className="min-w-0 flex-1 truncate font-body text-[0.94rem] text-fg/80">
          {link.label}
        </span>
        <a
          aria-label={link.ariaLabel}
          className="liquid-button shrink-0 rounded-md px-3 py-1.5 font-sans text-[0.72rem] font-medium uppercase tracking-wide text-fg/72 transition-colors duration-200 hover:text-accent"
          href={link.href}
          rel={link.external ? "noreferrer" : undefined}
          target={link.external ? "_blank" : undefined}
          onClick={(event) => event.stopPropagation()}
        >
          open
        </a>
        <div className="flex-none text-fg/55 transition-all duration-200 group-open:rotate-180 group-hover:text-fg">
          <svg fill="none" height="14" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="14">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>
      </summary>
      <div className="liquid-preview-frame aspect-[16/10] p-2 md:p-3">
        {open ? (
          <iframe
            className="h-full w-full rounded-md bg-white"
            loading="lazy"
            src={`${link.href}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
            title={link.ariaLabel ?? link.label}
          />
        ) : null}
      </div>
    </details>
  );
}
