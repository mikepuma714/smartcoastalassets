import type { MetadataRoute } from "next";
import { getPublicProjects, heroImageOf } from "@/lib/projects";
import { getGuides } from "@/lib/guides";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const projects = getPublicProjects();
  const latest = projects.map((p) => p.lastVerified).filter(Boolean).sort().at(-1);

  return [
    { url: site.url, lastModified: latest, changeFrequency: "weekly", priority: 1 },
    { url: `${site.url}/projects`, lastModified: latest, changeFrequency: "weekly", priority: 0.9 },
    ...projects.map((p) => ({
      url: `${site.url}/projects/${p.slug}`,
      lastModified: p.lastVerified,
      changeFrequency: "weekly" as const,
      priority: p.status === "active" ? 0.9 : 0.4,
      images: [heroImageOf(p), ...p.gallery].filter(Boolean).map((img) => `${site.url}${img!.src}`),
    })),
    { url: `${site.url}/guides`, changeFrequency: "monthly", priority: 0.7 },
    ...getGuides().map((g) => ({
      url: `${site.url}/guides/${g.slug}`,
      lastModified: g.updated,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    { url: `${site.url}/faq`, lastModified: latest, changeFrequency: "weekly", priority: 0.7 },
    { url: `${site.url}/contact`, changeFrequency: "yearly", priority: 0.5 },
    { url: `${site.url}/privacy`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${site.url}/terms`, changeFrequency: "yearly", priority: 0.2 },
  ];
}
