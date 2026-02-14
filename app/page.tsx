"use client"; // Must be at the top for useState

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import Hero from "./components/Hero";
import ProjectCard from "./components/ProjectCard";
import ProjectView from "./components/ProjectView"; // Make sure to create this file

const weddingProjects = Array.from({ length: 25 }, (_, i) => ({
  id: i,
  image: `/wed${i + 1}.jpg`,
  title: `Wedding ${i + 1}`,
  client: "Client Name", // Added for ProjectView
  description: "A timeless celebration of love and light. Every moment captured with the signature Namaste Flux aesthetic, blending raw emotion with cinematic composition.",
  location: "Destination Wedding",
  aspect: "portrait" as const,
}));

export default function Home() {
  // 1. State must be inside the component
  const [selectedProject, setSelectedProject] = useState<any>(null);

  const columns = [0, 1, 2].map((col) =>
    weddingProjects.filter((project) => project.id % 3 === col)
  );

  return (
    <main className="relative bg-[#faf9f6]">
      <Hero />

      <section className="relative z-20 -mt-[30vh] pb-24 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12">
          
          {/* Column 1 */}
          <div className="lg:col-span-4 flex flex-col gap-12">
            {columns[0].map((project) => (
              <ProjectCard
                key={project.id}
                index={project.id}
                image={project.image}
                title={project.title}
                location={project.location}
                aspect={project.aspect}
                // Update state with project data when clicked
                onClick={() => setSelectedProject({
                    ...project,
                    images: [project.image, "/wed1.jpg", "/wed2.jpg", "/wed3.jpg"] // Sample gallery
                })}
              />
            ))}
          </div>

          {/* Column 2 */}
          <div className="lg:col-span-4 lg:mt-64 flex flex-col gap-12">
            {columns[1].map((project) => (
              <ProjectCard
                key={project.id}
                index={project.id}
                image={project.image}
                title={project.title}
                location={project.location}
                aspect={project.aspect}
                onClick={() => setSelectedProject({
                    ...project,
                    images: [project.image, "/wed4.jpg", "/wed5.jpg", "/wed6.jpg"]
                })}
              />
            ))}
          </div>

          {/* Column 3 */}
          <div className="lg:col-span-4 lg:mt-32 flex flex-col gap-12">
            {columns[2].map((project) => (
              <ProjectCard
                key={project.id}
                index={project.id}
                image={project.image}
                title={project.title}
                location={project.location}
                aspect={project.aspect}
                onClick={() => setSelectedProject({
                    ...project,
                    images: [project.image, "/wed7.jpg", "/wed8.jpg", "/wed9.jpg"]
                })}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 2. Project Detail Overlay */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectView 
            project={selectedProject} 
            onClose={() => setSelectedProject(null)} 
          />
        )}
      </AnimatePresence>
    </main>
  );
}