"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { type Project, getProjectHref } from "@/data/project";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

interface GallerySectionProps {
  projects: Project[];
}

export default function GallerySection({ projects }: GallerySectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const items = gsap.utils.toArray<HTMLElement>(".puzzle-item");
    if (items.length === 0) return;

    gsap.fromTo(
      items,
      {
        opacity: 0,
        y: window.innerHeight + 200,
        x: () => gsap.utils.random(-window.innerWidth * 0.4, window.innerWidth * 0.4),
        scale: 0.9,
        rotationZ: () => gsap.utils.random(-10, 10),
      },
      {
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        rotationZ: 0,
        duration: 1.8,
        ease: "expo.out",
        stagger: { each: 0.08, from: "random" },
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      }
    );

    const cleanups: (() => void)[] = [];

    items.forEach((card) => {
      const img = card.querySelector("img");
      const overlay = card.querySelector(".hover-overlay");
      const text = card.querySelector(".hover-text");

      const onEnter = () => {
        gsap.to(img, { scale: 1.07, duration: 0.9, ease: "power3.out" });
        gsap.to(overlay, { opacity: 1, duration: 0.5, ease: "power2.out" });
        gsap.to(text, { y: 0, opacity: 1, duration: 0.6, ease: "expo.out" });
      };
      const onLeave = () => {
        gsap.to(img, { scale: 1, duration: 0.9, ease: "power3.out" });
        gsap.to(overlay, { opacity: 0, duration: 0.45, ease: "power2.in" });
        gsap.to(text, { y: 20, opacity: 0, duration: 0.35, ease: "power2.in" });
      };

      card.addEventListener("mouseenter", onEnter);
      card.addEventListener("mouseleave", onLeave);
      cleanups.push(() => {
        card.removeEventListener("mouseenter", onEnter);
        card.removeEventListener("mouseleave", onLeave);
      });
    });

    return () => cleanups.forEach((fn) => fn());
  }, { scope: containerRef });

  return (
    <>
      {/* ── MOBILE: 2-column grid ── */}
      <div className="md:hidden">
        <div className="grid grid-cols-2 gap-px bg-[#faf9f6]">
          {projects.map((project, index) => (
            <Link
              key={project.id}
              href={getProjectHref(project)}
              className="group relative block overflow-hidden"
            >
              <div className="relative aspect-[3/4] w-full overflow-hidden">
                <Image
                  src={project.coverImage}
                  alt={project.title}
                  fill
                  priority={index < 4}
                  sizes="50vw"
                  className="object-cover object-center transition-transform duration-700 ease-out group-active:scale-[1.03]"
                />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── DESKTOP: existing puzzle grid ── */}
      <section ref={containerRef} className="hidden md:block relative z-20 mx-auto overflow-hidden">
        <div className="grid grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <Link
              key={project.id}
              href={getProjectHref(project)}
              className="puzzle-item group relative block"
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden">
                <Image
                  src={project.coverImage}
                  alt={project.title}
                  fill
                  priority={index === 0}
                  sizes="(max-width: 1024px) 50vw, 33vw"
                  className="object-cover grayscale-[0.5] group-hover:grayscale-0 transition-[filter] duration-700 ease-[cubic-bezier(0.33,1,0.68,1)]"
                />
                <div className="hover-overlay absolute inset-0 bg-black/40 opacity-0 flex items-end p-4">
                  <div className="hover-text text-white translate-y-5 opacity-0">
                    <h3 className="text-sm uppercase font-semibold tracking-widest">{project.title}</h3>
                    <p className="text-xs uppercase opacity-80 tracking-widest">{project.location}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

    </>
  );
}
