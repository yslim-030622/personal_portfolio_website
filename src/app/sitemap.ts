import {getAbsoluteUrl} from "@/lib/site";
import type {MetadataRoute} from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: getAbsoluteUrl("/"),
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
      alternates: {
        languages: {
          en: getAbsoluteUrl("/"),
          ko: getAbsoluteUrl("/ko")
        }
      }
    },
    {
      url: getAbsoluteUrl("/ko"),
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
      alternates: {
        languages: {
          en: getAbsoluteUrl("/"),
          ko: getAbsoluteUrl("/ko")
        }
      }
    }
  ];
}
