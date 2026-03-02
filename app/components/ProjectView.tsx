"use client";

import { motion, useSpring, useMotionValue } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { Project, getProjectHref } from "@/data/project";
import Image from "next/image";
import Link from "next/link";
import SlideMenus from "./SlideMenus";

interface ProjectViewProps {
    project: Project;
    allProjects?: Project[];
    onClose?: () => void;
    isStandalone?: boolean;
}

const uiText = "uppercase tracking-[0.5em] text-[11px] md:text-[13px] font-bold transition-all cursor-pointer";

export default function ProjectView({ project, allProjects = [], onClose, isStandalone = false }: ProjectViewProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isMobile, setIsMobile] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [menuOpen, setMenuOpen] = useState<"none" | "menu" | "contact">("none");

    const totalSlides = project.gallery.length + 1; // +1 for hero

    const targetX = useMotionValue(0);
    const smoothX = useSpring(targetX, { damping: 45, stiffness: 160, mass: 1 });

    // Find next project
    const currentIdx = allProjects.findIndex((p) => p.id === project.id);
    const nextProject = allProjects.length > 1
        ? allProjects[(currentIdx + 1) % allProjects.length]
        : null;

    // Track current slide from scroll position
    const updateCurrentSlide = useCallback(() => {
        const el = scrollRef.current;
        if (!el) return;

        if (isMobile) {
            const idx = Math.round(el.scrollTop / window.innerHeight);
            setCurrentSlide(Math.min(idx, totalSlides - 1));
        } else {
            const slideWidth = el.scrollWidth / (totalSlides + 1); // +1 for next-project end card
            const idx = Math.round(el.scrollLeft / slideWidth);
            setCurrentSlide(Math.min(idx, totalSlides - 1));
        }
    }, [isMobile, totalSlides]);

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener("resize", check);

        const el = scrollRef.current;
        if (!el) return;

        if (window.innerWidth >= 768) {
            const handleWheel = (e: WheelEvent) => {
                if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
                    e.preventDefault();
                    const max = el.scrollWidth - el.clientWidth;
                    targetX.set(Math.max(0, Math.min(targetX.get() + e.deltaY * 1.2, max)));
                }
            };

            const unsub = smoothX.on("change", (v) => {
                if (el) el.scrollLeft = v;
                updateCurrentSlide();
            });
            el.addEventListener("wheel", handleWheel, { passive: false });
            document.body.style.overflow = "hidden";

            return () => {
                window.removeEventListener("resize", check);
                el.removeEventListener("wheel", handleWheel);
                unsub();
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
    }, [targetX, smoothX, updateCurrentSlide]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] bg-[#fafafa] overflow-hidden"
        >
            {/* ─── TOP NAV BAR ─── */}
            <div className="fixed inset-x-0 top-0 z-[350] pointer-events-none p-6 md:p-10 mix-blend-difference text-white">
                <div className="flex items-start justify-between">

                    {/* LEFT: Back */}
                    <div className="pointer-events-auto w-1/3">
                        {isStandalone ? (
                            <Link href="/" className={`${uiText} hover:line-through`}>Back</Link>
                        ) : (
                            <button onClick={onClose} className={`${uiText} hover:line-through`}>Back</button>
                        )}
                    </div>

                    {/* CENTER: Branding */}
                    <div className="pointer-events-auto w-1/3 flex justify-center">
                        <Link
                            href="/"
                            className="uppercase tracking-[0.5em] text-[13px] md:text-[15px] font-bold leading-[1.8] hover:opacity-50 text-center transition-all block"
                        >
                            Namaste<br />Studio
                        </Link>
                    </div>

                    {/* RIGHT: Menu */}
                    <div className="pointer-events-auto w-1/3 flex justify-end">
                        <button
                            onClick={() => setMenuOpen("menu")}
                            className={`group flex flex-col items-end gap-1 ${uiText}`}
                        >
                            <span className="mb-1">Menu</span>
                            <div className="w-12 h-[1px] bg-white group-hover:w-6 transition-all duration-700 ease-in-out" />
                        </button>
                    </div>
                </div>
            </div>

            {/* ─── BOTTOM BAR: Slide number + Contact ─── */}
            <div className="fixed inset-x-0 bottom-0 z-[350] pointer-events-none p-6 md:p-10 mix-blend-difference text-white">
                <div className="flex items-end justify-between">
                    {/* LEFT: Slide number — large, just the number */}
                    <div className="uppercase tracking-[0.3em] font-bold tabular-nums text-2xl md:text-4xl pointer-events-none">
                        {currentSlide === 0
                            ? project.location
                            : String(currentSlide).padStart(2, "0")
                        }
                    </div>

                    {/* RIGHT: Contact */}
                    <button
                        onClick={() => setMenuOpen("contact")}
                        className={`${uiText} hover:line-through pointer-events-auto`}
                    >
                        Contact
                    </button>
                </div>
            </div>

            {/* ─── SCROLLABLE CONTENT ─── */}
            <div
                ref={scrollRef}
                className={`w-full h-full flex no-scrollbar ${isMobile
                    ? "flex-col overflow-y-auto snap-y snap-mandatory"
                    : "flex-row overflow-hidden"
                    }`}
            >
                {/* ═══ HERO ═══ */}
                <section className="relative min-w-[100vw] h-screen flex-shrink-0 flex flex-col md:flex-row items-stretch snap-start">
                    <div className="absolute inset-0 md:relative md:w-1/2 md:order-2 h-full bg-neutral-200">
                        <Image src={project.coverImage} alt={project.title} fill priority className="object-cover" />
                        <div className="absolute inset-0 bg-black/30 md:hidden" />
                    </div>
                    <div className="relative z-10 w-full md:w-1/2 h-full flex flex-col justify-end md:justify-center px-8 pb-24 md:pb-0 md:px-20 lg:px-32">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-6">
                            <div className="space-y-2">
                                <span className="uppercase tracking-[0.25em] font-light text-[8px] text-white/80 md:text-black/40 block">
                                    {project.location} — {project.client}
                                </span>
                                <h1 className="font-serif italic text-5xl md:text-8xl text-white md:text-black leading-[0.85] lowercase">
                                    {project.title}
                                </h1>
                            </div>
                            <p className="text-[11px] text-white/70 md:text-black/50 max-w-sm leading-relaxed tracking-wide">
                                {project.description}
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* ═══ GALLERY SLIDES ═══ */}
                {project.gallery.map((img, index) => (
                    <div
                        key={index}
                        className={`relative flex-shrink-0 flex items-center justify-center snap-start
                            ${isMobile ? "w-full h-screen" : "w-[60vw] h-full px-[5vw]"}
                        `}
                    >
                        <div className="relative w-full h-full">
                            <Image
                                src={img}
                                alt={`${project.title} — ${index + 1}`}
                                fill
                                className={isMobile ? "object-cover" : "object-contain"}
                                sizes="(max-width: 768px) 100vw, 60vw"
                            />
                        </div>
                    </div>
                ))}

                {/* ═══ NEXT PROJECT CARD ═══ */}
                {nextProject && (
                    <Link
                        href={getProjectHref(nextProject)}
                        className={`relative flex-shrink-0 flex items-center justify-center snap-start group
                            ${isMobile ? "w-full h-screen" : "min-w-[100vw] h-full"}
                        `}
                    >
                        <div className="absolute inset-0 bg-neutral-200">
                            <Image
                                src={nextProject.coverImage}
                                alt={nextProject.title}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                            />
                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-500" />
                        </div>
                        <div className="relative z-10 text-center text-white">
                            <p className={`${uiText} text-[8px] opacity-60 mb-4`}>Next Project</p>
                            <h2 className="font-serif italic text-4xl md:text-7xl lowercase leading-[0.85]">
                                {nextProject.title}
                            </h2>
                            <p className="uppercase tracking-[0.25em] text-[9px] opacity-50 mt-4">
                                {nextProject.location}
                            </p>
                        </div>
                    </Link>
                )}

                {/* Desktop spacer (only if no next project) */}
                {!nextProject && !isMobile && <div className="min-w-[20vw] flex-shrink-0" />}
            </div>

            {/* ─── SLIDE MENU (shared with main nav) ─── */}
            <SlideMenus
                isMenuOpen={menuOpen === "menu"}
                isContactOpen={menuOpen === "contact"}
                onClose={() => setMenuOpen("none")}
            />
        </motion.div>
    );
}
