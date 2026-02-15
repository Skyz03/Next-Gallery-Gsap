"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import Hero from "./components/Hero";
import ProjectCard from "./components/ProjectCard";
import ProjectView from "./components/ProjectView";
import { projects, Project } from "@/data/project";

export default function Home() {
  // Use the Project type for better TypeScript support
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Split your real data into 3 columns for the masonry grid
  const columns = [
    projects.filter((_, i) => i % 3 === 0),
    projects.filter((_, i) => i % 3 === 1),
    projects.filter((_, i) => i % 3 === 2),
  ];

  return (
    <main className="relative bg-[#faf9f6]">
      <Hero />

      <section className="relative z-20 -mt-[30vh] pb-24 px-4 md:px-10 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 md:gap-12">

          {/* Column 1 */}
          <div className="lg:col-span-4 flex flex-col gap-12">
            {columns[0].map((project) => (
              <ProjectCard
                key={project.id}
                index={Number(project.id)}
                image={project.coverImage}
                title={project.title}
                location={project.location}
                aspect={project.aspect}
                onClick={() => setSelectedProject(project)}
              />
            ))}
          </div>

          {/* Column 2 - Offset for Masonry feel */}
          <div className="lg:col-span-4 lg:mt-64 flex flex-col gap-12">
            {columns[1].map((project) => (
              <ProjectCard
                key={project.id}
                index={Number(project.id)}
                image={project.coverImage}
                title={project.title}
                location={project.location}
                aspect={project.aspect}
                onClick={() => setSelectedProject(project)}
              />
            ))}
          </div>

          {/* Column 3 - Offset for Masonry feel */}
          <div className="lg:col-span-4 lg:mt-32 flex flex-col gap-12">
            {columns[2].map((project) => (
              <ProjectCard
                key={project.id}
                index={Number(project.id)}
                image={project.coverImage}
                title={project.title}
                location={project.location}
                aspect={project.aspect}
                onClick={() => setSelectedProject(project)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Project Detail Overlay */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectView
            // We pass the project, but we must ensure ProjectView 
            // uses 'project.gallery' for the horizontal images
            project={{
              ...selectedProject,
              images: selectedProject.gallery // Mapping gallery to the 'images' prop
            }}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </main>
  );
}