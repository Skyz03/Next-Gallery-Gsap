import { getProjects } from "@/lib/getProjects";
import MusicGallery from "@/app/music/MusicGallery";
import type { Project } from "@/data/project";
import type { Metadata } from "next";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Music & Events",
  description: "Concert, live performance, and music event photography by Weds Echos — Kathmandu.",
  openGraph: {
    title: "Music & Events — Weds Echos",
    description: "Concert, live performance, and music event photography by Weds Echos — Kathmandu.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Music & Events — Weds Echos",
    description: "Concert, live performance, and music event photography by Weds Echos — Kathmandu.",
  },
};

export default async function MusicPage() {
  let projects: Project[] = [];
  try {
    projects = await getProjects("music");
  } catch {
    // keep empty on error
  }

  return (
    <main className="relative min-h-screen">
      {/* Gallery */}
      <MusicGallery projects={projects} />
    </main>
  );
}
