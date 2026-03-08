"use client";

import { useRef } from "react";
import Link from "next/link";
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

    gsap.fromTo(
      items,
      {
        opacity: 0,
        y: window.innerHeight + 200, // start BELOW the screen
        x: () => gsap.utils.random(-window.innerWidth * 0.4, window.innerWidth * 0.4), // random horizontal position
        scale: 0.9,
        rotationZ: () => gsap.utils.random(-10, 10),
        filter: "blur(10px)",
      },
      {
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        rotationZ: 0,
        filter: "blur(0px)",
        duration: 1.8,
        ease: "expo.out",
        stagger: {
          each: 0.08,
          from: "random",
        },
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      }
    );
  }, { scope: containerRef });
  return (
    <section
      ref={containerRef}
      className="relative z-20 mx-auto overflow-hidden"
    >
      {/* COLLECTION GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Link
            key={project.id}
            href={getProjectHref(project)}
            className="puzzle-item group relative block"
          >
            <div className="relative aspect-[4/5] w-full overflow-hidden">

              {/* IMAGE */}
              <img
                src={project.coverImage}
                alt={project.title}
                className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
              />

              {/* HOVER OVERLAY */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-4">

                <div className="text-white transform translate-y-6 group-hover:translate-y-0 transition-transform duration-500">
                  <h3 className="text-sm uppercase font-semibold tracking-widest">
                    {project.title}
                  </h3>
                  <p className="text-xs uppercase opacity-80 tracking-widest">
                    {project.location}
                  </p>
                </div>

              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}