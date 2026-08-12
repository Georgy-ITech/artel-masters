import type { MetadataRoute } from "next";
import { services } from "@/data/artel";

export const dynamic = "force-static";

const base = "https://artel-masters.vercel.app";
const lastModified = new Date("2026-08-09");

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${base}/`, lastModified, changeFrequency: "monthly", priority: 1 },
    {
      url: `${base}/uslugi/`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    ...services.map((s) => ({
      url: `${base}/uslugi/${s.slug}/`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
