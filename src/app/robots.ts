import {getSiteUrl} from "@/lib/site";
import type {MetadataRoute} from "next";

export default function robots(): MetadataRoute.Robots {
  const site = getSiteUrl();

  return {
    rules: {
      userAgent: "*",
      allow: "/"
    },
    sitemap: `${site}/sitemap.xml`,
    host: site
  };
}
