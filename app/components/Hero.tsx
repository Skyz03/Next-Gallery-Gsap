"use client";
import { motion } from "framer-motion";

export default function Hero() {
    return (
        <section className="relative h-screen w-full overflow-hidden bg-[#faf9f6]">
            {/* Background Image/Video */}
            <div className="absolute inset-0 z-0">
                <img
                    src="/hero-wedding.jpg"
                    alt="Bottega Style"
                    className="h-full w-full object-cover"
                />
            </div>

            {/* Elegant Overlay */}
            <div className="relative z-10 flex h-full flex-col items-center justify-center text-white px-6">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="text-6xl md:text-8xl font-serif italic"
                >
                    Bottega 53
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="mt-4 text-sm uppercase tracking-[0.3em]"
                >
                    International Wedding Photographers
                </motion.p>
            </div>
        </section>
    );
}