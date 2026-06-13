"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { type Project, getProjectHref } from "@/data/project";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

function MobileSlide({ project, index, total }: { project: Project; index: number; total: number }) {
  const slideRef = useRef<HTMLAnchorElement>(null);
  const [inView, setInView] = useState(index === 0);

  useEffect(() => {
    const el = slideRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.45 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Link
      ref={slideRef}
      href={getProjectHref(project)}
      className="snap-start relative flex-shrink-0 w-full overflow-hidden block"
      style={{ height: "100dvh" }}
    >
      {/* Image */}
      <Image
        src={project.coverImage}
        alt={project.title}
        fill
        priority={index === 0}
        sizes="100vw"
        className={`object-cover object-center transition-transform duration-1000 ease-out ${inView ? "scale-100" : "scale-[1.06]"}`}
      />

      {/* Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-black/10" />

      {/* Counter */}
      <div className="absolute top-20 right-6 text-white/30 text-[9px] tracking-[0.35em] uppercase tabular-nums font-medium">
        {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </div>

      {/* Bottom text */}
      <div
        className="absolute left-6 right-6 transition-all duration-700 ease-out"
        style={{
          bottom: "calc(env(safe-area-inset-bottom, 0px) + 5rem)",
          transitionDelay: inView ? "150ms" : "0ms",
          opacity: inView ? 1 : 0,
          transform: inView ? "translateY(0)" : "translateY(20px)",
        }}
      >
        <p className="text-[9px] uppercase tracking-[0.4em] text-white/45 mb-3 font-medium">
          {project.location}
          {project.client ? <span className="mx-2 opacity-50">·</span> : null}
          {project.client}
        </p>
        <h2 className="font-serif italic text-[clamp(2.4rem,11vw,4rem)] text-white leading-[0.88] lowercase">
          {project.title}
        </h2>
      </div>

      {/* Scroll indicator — first slide only */}
      {index === 0 && (
        <div
          className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 transition-all duration-700 delay-700"
          style={{
            bottom: "calc(env(safe-area-inset-bottom, 0px) + 1.25rem)",
            opacity: inView ? 1 : 0,
          }}
        >
          <div className="w-px h-10 bg-white/20 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full bg-white/60 animate-[slideDown_1.6s_ease-in-out_infinite]" style={{ height: "40%" }} />
          </div>
        </div>
      )}
    </Link>
  );
}

interface GallerySectionProps {
  projects: Project[];
}

export default function GallerySection({ projects }: GallerySectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const portraitProjects = projects.filter((p) => p.aspect === "portrait");
  const mobileProjects = portraitProjects.length > 0 ? portraitProjects : projects;

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

    items.forEach((card) => {
      const img = card.querySelector("img");
      const overlay = card.querySelector(".hover-overlay");
      const text = card.querySelector(".hover-text");

      card.addEventListener("mouseenter", () => {
        gsap.to(img, { scale: 1.07, duration: 0.9, ease: "power3.out" });
        gsap.to(overlay, { opacity: 1, duration: 0.5, ease: "power2.out" });
        gsap.to(text, { y: 0, opacity: 1, duration: 0.6, ease: "expo.out" });
      });
      card.addEventListener("mouseleave", () => {
        gsap.to(img, { scale: 1, duration: 0.9, ease: "power3.out" });
        gsap.to(overlay, { opacity: 0, duration: 0.45, ease: "power2.in" });
        gsap.to(text, { y: 20, opacity: 0, duration: 0.35, ease: "power2.in" });
      });
    });
  }, { scope: containerRef });

  return (
    <>
      {/* ── MOBILE: portrait snap scroll ── */}
      <div
        className="md:hidden overflow-y-auto snap-y snap-mandatory no-scrollbar"
        style={{ height: "100dvh" }}
      >
        {mobileProjects.map((project, index) => (
          <MobileSlide
            key={project.id}
            project={project}
            index={index}
            total={mobileProjects.length}
          />
        ))}
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

      <style>{`
        @keyframes slideDown {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(300%); }
        }
      `}</style>
    </>
  );
}
