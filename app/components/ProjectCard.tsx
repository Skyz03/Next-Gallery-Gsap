"use client";
import { motion } from "framer-motion";

interface ProjectProps {
    image: string;
    title: string;
    location: string;
    aspect: "portrait" | "landscape" | "square";
}

export default function ProjectCard({ image, title, location, aspect }: ProjectProps) {
    // Map aspect ratios to Tailwind classes
    const aspectClasses = {
        portrait: "aspect-[3/4]",
        landscape: "aspect-[16/10]",
        square: "aspect-square",
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={`relative group overflow-hidden cursor-pointer ${aspectClasses[aspect]}`}
        >
            {/* Image with hover zoom */}
            <img
                src={image}
                alt={title}
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />

            {/* Elegant Text Overlay */}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8 text-white">
                <p className="font-serif italic text-2xl">{title}</p>
                <p className="text-xs uppercase tracking-widest mt-2">{location}</p>
            </div>
        </motion.div>
    );
}