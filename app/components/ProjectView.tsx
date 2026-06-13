"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Project, getProjectHref } from "@/data/project";
import Image from "next/image";
import Link from "next/link";
import SlideMenus from "./SlideMenus";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

interface ProjectViewProps {
    project: Project;
    allProjects?: Project[];
    onClose?: () => void;
    isStandalone?: boolean;
}

const uiText = "uppercase tracking-[0.4em] text-[9px] md:text-[13px] font-bold transition-opacity cursor-pointer";

export default function ProjectView({ project, allProjects = [], onClose, isStandalone = false }: ProjectViewProps) {
    const viewRef = useRef<HTMLDivElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const heroTextRef = useRef<HTMLDivElement>(null);
    const [isMobile, setIsMobile] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [menuOpen, setMenuOpen] = useState<"none" | "menu" | "contact">("none");

    const totalSlides = project.gallery.length + 1;
    // GSAP proxy object for spring-like horizontal scroll
    const scrollProxy = useRef({ x: 0 });

    // ─── GSAP: container fade + hero text ───
    useGSAP(() => {
        gsap.fromTo(viewRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: "power2.out" });
        gsap.fromTo(heroTextRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, delay: 0.6, ease: "power3.out" });
    }, { dependencies: [] });

    // ─── GSAP: image reveals + parallax ───
    useGSAP(() => {
        if (!scrollRef.current) return;

        gsap.fromTo(".gsap-reveal",
            { clipPath: "inset(0% 100% 0% 0%)", scale: 1.1 },
            { clipPath: "inset(0% 0% 0% 0%)", scale: 1, duration: 2, ease: "expo.out", stagger: 0.15 }
        );

        if (!isMobile) {
            const images = gsap.utils.toArray(".parallax-img");
            images.forEach((img: any) => {
                gsap.to(img, {
                    xPercent: -8,
                    ease: "none",
                    scrollTrigger: {
                        trigger: img,
                        scroller: scrollRef.current,
                        horizontal: true,
                        scrub: true,
                        invalidateOnRefresh: true,
                    }
                });
            });
        }
    }, { scope: scrollRef, dependencies: [isMobile] });

    const currentIdx = allProjects.findIndex((p) => p.id === project.id);
    const nextProject = allProjects.length > 1 ? allProjects[(currentIdx + 1) % allProjects.length] : null;

    const updateCurrentSlide = useCallback(() => {
        const el = scrollRef.current;
        if (!el) return;
        if (isMobile) {
            const idx = Math.round(el.scrollTop / window.innerHeight);
            setCurrentSlide(Math.min(idx, totalSlides - 1));
        } else {
            const slideWidth = el.scrollWidth / (totalSlides + (nextProject ? 1 : 0));
            const idx = Math.round(el.scrollLeft / slideWidth);
            setCurrentSlide(Math.min(idx, totalSlides - 1));
        }
    }, [isMobile, totalSlides, nextProject]);

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener("resize", check);
        const el = scrollRef.current;
        if (!el) return () => window.removeEventListener("resize", check);

        if (window.innerWidth >= 768) {
            const handleWheel = (e: WheelEvent) => {
                if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
                    e.preventDefault();
                    const max = el.scrollWidth - el.clientWidth;
                    const newX = Math.max(0, Math.min(scrollProxy.current.x + e.deltaY * 1.2, max));
                    gsap.to(scrollProxy.current, {
                        x: newX,
                        duration: 1,
                        ease: "power4.out",
                        overwrite: true,
                        onUpdate: () => {
                            el.scrollLeft = scrollProxy.current.x;
                            updateCurrentSlide();
                        },
                    });
                }
            };
            el.addEventListener("wheel", handleWheel, { passive: false });
            document.body.style.overflow = "hidden";
            return () => {
                window.removeEventListener("resize", check);
                el.removeEventListener("wheel", handleWheel);
                gsap.killTweensOf(scrollProxy.current);
                document.body.style.overflow = "unset";
            };
        } else {
            el.addEventListener("scroll", updateCurrentSlide, { passive: true });
            document.body.style.overflow = "hidden";
            return () => {
                window.removeEventListener("resize", check);
                el.removeEventListener("scroll", updateCurrentSlide);
                document.body.style.overflow = "unset";
            };
        }
    }, [updateCurrentSlide]);

    return (
        <div
            ref={viewRef}
            style={{ opacity: 0 }}
            className="fixed inset-0 z-[300] bg-black md:bg-[#fafafa] overflow-hidden"
        >
            {/* ─── TOP NAV ─── */}
            <div className="fixed inset-x-0 top-0 z-[350] pointer-events-none p-5 md:p-10 mix-blend-difference text-white">
                <div className="flex items-center justify-between">
                    <div className="pointer-events-auto">
                        {isStandalone ? (
                            <Link href="/" className={uiText}>Back</Link>
                        ) : (
                            <button onClick={onClose} className={uiText}>Back</button>
                        )}
                    </div>
                    <div className="pointer-events-auto text-center">
                        <Link href="/" className="uppercase tracking-[0.4em] text-[10px] md:text-[15px] font-bold leading-none block">
                            Weds Echos
                        </Link>
                    </div>
                    <div className="pointer-events-auto">
                        <button onClick={() => setMenuOpen("menu")} className={uiText}>Menu</button>
                    </div>
                </div>
            </div>

            {/* ─── BOTTOM UI ─── */}
            <div className="fixed inset-x-0 bottom-0 z-[350] pointer-events-none p-6 md:p-10 mix-blend-difference text-white">
                <div className="flex items-end justify-between">
                    <div className="uppercase tracking-[0.2em] font-bold tabular-nums text-lg md:text-3xl opacity-50">
                        {currentSlide === 0 ? "" : String(currentSlide).padStart(2, "0")}
                    </div>
                    <button onClick={() => setMenuOpen("contact")} className={`${uiText} pointer-events-auto`}>
                        Contact
                    </button>
                </div>
            </div>

            {/* ─── MAIN CONTENT ─── */}
            <div
                ref={scrollRef}
                className={`w-full h-full flex no-scrollbar ${isMobile
                    ? "flex-col overflow-y-auto snap-y snap-mandatory"
                    : "flex-row overflow-hidden"}`}
            >
                {/* ═══ HERO ═══ */}
                <section className="relative min-w-[100vw] h-screen flex-shrink-0 flex flex-col md:flex-row items-stretch snap-start">
                    <div className="absolute inset-0 md:relative md:w-1/2 md:order-2 h-full bg-neutral-900 overflow-hidden">
                        <div className="parallax-img gsap-reveal relative w-full h-full scale-105">
                            <Image src={project.coverImage} alt={project.title} fill priority className="object-cover" />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent md:hidden" />
                    </div>

                    <div className="relative z-10 w-full md:w-1/2 h-full flex flex-col justify-end px-6 pb-24 md:pb-0 md:justify-center md:px-20 lg:px-32">
                        <div ref={heroTextRef} style={{ opacity: 0 }} className="flex flex-col gap-4 text-white md:text-black">
                            <div className="space-y-1">
                                <span className="uppercase tracking-[0.3em] font-medium text-[9px] md:text-[11px] opacity-60 block">
                                    {project.location} — {project.client}
                                </span>
                                <h1 className="font-serif italic text-4xl md:text-8xl leading-[0.9] lowercase">
                                    {project.title}
                                </h1>
                            </div>
                            <p className="text-[11px] md:text-[13px] opacity-70 max-w-[280px] md:max-w-sm leading-relaxed tracking-wide">
                                {project.description}
                            </p>
                        </div>
                    </div>
                </section>

                {/* ═══ GALLERY SLIDES ═══ */}
                {project.gallery.map((img, index) => (
                    <div key={index} className={`relative flex-shrink-0 flex items-center justify-center snap-start ${isMobile ? "w-full h-screen" : "w-[65vw] h-full px-[5vw]"}`}>
                        <div className="relative w-full h-full overflow-hidden gsap-reveal">
                            <div className="parallax-img relative w-full h-full scale-[1.02]">
                                <Image
                                    src={img}
                                    alt={`${project.title} — ${index + 1}`}
                                    fill
                                    className={isMobile ? "object-cover" : "object-contain"}
                                    sizes="(max-width: 768px) 100vw, 65vw"
                                />
                            </div>
                        </div>
                    </div>
                ))}

                {/* ═══ NEXT PROJECT ═══ */}
                {nextProject && (
                    <Link href={getProjectHref(nextProject)} className={`relative flex-shrink-0 flex items-center justify-center snap-start group ${isMobile ? "w-full h-screen" : "min-w-[100vw] h-full"}`}>
                        <div className="absolute inset-0 bg-neutral-900 overflow-hidden">
                            <Image src={nextProject.coverImage} alt={nextProject.title} fill className="object-cover transition-transform duration-1000 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-colors duration-500" />
                        </div>
                        <div className="relative z-10 text-center text-white px-6">
                            <p className={`${uiText} text-[9px] opacity-60 mb-2`}>Next Project</p>
                            <h2 className="font-serif italic text-5xl md:text-8xl lowercase leading-[0.9]">{nextProject.title}</h2>
                            <p className="uppercase tracking-[0.2em] text-[10px] opacity-50 mt-4">{nextProject.location}</p>
                        </div>
                    </Link>
                )}
            </div>

            <SlideMenus isMenuOpen={menuOpen === "menu"} isContactOpen={menuOpen === "contact"} onClose={() => setMenuOpen("none")} />
        </div>
    );
}
