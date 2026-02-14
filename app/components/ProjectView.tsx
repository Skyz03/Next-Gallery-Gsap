"use client";
import { motion, AnimatePresence, useSpring, useMotionValue } from "framer-motion";
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

const brandStyle = "uppercase tracking-[0.5em] font-light";

export default function ProjectView({ project, onClose }: ProjectViewProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    // Motion values for smooth spring physics
    const x = useMotionValue(0);
    const smoothX = useSpring(x, { damping: 50, stiffness: 300 });

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;

        const handleWheel = (e: WheelEvent) => {
            e.preventDefault();
            // Update the motion value based on wheel delta
            // Clamping ensures we don't scroll into empty space
            const newScrollLeft = el.scrollLeft + e.deltaY;
            el.scrollLeft = newScrollLeft;
        };

        el.addEventListener("wheel", handleWheel, { passive: false });
        document.body.style.overflow = "hidden";

        return () => {
            el.removeEventListener("wheel", handleWheel);
            document.body.style.overflow = "unset";
        };
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] bg-[#fafafa] flex flex-col md:flex-row overflow-hidden"
        >
            {/* 1. LEFT SIDE: STATIONARY INFO (Narrower & Cleaner) */}
            <div className="w-full md:w-[400px] h-full p-8 md:p-14 flex flex-col justify-between border-r border-black/[0.03] flex-shrink-0 bg-[#fafafa] z-[310]">
                <div className="mt-24 space-y-12">
                    <div>
                        <p className={`${brandStyle} text-[8px] opacity-30 mb-2`}>Project</p>
                        <h1 className={`${brandStyle} text-lg leading-tight`}>{project.client}</h1>
                    </div>

                    <div>
                        <p className={`${brandStyle} text-[8px] opacity-30 mb-2`}>Story</p>
                        <p className="font-serif italic text-3xl lowercase leading-tight opacity-80 mb-4">
                            {project.title}
                        </p>
                        <p className="text-[11px] leading-relaxed text-black/50 font-light tracking-widest max-w-[280px]">
                            {project.description}
                        </p>
                    </div>
                </div>

                <button
                    onClick={onClose}
                    className={`${brandStyle} text-[9px] opacity-40 hover:opacity-100 hover:line-through transition-all text-left cursor-pointer`}
                >
                    Back to Index
                </button>
            </div>

            {/* 2. RIGHT SIDE: THE GALLERY */}
            <div
                ref={scrollRef}
                className="flex-1 h-full overflow-x-auto overflow-y-hidden flex items-center gap-16 px-12 md:px-32 no-scrollbar select-none"
                style={{
                    scrollBehavior: 'smooth',
                    WebkitOverflowScrolling: 'touch'
                }}
            >
                {project.images.map((img, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 * index, duration: 0.8 }}
                        className="h-[65vh] md:h-[70vh] aspect-[3/4] md:aspect-[4/5] flex-shrink-0 relative group"
                    >
                        {/* Image Overlay/Label for luxury feel */}
                        <div className="absolute -bottom-8 left-0 overflow-hidden h-4 w-full">
                            <p className={`${brandStyle} text-[7px] opacity-20 group-hover:opacity-100 transition-opacity`}>
                                Slide {index + 1} / {project.images.length}
                            </p>
                        </div>

                        <img
                            src={img}
                            alt=""
                            className="w-full h-full object-cover grayscale-[30%] hover:grayscale-0 transition-all duration-1000 ease-out"
                        />
                    </motion.div>
                ))}

                {/* End Spacer */}
                <div className="w-[10vw] h-full flex-shrink-0" />
            </div>
        </motion.div>
    );
}