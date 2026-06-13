"use client";
import Image from "next/image";

interface ProjectProps {
    image: string;
    title: string;
    location: string;
    aspect: "portrait" | "landscape";
    index: number;
}

export default function ProjectCard({ image, title, location, aspect }: ProjectProps) {
    return (
        <div className="group w-full">
            <div className={`relative overflow-hidden ${aspect === "portrait" ? "aspect-[3/4]" : "aspect-[16/10]"}`}>
                <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.33,1,0.68,1)]"
                    sizes="(max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-500" />
            </div>
            <div className="mt-6 text-center lg:text-left">
                <h3 className="font-serif italic text-2xl text-[#1a1a1a]">{title}</h3>
                <p className="text-[10px] uppercase tracking-widest text-gray-500 mt-1">{location}</p>
            </div>
        </div>
    );
}
