import { getProjects } from "@/lib/getProjects";
import MusicGallery from "@/app/music/MusicGallery";
import type { Project } from "@/data/project";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Music & Events | Namaste Studio",
  description: "Concert photography, live performances, and music events captured by Namaste Studio.",
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
