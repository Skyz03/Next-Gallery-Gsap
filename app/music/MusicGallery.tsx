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
          No music projects yet. Upload one from /admin.
        </p>
      </section>
    );
  }

  return (
    <section className="px-4 md:px-10 pb-32">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {projects.map((project, i) => (
          <Link
            key={project.id}
            href={getProjectHref(project)}
            className="group block"
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.7, delay: (i % 2) * 0.1, ease: "easeOut" }}
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-neutral-900">
                <motion.img
                  whileHover={{ scale: 1.04 }}
                  transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
                  src={project.coverImage}
                  alt={project.title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500" />
              </div>

              <div className="mt-4 md:mt-5">
                <h3 className="font-serif italic text-xl md:text-2xl text-white/90 group-hover:text-white transition-colors">
                  {project.title}
                </h3>
                <p className="text-[10px] uppercase tracking-[0.3em] text-white/40 mt-1">
                  {project.location}
                </p>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </section>
  );
}
