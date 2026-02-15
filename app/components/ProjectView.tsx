"use client";
import { motion, useSpring, useMotionValue } from "framer-motion";
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
    const targetX = useMotionValue(0);
    const smoothX = useSpring(targetX, { damping: 45, stiffness: 160, mass: 1 });

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
            {/* CLOSE BUTTON - Works across all colors via mix-blend */}
            <button
                onClick={onClose}
                className={`fixed top-8 right-8 z-[350] ${brandStyle} text-[10px] mix-blend-difference text-white hover:line-through cursor-pointer`}
            >
                Close
            </button>

            <div
                ref={scrollRef}
                className="w-full h-full flex flex-col md:flex-row md:items-center no-scrollbar"
            >
                {/* 1️⃣ HERO SECTION */}
                <section className="relative min-w-full h-screen flex-shrink-0 flex flex-col md:flex-row items-stretch">
                    {/* Image Half */}
                    <div className="absolute inset-0 md:relative md:w-1/2 md:order-2 h-full bg-neutral-200">
                        <img
                            src={project.images[0]}
                            alt=""
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/20 md:hidden" />
                    </div>

                    {/* Text Half */}
                    <div className="relative z-10 w-full md:w-1/2 h-full flex flex-col justify-end md:justify-center px-8 pb-24 md:pb-0 md:px-20 lg:px-32">
                        <div className="flex flex-col gap-6">
                            <span className={`${brandStyle} text-[8px] text-white/80 md:text-black/40 block`}>
                                {project.client}
                            </span>
                            <h1 className="font-serif italic text-5xl md:text-7xl lg:text-8xl text-white md:text-black leading-[0.85] lowercase">
                                {project.title}
                            </h1>
                            <p className="text-[11px] text-white/70 md:text-black/50 font-light max-w-sm">
                                {project.description}
                            </p>
                        </div>
                    </div>
                </section>

                {/* 2️⃣ GALLERY SECTION */}
                <div className="flex flex-col md:flex-row md:items-center gap-0 md:gap-40 md:px-[15vw]">
                    {project.images.slice(1).map((img, index) => (
                        <div
                            key={index}
                            className="w-full md:w-auto h-screen md:h-[85vh] flex-shrink-0 flex flex-col gap-6 justify-center"
                        >
                            <img
                                src={img}
                                alt=""
                                className="w-full h-full object-cover md:object-contain bg-neutral-100"
                            />
                            <p className={`${brandStyle} text-[8px] opacity-20 hidden md:block text-center`}>
                                {String(index + 2).padStart(2, '0')}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="hidden md:block w-[20vw] flex-shrink-0" />
            </div>
        </motion.div>
    );
}