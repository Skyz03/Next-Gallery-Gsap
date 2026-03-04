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
    // 1. Target all project cards
    const cards = gsap.utils.toArray(".music-card");

    // 2. Create a batch reveal effect
    gsap.fromTo(cards,
      {
        opacity: 0,
        y: 60,
        clipPath: "inset(100% 0% 0% 0%)" // Image starts "hidden" at the bottom
      },
      {
        opacity: 1,
        y: 0,
        clipPath: "inset(0% 0% 0% 0%)",
        duration: 1.2,
        ease: "power4.out",
        stagger: 0.15, // Creates that nice "one-after-another" flow
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%", // Starts animation when gallery is near bottom of screen
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
    <section ref={containerRef} className="px-2 md:px-10 pb-32">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-8">
        {projects.map((project) => (
          <Link
            key={project.id}
            href={getProjectHref(project)}
            className="music-card group block relative w-full aspect-[3/4] overflow-hidden bg-neutral-900"
          >
            {/* Image Layer - Standard img with GSAP hover in CSS/inline */}
            <img
              src={project.coverImage}
              alt={project.title}
              className="h-full w-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-[1200ms] ease-out"
            />

            {/* Hover/Tap Overlay */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-center p-4 text-center backdrop-blur-[2px]">

              {/* Text elements with subtle slide-up on group hover */}
              <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                <p className="text-[7px] md:text-[9px] uppercase tracking-[0.3em] text-white/80 mb-2">
                  {project.location}
                </p>

                <h3 className="font-serif italic text-lg md:text-3xl text-white lowercase">
                  {project.title}
                </h3>

                <div className="mt-4 mx-auto w-0 group-hover:w-8 h-[1px] bg-red-600 transition-all duration-700" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}