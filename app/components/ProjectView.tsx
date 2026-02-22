"use client";

import { motion, useSpring, useMotionValue } from "framer-motion";
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

    const targetX = useMotionValue(0);
    const smoothX = useSpring(targetX, { damping: 45, stiffness: 160, mass: 1 });

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener("resize", check);

        const el = scrollRef.current;
        if (!el || window.innerWidth < 768) return;

        const handleWheel = (e: WheelEvent) => {
            if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
                e.preventDefault();
                const max = el.scrollWidth - el.clientWidth;
                targetX.set(Math.max(0, Math.min(targetX.get() + e.deltaY * 1.2, max)));
            }
        };

        const unsub = smoothX.on("change", (v) => { if (el) el.scrollLeft = v; });
        el.addEventListener("wheel", handleWheel, { passive: false });
        document.body.style.overflow = "hidden";

        return () => {
            window.removeEventListener("resize", check);
            el.removeEventListener("wheel", handleWheel);
            unsub();
            document.body.style.overflow = "unset";
        };
    }, [targetX, smoothX]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] bg-[#fafafa] overflow-hidden"
        >
            {/* NAV UI */}
            <div className="fixed top-8 left-8 right-8 z-[350] flex justify-between items-center mix-blend-difference text-white">
                <span className={brandStyle}>{project.location}</span>
                {isStandalone ? (
                    <Link href="/" className={`${brandStyle} hover:line-through`}>Back to Index</Link>
                ) : (
                    <button onClick={onClose} className={`${brandStyle} hover:line-through`}>Close</button>
                )}
            </div>

            {/* SCROLLABLE CONTENT */}
            <div
                ref={scrollRef}
                className={`w-full h-full flex no-scrollbar ${isMobile ? "flex-col overflow-y-auto snap-y snap-mandatory" : "flex-row overflow-hidden"
                    }`}
            >
                {/* HERO SECTION */}
                <section className="relative min-w-[100vw] h-screen flex-shrink-0 flex flex-col md:flex-row items-stretch snap-start">
                    <div className="absolute inset-0 md:relative md:w-1/2 md:order-2 h-full bg-neutral-200">
                        <Image src={project.coverImage} alt={project.title} fill priority className="object-cover" />
                        <div className="absolute inset-0 bg-black/30 md:hidden" />
                    </div>

                    <div className="relative z-10 w-full md:w-1/2 h-full flex flex-col justify-end md:justify-center px-8 pb-24 md:pb-0 md:px-20 lg:px-32">
                        <h1 className="font-serif italic text-5xl md:text-8xl text-white md:text-black leading-[0.85] lowercase">
                            {project.title}
                        </h1>
                        <p className="text-[11px] text-white/70 md:text-black/50 mt-6 max-w-sm leading-relaxed tracking-wide">
                            {project.description}
                        </p>
                    </div>
                </section>

                {/* GALLERY SLIDES */}
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
                                alt={`Slide ${index}`}
                                fill
                                className={`${isMobile ? "object-cover" : "object-contain"}`}
                                sizes="(max-width: 768px) 100vw, 50vw"
                            />
                        </div>
                        <p className={`absolute bottom-8 text-[8px] opacity-30 ${brandStyle} ${isMobile ? 'text-white mix-blend-difference' : 'text-black'}`}>
                            {String(index + 1).padStart(2, "0")} / {String(project.gallery.length).padStart(2, "0")}
                        </p>
                    </div>
                ))}

                {!isMobile && <div className="min-w-[20vw] flex-shrink-0" />}
            </div>
        </motion.div>
    );
}