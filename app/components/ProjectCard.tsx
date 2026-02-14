"use client";
import { motion } from "framer-motion";

interface ProjectProps {
    image: string;
    title: string;
    location: string;
    aspect: "portrait" | "landscape";
    index: number; // Use index to stagger animations
    onClick: () => void;
}

export default function ProjectCard({ image, title, location, aspect, index, onClick }: ProjectProps) {
    return (
        <motion.div
            onClick={onClick}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.8, delay: (index % 3) * 0.1, ease: "easeOut" }}
            className="group cursor-pointer w-full p-4"
        >
            <div className={`relative overflow-hidden ${aspect === "portrait" ? "aspect-[3/4]" : "aspect-[16/10]"}`}>
                <motion.img
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
                    src={image}
                    alt={title}
                    className="h-full w-full object-cover transition-transform"
                />
                {/* Subtle Overlay */}
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-500" />
            </div>

            <div className="mt-6 text-center lg:text-left">
                <h3 className="font-serif italic text-2xl text-[#1a1a1a]">{title}</h3>
                <p className="text-[10px] uppercase tracking-widest text-gray-500 mt-1">{location}</p>
            </div>
        </motion.div>
    );
}