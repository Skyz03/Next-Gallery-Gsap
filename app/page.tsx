import Hero from "./components/Hero";
import GallerySection from "./components/GallerySection";
import { getProjects } from "@/lib/getProjects";
import type { Project } from "@/data/project";

export default async function Home() {
  let projects: Project[] = [];
  try {
    projects = await getProjects();
  } catch {
    // keep empty on error (e.g. Supabase not configured)
  }

  return (
    <main className="relative bg-[#faf9f6]">
      <Hero />
      <GallerySection projects={projects} />
    </main>
  );
}
