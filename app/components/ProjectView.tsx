"use client";

import { motion, useSpring, useMotionValue, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Project } from "@/data/project";
import Image from "next/image";
import Link from "next/link";

interface ProjectViewProps {
    project: Project;
    onClose?: () => void;
    isStandalone?: boolean;
}

const brandStyle = "uppercase tracking-[0.25em] font-light text-[10px]";

export default function ProjectView({ project, onClose, isStandalone = false }: ProjectViewProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isMobile, setIsMobile] = useState(false);

    // Desktop Physics
    const targetX = useMotionValue(0);
    const smoothX = useSpring(targetX, {
        damping: 45,
        stiffness: 160,
        mass: 1,
    });

    // 1. Handle Responsive Check
    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

    // 2. Handle Desktop Horizontal Physics
    useEffect(() => {
        const el = scrollRef.current;
        if (!el || isMobile) return;

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
        document.body.style.overflow = "hidden"; // Lock background scroll

        return () => {
            el.removeEventListener("wheel", handleWheel);
            unsubscribe();
            document.body.style.overflow = "unset";
        };
    }, [targetX, smoothX, isMobile]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] bg-[#fafafa] overflow-hidden"
        >
            {/* NAVIGATION UI */}
            <div className="fixed top-8 left-8 right-8 z-[350] flex justify-between items-center mix-blend-difference text-white">
                <span className={brandStyle}>
                    {project.location}
                </span>

                {isStandalone ? (
                    <Link href="/" className={`${brandStyle} hover:line-through cursor-pointer`}>
                        Back to Index
                    </Link>
                ) : (
                    <button onClick={onClose} className={`${brandStyle} hover:line-through cursor-pointer`}>
                        Close
                    </button>
                )}
            </div>

            {/* MAIN CONTENT CONTAINER */}
            <div
                ref={scrollRef}
                className={`w-full h-full flex no-scrollbar ${isMobile ? "flex-col overflow-y-auto snap-y snap-mandatory" : "flex-row overflow-hidden"
                    }`}
            >
                {/* 1️⃣ HERO SECTION (GATEFOLD) */}
                <section className="relative min-w-[100vw] h-screen flex-shrink-0 flex flex-col md:flex-row items-stretch snap-start">
                    {/* Image Half */}
                    <div className="absolute inset-0 md:relative md:w-1/2 md:order-2 h-full bg-neutral-200">
                        <Image
                            src={project.coverImage}
                            alt={project.title}
                            fill
                            priority
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 50vw"
                        />
                        <div className="absolute inset-0 bg-black/30 md:hidden" />
                    </div>

                    {/* Text Half */}
                    <div className="relative z-10 w-full md:w-1/2 h-full flex flex-col justify-end md:justify-center px-8 pb-24 md:pb-0 md:px-20 lg:px-32">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.8 }}
                            className="flex flex-col gap-6"
                        >
                            <div className="space-y-2">
                                <p className={`${brandStyle} text-white/80 md:text-black/40`}>
                                    {project.client}
                                </p>
                                <h1 className="font-serif italic text-5xl md:text-7xl lg:text-9xl text-white md:text-black leading-[0.85] lowercase">
                                    {project.title}
                                </h1>
                            </div>
                            <p className="text-[11px] text-white/70 md:text-black/50 font-light max-w-sm leading-relaxed tracking-wide">
                                {project.description}
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* 2️⃣ GALLERY SECTION */}
                {project.gallery.map((img, index) => (
                    <div
                        key={`${project.id}-gallery-${index}`}
                        className={`relative flex-shrink-0 flex flex-col items-center justify-center snap-start 
                        ${isMobile ? "w-full h-screen" : "w-[85vw] md:w-[60vw] lg:w-[50vw] h-full px-[5vw]"}
                        `}
                    >
                        <div className={`relative w-full h-full ${isMobile ? "" : "md:h-[80vh]"}`}>
                            <Image
                                src={img}
                                alt={`${project.title} slide ${index + 1}`}
                                fill
                                className={`${isMobile ? "object-cover" : "object-contain"}`}
                                sizes="(max-width: 768px) 100vw, 50vw"
                            />
                        </div>

                        {/* Slide Numbering */}
                        <p className={`absolute bottom-8 text-[8px] opacity-30 ${brandStyle} ${isMobile ? 'text-white mix-blend-difference' : 'text-black'}`}>
                            {String(index + 1).padStart(2, "0")} / {String(project.gallery.length).padStart(2, "0")}
                        </p>
                    </div>
                ))}

                {/* Final Spacer for Desktop */}
                {!isMobile && <div className="min-w-[20vw] flex-shrink-0" />}
            </div>
        </motion.div>
    );
}