import GallerySection from "./components/GallerySection";
import { getProjects } from "@/lib/getProjects";
import type { Project } from "@/data/project";
import type { Metadata } from "next";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Wedding Gallery — Weds Echos",
  description:
    "Browse our wedding portfolio — editorial, cinematic photography from across Nepal and beyond.",
  openGraph: {
    title: "Wedding Gallery — Weds Echos",
    description:
      "Browse our wedding portfolio — editorial, cinematic photography from across Nepal and beyond.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Wedding Gallery — Weds Echos",
    description:
      "Browse our wedding portfolio — editorial, cinematic photography from across Nepal and beyond.",
  },
};

export default async function Home() {
  let projects: Project[] = [];
  try {
    projects = await getProjects("wedding");
  } catch {
    // keep empty on error (e.g. Supabase not configured)
  }

  return (
    <main className="relative bg-[#faf9f6]">
      <GallerySection projects={projects} />
    </main>
  );
}
