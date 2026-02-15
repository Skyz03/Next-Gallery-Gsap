"use client";

import { motion, useSpring, useMotionValue } from "framer-motion";
import { useEffect, useRef } from "react";
import { Project } from "@/data/project";
import Image from "next/image";

interface ProjectViewProps {
    project: Project;
    onClose: () => void;
}

const brandStyle = "uppercase tracking-[0.25em] font-light";

export default function ProjectView({ project, onClose }: ProjectViewProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const targetX = useMotionValue(0);
    const smoothX = useSpring(targetX, {
        damping: 45,
        stiffness: 160,
        mass: 1,
    });

    useEffect(() => {
        const el = scrollRef.current;
        if (!el || window.innerWidth < 768) return;

        const handleWheel = (e: WheelEvent) => {
            if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
                e.preventDefault();
                const maxScroll = el.scrollWidth - el.clientWidth;
                const next = targetX.get() + e.deltaY * 1.2;
                targetX.set(Math.max(0, Math.min(next, maxScroll)));
            }
        };

        const unsubscribe = smoothX.on("change", (latest) => {
            if (el) el.scrollLeft = latest;
        });

        el.addEventListener("wheel", handleWheel, { passive: false });
        document.body.style.overflow = "hidden";

        return () => {
            el.removeEventListener("wheel", handleWheel);
            unsubscribe();
            document.body.style.overflow = "unset";
        };
    }, [targetX, smoothX]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] bg-[#fafafa] overflow-y-auto md:overflow-hidden"
        >
            {/* CLOSE BUTTON */}
            <button
                onClick={onClose}
                className={`fixed top-8 right-8 z-[350] ${brandStyle} text-[10px] mix-blend-difference text-white hover:line-through cursor-pointer shadow-sm`}
            >
                Close
            </button>

            {/* HORIZONTAL SCROLL CONTAINER */}
            <div
                ref={scrollRef}
                className="w-full h-full flex flex-col md:flex-row md:overflow-x-auto md:overflow-y-hidden overflow-y-auto no-scrollbar md:overflow-x-auto md:overflow-y-hidden"
            >

                {/* ================================= */}
                {/* HERO SECTION */}
                {/* ================================= */}
                <section className="relative min-w-[100vw] flex-shrink-0 h-screen flex flex-col md:flex-row items-stretch overflow-hidden">
                    {/* Image */}
                    <div className="absolute inset-0 md:relative md:w-1/2 md:order-2 h-full bg-neutral-200">
                        <Image
                            src={project.coverImage}
                            alt={project.title}
                            className="w-full h-full object-cover"
                            sizes="(max-width: 768px) 100vw, 60vw"
                            fill
                        />
                        <div className="absolute inset-0 bg-black/30 md:hidden" />
                    </div>

                    {/* Text */}
                    <div className="relative z-10 w-full md:w-1/2 h-full flex flex-col justify-end md:justify-center px-8 pb-24 md:pb-0 md:px-20 lg:px-32">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col gap-6"
                        >
                            <div className="space-y-2">
                                <span
                                    className={`${brandStyle} text-[8px] text-white/80 md:text-black/40 block`}
                                >
                                    {project.location} — {project.client}
                                </span>

                                <h1 className="font-serif italic text-5xl md:text-7xl lg:text-8xl text-white md:text-black leading-[0.85]">
                                    {project.title}
                                </h1>
                            </div>

                            <p className="text-[11px] text-white/70 md:text-black/50 font-light max-w-sm leading-relaxed tracking-wide">
                                {project.description}
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* ================================= */}
                {/* GALLERY SECTION */}
                {/* ================================= */}
                <section className="min-w-[100vw] flex-shrink-0 flex items-center">
                    <div className="flex md:flex-row flex-col gap-8 md:gap-16 px-6 md:px-[3vw] w-max">
                        {project.gallery.map((img, index) => (
                            <div
                                key={`${project.id}-img-${index}`}
                                className="w-full md:w-[60vw] lg:w-[45vw] h-[70vh] md:h-[85vh] flex-shrink-0 flex flex-col gap-6 justify-center"
                            >
                                <div className="relative w-full h-full">

                                    <div className="w-full h-full overflow-hidden bg-neutral-100">
                                        <Image
                                            fill
                                            src={img}
                                            alt={`${project.title} gallery ${index}`}
                                            className="w-full h-full object-cover md:object-contain"
                                            onError={() => console.log("FAILED:", img)}
                                            onLoad={() => console.log("LOADED:", img)}

                                        />
                                    </div>
                                </div>

                                <p
                                    className={`${brandStyle} text-[8px] opacity-20 hidden md:block text-center`}
                                >
                                    {String(index + 1).padStart(2, "0")}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Desktop Spacer */}
                <div className="hidden md:block w-[30vw] flex-shrink-0" />
            </div>
        </motion.div>
    );
}
