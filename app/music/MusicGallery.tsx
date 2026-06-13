"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { type Project, getProjectHref } from "@/data/project";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

interface MusicGalleryProps {
  projects: Project[];
}

const cardStyle: React.CSSProperties = { transformStyle: "preserve-3d" };

export default function MusicGallery({ projects }: MusicGalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const cards = gsap.utils.toArray(".music-card");
    const isMobile = window.innerWidth < 768;

    gsap.fromTo(cards,
      {
        opacity: 0,
        scale: 0.4,
        ...(isMobile ? {} : {
          z: -500,
          rotationX: () => (Math.random() - 0.5) * 100,
          rotationY: () => (Math.random() - 0.5) * 100,
        }),
        rotationZ: () => (Math.random() - 0.5) * 50,
        x: () => (Math.random() - 0.5) * (isMobile ? 200 : 600),
        y: () => (Math.random() - 0.5) * (isMobile ? 200 : 600),
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
        duration: 2.2,
        ease: "expo.inOut",
        stagger: {
          amount: 1,
          from: "random",
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
            style={cardStyle}
          >
            {/* Image Layer */}
            <Image
              src={project.coverImage}
              alt={project.title}
              fill
              sizes="(max-width: 768px) 50vw, 33vw"
              className="object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 group-hover:scale-105 transition-[transform,filter] duration-[1500ms] ease-out"
            />

            {/* Cinematic Music Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-[cubic-bezier(0.33,1,0.68,1)] flex flex-col items-center justify-end p-6 text-center">

              <div className="translate-y-6 group-hover:translate-y-0 transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]">
                <p className="text-[8px] md:text-[10px] uppercase tracking-[0.4em] text-white/60 mb-3">
                  {project.location}
                </p>

                <h3 className="font-serif italic text-xl md:text-4xl text-white lowercase leading-tight">
                  {project.title}
                </h3>

                {/* Progress bar accent (Red) */}
                <div className="mt-6 mx-auto w-0 group-hover:w-12 h-[2px] bg-red-600 transition-[width] duration-1000 delay-100" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
