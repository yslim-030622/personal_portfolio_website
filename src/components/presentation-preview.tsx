"use client";

import type {LocalizedOptionalLink} from "@/content";

export function PresentationPreview({
  link,
  className
}: {
  link: LocalizedOptionalLink;
  className?: string;
}) {
  if (!link.href) {
    return null;
  }

  return (
    <div className={`clearsplit-showcase overflow-hidden rounded-[26px] ${className ?? "mt-6"}`}>
      <div className="clearsplit-showcase-stage bg-white">
        <iframe
          className="absolute inset-0 h-full w-full border-0 bg-white"
          loading="lazy"
          src={`${link.href}#toolbar=0&navpanes=0&view=FitH`}
          title={link.ariaLabel ?? link.label}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-20 pointer-events-none"
          style={{zIndex: 10, background: 'linear-gradient(to top, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0) 100%)'}}
        />
      </div>
    </div>
  );
}
