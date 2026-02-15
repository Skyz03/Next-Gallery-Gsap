"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import ProjectCard from "./ProjectCard";
import ProjectView from "./ProjectView";
import type { Project } from "@/data/project";

interface GallerySectionProps {
  projects: Project[];
}

export default function GallerySection({ projects }: GallerySectionProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const columns = [
    projects.filter((_, i) => i % 3 === 0),
    projects.filter((_, i) => i % 3 === 1),
    projects.filter((_, i) => i % 3 === 2),
  ];

  return (
    <>
      <section className="relative z-20 -mt-[30vh] pb-24 px-4 md:px-10 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 md:gap-12">
          <div className="lg:col-span-4 flex flex-col gap-12">
            {columns[0].map((project, i) => (
              <ProjectCard
                key={project.id}
                index={i}
                image={project.coverImage}
                title={project.title}
                location={project.location}
                aspect={project.aspect}
                onClick={() => setSelectedProject(project)}
              />
            ))}
          </div>
          <div className="lg:col-span-4 lg:mt-64 flex flex-col gap-12">
            {columns[1].map((project, i) => (
              <ProjectCard
                key={project.id}
                index={i}
                image={project.coverImage}
                title={project.title}
                location={project.location}
                aspect={project.aspect}
                onClick={() => setSelectedProject(project)}
              />
            ))}
          </div>
          <div className="lg:col-span-4 lg:mt-32 flex flex-col gap-12">
            {columns[2].map((project, i) => (
              <ProjectCard
                key={project.id}
                index={i}
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

      <AnimatePresence>
        {selectedProject && (
          <ProjectView
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
