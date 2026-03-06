"use client";

import { useRef } from "react";
import Link from "next/link";
import ProjectCard from "./ProjectCard";
import { type Project, getProjectHref } from "@/data/project";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

interface GallerySectionProps {
  projects: Project[];
}

export default function GallerySection({ projects }: GallerySectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const items = gsap.utils.toArray(".puzzle-item");

    // The "Messed Up Puzzle" Initial State
    gsap.fromTo(items,
      {
        opacity: 0,
        scale: 0.5,
        // Randomized scattering
        x: () => (Math.random() - 0.5) * 400, // Scatters left/right up to 200px
        y: () => (Math.random() - 0.5) * 400, // Scatters up/down up to 200px
        rotationZ: () => (Math.random() - 0.5) * 40, // Random tilt
        rotationX: () => (Math.random() - 0.5) * 50, // 3D tilt
        filter: "blur(10px)",
      },
      {
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        rotationZ: 0,
        rotationX: 0,
        filter: "blur(0px)",
        duration: 2.5,
        ease: "expo.inOut", // Starts slow, snaps fast, ends smooth
        stagger: {
          amount: 0.8, // Total time spread across all items
          from: "random" // Makes it feel organic, not a linear sequence
        },
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          toggleActions: "play none none none"
        }
      }
    );
  }, { scope: containerRef });

  const columns = [
    projects.filter((_, i) => i % 3 === 0),
    projects.filter((_, i) => i % 3 === 1),
    projects.filter((_, i) => i % 3 === 2),
  ];

  return (
    <section ref={containerRef} className="relative z-20 md:px-10 mx-auto overflow-hidden">

      {/* ─── MOBILE GRID: Puzzle Pieces ─── */}
      <div className="grid grid-cols-2 lg:hidden">
        {projects.map((project) => (
          <Link
            key={project.id}
            href={getProjectHref(project)}
            className="puzzle-item group block perspective-1000"
          >
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-sm shadow-2xl">
              <img
                src={project.coverImage}
                alt={project.title}
                className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
            </div>
          </Link>
        ))}
      </div>

      {/* ─── DESKTOP GRID: Staggered Puzzle ─── */}
      <div className="hidden lg:grid grid-cols-12 gap-12 py-20">
        <div className="lg:col-span-4 flex flex-col gap-16">
          {columns[0].map((project, i) => (
            <Link key={project.id} href={getProjectHref(project)} className="puzzle-item group cursor-pointer perspective-1000">
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
        <div className="lg:col-span-4 lg:mt-80 flex flex-col gap-16">
          {columns[1].map((project, i) => (
            <Link key={project.id} href={getProjectHref(project)} className="puzzle-item group cursor-pointer perspective-1000">
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
        <div className="lg:col-span-4 lg:mt-40 flex flex-col gap-16">
          {columns[2].map((project, i) => (
            <Link key={project.id} href={getProjectHref(project)} className="puzzle-item group cursor-pointer perspective-1000">
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
  );
}