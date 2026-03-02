import { getProjects } from "@/lib/getProjects";
import MusicGallery from "./MusicGallery";
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
    <main className="relative min-h-screen bg-[#0a0a0a] text-white">
      {/* Hero */}
      <section className="h-screen flex flex-col items-center justify-center px-6 text-center">
        <p className="uppercase tracking-[0.6em] text-[10px] md:text-[11px] font-bold text-white/40 mb-6">
          Namaste Studio
        </p>
        <h1 className="font-serif italic text-5xl md:text-8xl lg:text-9xl lowercase leading-[0.85]">
          The Sound
        </h1>
        <p className="uppercase tracking-[0.4em] text-[10px] text-white/30 mt-6">
          Scroll to explore
        </p>
      </section>

      {/* Gallery */}
      <MusicGallery projects={projects} />
    </main>
  );
}
