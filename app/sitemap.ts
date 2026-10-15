import { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "/",
    "/about",
    "/services",
    "/work",
    "/contact",
    "/ai-automation-mumbai",
  ];

  return routes.map((route) => ({
    url: route === "/" ? siteConfig.url : `${siteConfig.url}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: route === "/" ? 1 : route === "/ai-automation-mumbai" ? 0.9 : 0.8,
  }));
}
