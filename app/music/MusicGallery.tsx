"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { type Project, getProjectHref } from "@/data/project";

interface MusicGalleryProps {
  projects: Project[];
}

export default function MusicGallery({ projects }: MusicGalleryProps) {
  if (projects.length === 0) {
    return (
      <section className="px-6 md:px-10 pb-32 text-center">
        <p className="text-white/40 uppercase tracking-widest text-xs">
          No music projects yet.
        </p>
      </section>
    );
  }

  return (
    <section className="px-2 md:px-10 pb-32">
      {/* 2-Column Mobile, 3-Column Desktop Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-8">
        {projects.map((project, i) => (
          <Link
            key={project.id}
            href={getProjectHref(project)}
            className="group block relative w-full aspect-[3/4] md:aspect-[3/4] overflow-hidden bg-neutral-900"
          >
            {/* Image Layer */}
            <motion.img
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
              src={project.coverImage}
              alt={project.title}
              className="h-full w-full object-cover transition-opacity duration-500 group-hover:opacity-80"
            />

            {/* Hover/Tap Overlay */}
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col items-center justify-center p-4 text-center backdrop-blur-[2px]">
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="text-[7px] md:text-[9px] uppercase tracking-[0.3em] text-white/80 mb-2"
              >
                {project.location}
              </motion.p>

              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="font-serif italic text-lg md:text-3xl text-white lowercase"
              >
                {project.title}
              </motion.h3>

              {/* Minimalist Line */}
              <div className="mt-4 w-6 h-[1px] bg-white/50" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}