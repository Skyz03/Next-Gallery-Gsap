"use client";

import { useRef } from "react";
import Link from "next/link";
import { type Project, getProjectHref } from "@/data/project";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

interface MusicGalleryProps {
  projects: Project[];
}

export default function MusicGallery({ projects }: MusicGalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const cards = gsap.utils.toArray(".music-card");

    // The "Deconstructed Record Collection" Initial State
    gsap.fromTo(cards,
      {
        opacity: 0,
        scale: 0.4,
        z: -500, // Start deep in 3D space
        // Random "Explosion" coordinates
        x: () => (Math.random() - 0.5) * 600,
        y: () => (Math.random() - 0.5) * 600,
        // Random tilts like falling papers
        rotationX: () => (Math.random() - 0.5) * 100,
        rotationY: () => (Math.random() - 0.5) * 100,
        rotationZ: () => (Math.random() - 0.5) * 50,
        filter: "blur(15px)",
      },
      {
        opacity: 1,
        scale: 1,
        z: 0,
        x: 0,
        y: 0,
        rotationX: 0,
        rotationY: 0,
        rotationZ: 0,
        filter: "blur(0px)",
        duration: 2.2,
        ease: "expo.inOut",
        stagger: {
          amount: 1,
          from: "random", // Makes the "assembly" feel more natural
        },
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
        }
      }
    );
  }, { scope: containerRef });

  if (projects.length === 0) {
    return (
      <section className="px-6 md:px-10 pb-32 text-center text-white/40 uppercase tracking-widest text-xs">
        No music projects yet.
      </section>
    );
  }

  return (
    <section
      ref={containerRef}
      className="overflow-hidden perspective-2000"
    >
      <div className="grid grid-cols-2 md:grid-cols-3">
        {projects.map((project) => (
          <Link
            key={project.id}
            href={getProjectHref(project)}
            className="music-card group block relative w-full aspect-[3/4] overflow-hidden bg-neutral-900 shadow-2xl rounded-sm"
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Image Layer */}
            <img
              src={project.coverImage}
              alt={project.title}
              className="h-full w-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 group-hover:scale-105 transition-all duration-[1500ms] ease-out"
            />

            {/* Cinematic Music Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 flex flex-col items-center justify-end p-6 text-center backdrop-blur-[1px]">

              <div className="translate-y-6 group-hover:translate-y-0 transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]">
                <p className="text-[8px] md:text-[10px] uppercase tracking-[0.4em] text-white/60 mb-3">
                  {project.location}
                </p>

                <h3 className="font-serif italic text-xl md:text-4xl text-white lowercase leading-tight">
                  {project.title}
                </h3>

                {/* Progress bar accent (Red) */}
                <div className="mt-6 mx-auto w-0 group-hover:w-12 h-[2px] bg-red-600 transition-all duration-1000 delay-100" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}