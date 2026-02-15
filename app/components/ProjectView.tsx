"use client";
import { motion, useSpring, useMotionValue, AnimatePresence } from "framer-motion";
import { useEffect, useRef } from "react";

interface ProjectViewProps {
    project: {
        title: string;
        description: string;
        client: string;
        images: string[];
    };
    onClose: () => void;
}

const brandStyle = "uppercase tracking-[0.25em] font-light";

export default function ProjectView({ project, onClose }: ProjectViewProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    // 1. Motion Values for smooth physics
    const targetX = useMotionValue(0);
    const smoothX = useSpring(targetX, {
        damping: 45,    // Resistance (higher = less bouncy)
        stiffness: 160, // Power (higher = faster)
        mass: 1,        // Weight
    });

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;

        const handleWheel = (e: WheelEvent) => {
            // Check if user is scrolling vertically
            if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
                e.preventDefault();

                const maxScroll = el.scrollWidth - el.clientWidth;
                // Sensitivity: 1.2 makes it feel a bit faster/premium
                const step = e.deltaY * 1.2;
                const next = targetX.get() + step;

                targetX.set(Math.max(0, Math.min(next, maxScroll)));
            }
        };

        // Connect the Spring value to the actual DOM scroll position
        const unsubscribe = smoothX.on("change", (latest) => {
            if (el) el.scrollLeft = latest;
        });

        el.addEventListener("wheel", handleWheel, { passive: false });

        // Prevent background scrolling
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
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[300] bg-[#fafafa] overflow-hidden"
        >
            <div
                ref={scrollRef}
                className="w-full h-full flex overflow-x-auto overflow-y-hidden items-center select-none no-scrollbar"
            >
                {/* 1️⃣ THE HERO SECTION — FULL BLEED 50/50 SPLIT */}
                <section className="min-w-[100vw] h-screen flex flex-col md:flex-row items-stretch overflow-hidden flex-shrink-0">

                    {/* LEFT SIDE: TEXT CONTENT */}
                    <div className="w-full md:w-1/2 h-full flex flex-col justify-center px-10 md:px-20 lg:px-32 bg-[#fafafa]">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4, duration: 1 }}
                            className="flex flex-col gap-8"
                        >
                            <div className="space-y-4">
                                <span className={`${brandStyle} text-[8px] opacity-40 block tracking-[0.5em]`}>
                                    Project — {project.client}
                                </span>
                                <h1 className="font-serif italic text-5xl md:text-7xl lg:text-8xl lowercase opacity-90 leading-[0.85] -ml-1">
                                    {project.title}
                                </h1>
                            </div>

                            <p className="text-[11px] leading-relaxed text-black/50 font-light tracking-wide max-w-sm">
                                {project.description}
                            </p>

                            <button
                                onClick={onClose}
                                className={`${brandStyle} text-[9px] opacity-40 hover:opacity-100 hover:line-through transition-all w-fit mt-6 cursor-pointer`}
                            >
                                Back to Index
                            </button>
                        </motion.div>
                    </div>

                    {/* RIGHT SIDE: PRIMARY HERO IMAGE */}
                    <div className="w-full md:w-1/2 h-full overflow-hidden">
                        <motion.img
                            initial={{ scale: 1.1, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                            src={project.images[0]}
                            alt={project.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </section>

                {/* 2️⃣ GALLERY SECTION — EDITORIAL 85VH FLOW */}
                <div className="flex items-center gap-16 md:gap-40 px-[15vw] h-full flex-shrink-0">
                    {project.images.slice(1).map((img, index) => (
                        <motion.div
                            key={index}
                            className="h-[65vh] md:h-[85vh] flex-shrink-0 flex flex-col gap-6"
                        >
                            <img
                                src={img}
                                alt=""
                                className="h-full w-auto object-contain shadow-2xl shadow-black/[0.03] rounded-[2px]"
                            />
                            <div className="flex justify-between items-center px-1">
                                <p className={`${brandStyle} text-[8px] opacity-20`}>
                                    {String(index + 2).padStart(2, '0')} / {String(project.images.length).padStart(2, '0')}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* FINAL SPACER FOR BREATHING ROOM */}
                <div className="w-[30vw] flex-shrink-0 h-full" aria-hidden />
            </div>

            {/* OPTIONAL: ESCAPE HINT */}
            <div className="fixed bottom-10 left-10 pointer-events-none hidden md:block">
                <p className={`${brandStyle} text-[7px] opacity-20`}>Use Wheel to Navigate</p>
            </div>
        </motion.div>
    );
}