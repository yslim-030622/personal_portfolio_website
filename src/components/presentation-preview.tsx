"use client";

import type {LocalizedOptionalLink} from "@/content";
import type {CSSProperties} from "react";
import Image from "next/image";

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

  const isLandscape = link.pdfLandscape === true;
  const previewImage = link.previewImage;
  const ratio = previewImage
    ? previewImage.width / previewImage.height
    : isLandscape
      ? 16 / 9
      : 4 / 3;

  return (
    <div
      className={`clearsplit-showcase clearsplit-showcase-pdf overflow-hidden rounded-[16px] mt-6 ${className ?? ""}`}
      data-pdf-landscape={isLandscape ? "true" : undefined}
      data-has-preview={previewImage ? "true" : undefined}
      style={{"--preview-ratio": ratio} as CSSProperties}
    >
      <div className="clearsplit-showcase-stage relative">
        {previewImage ? (
          <Image
            alt={previewImage.alt}
            className="project-preview-image project-preview-image-contain project-preview-image-left"
            fill
            sizes="(max-width: 768px) 84vw, 720px"
            src={previewImage.src}
          />
        ) : (
          <iframe
            className="pdf-preview-frame absolute inset-0 h-full w-full border-0 bg-white pointer-events-none"
            loading="lazy"
            scrolling="no"
            src={`${link.href}#toolbar=0&navpanes=0&view=Fit`}
            title={link.ariaLabel ?? link.label}
          />
        )}
        {/* Transparent overlay link that captures clicks/taps over the entire preview area but allows scroll events to bubble up naturally */}
        <a
          href={link.href}
          target="_blank"
          rel="noreferrer"
          className="absolute inset-0 z-20 cursor-pointer pointer-events-auto block"
          aria-label={link.ariaLabel ?? `Open ${link.label} PDF in a new tab`}
        />
      </div>
    </div>
  );
}
