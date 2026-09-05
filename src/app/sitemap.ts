import {getAbsoluteUrl} from "@/lib/site";
import type {MetadataRoute} from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  // Korean /ko stays implemented but is omitted from the public sitemap
  // while the site is English-only. Restore the ko entry when re-enabling
  // the language switch.
  return [
    {
      url: getAbsoluteUrl("/"),
      lastModified,
      changeFrequency: "monthly",
      priority: 1
    }
  ];
}
