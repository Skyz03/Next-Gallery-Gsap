import type { MetadataRoute } from "next";
import { getProjects } from "@/lib/getProjects";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://wedsechos.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [weddingProjects, musicProjects] = await Promise.all([
    getProjects("wedding").catch(() => []),
    getProjects("music").catch(() => []),
  ]);

  const weddingUrls = weddingProjects.map((p) => ({
    url: `${siteUrl}/projects/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const musicUrls = musicProjects.map((p) => ({
    url: `${siteUrl}/music/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    { url: siteUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${siteUrl}/music`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    ...weddingUrls,
    ...musicUrls,
  ];
}
