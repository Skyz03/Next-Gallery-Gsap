"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import Link from "next/link";
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
      <section className="relative z-20 md:px-2 md:px-10 mx-auto">
        {/* Mobile: two-column image grid with centered hover text */}
        <div className="grid grid-cols-2 lg:gap-4 lg:hidden">
          {projects.map((project) => (
            <Link key={project.id} href={`/projects/${project.slug}`} className="group block">
              <div className="relative w-full h-full">
                <img
                  src={project.coverImage}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-center">
                    <span className="bg-black bg-opacity-60 text-white px-3 py-1 rounded text-sm">
                      {project.title}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Desktop / large: original 3-column staggered layout */}
        <div className="hidden lg:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 md:gap-12">
          <div className="lg:col-span-4 flex flex-col gap-12">
            {columns[0].map((project, i) => (
              <Link key={project.id} href={`/projects/${project.slug}`} className="group cursor-pointer">
                <ProjectCard
                  index={i}
                  image={project.coverImage}
                  title={project.title}
                  location={project.location}
                  aspect={project.aspect}
                />
              </Link>
            ))}
          </div>
          <div className="lg:col-span-4 lg:mt-64 flex flex-col gap-12">
            {columns[1].map((project, i) => (
              <Link key={project.id} href={`/projects/${project.slug}`} className="group cursor-pointer">
                <ProjectCard
                  index={i}
                  image={project.coverImage}
                  title={project.title}
                  location={project.location}
                  aspect={project.aspect}
                />
              </Link>
            ))}
          </div>
          <div className="lg:col-span-4 lg:mt-32 flex flex-col gap-12">
            {columns[2].map((project, i) => (
              <Link key={project.id} href={`/projects/${project.slug}`} className="group cursor-pointer">
                <ProjectCard
                  index={i}
                  image={project.coverImage}
                  title={project.title}
                  location={project.location}
                  aspect={project.aspect}
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Keep this for backward compatibility - can be removed once fully migrated */}
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
