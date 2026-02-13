"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function Hero() {
    const targetRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start start", "end end"],
    });

    // Scale the image down from 1 (full screen) to 0.7 (framed)
    const scale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);
    // Fade out the text as we scroll
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    return (
        <section ref={targetRef} className="relative h-[200vh] bg-[#faf9f6]">
            <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
                <motion.div
                    style={{ scale }}
                    className="relative w-full h-full"
                >
                    <img
                        src="/hero1.jpg"
                        alt="Hero"
                        className="h-full w-full object-cover"
                    />
                    {/* Subtle dark overlay */}
                    <div className="absolute inset-0 bg-black/20" />
                </motion.div>

                <motion.div
                    style={{ opacity }}
                    className="absolute inset-0 flex flex-col items-center justify-center text-white text-center"
                >
                    <h1 className="text-6xl md:text-[120px] font-serif italic">Namaste Flux</h1>
                    <p className="uppercase tracking-[0.4em] text-sm mt-4">Scroll down to see more</p>
                </motion.div>
            </div>
        </section>
    );
}