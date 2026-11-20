import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/config/site";

/** Single-page site today. Add blog/post URLs here when the blog ships. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: absoluteUrl("/"),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1
    }
  ];
}
