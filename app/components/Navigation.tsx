"use client";
import { useState } from "react";
import SlideMenus from "./SlideMenus";

export default function Navigation() {
    const [openView, setOpenView] = useState<"none" | "menu" | "contact">("none");

    return (
        <>
            <div className="fixed z-[100] inset-0 pointer-events-none p-10 mix-blend-difference text-white">
                {/* TOP LEFT: BRANDING */}
                <div className="absolute top-10 left-10 pointer-events-auto">
                    <h1 className="text-3xl md:text-5xl font-sans font-light tracking-wider leading-none uppercase">
                        Namaste<br /> Flux
                    </h1>
                </div>

                {/* TOP RIGHT: INDEX TRIGGER */}
                <div className="absolute top-10 right-10 pointer-events-auto">
                    <button
                        onClick={() => setOpenView("menu")}
                        className="group flex flex-col items-end gap-1 uppercase tracking-[0.4em] text-xs font-bold hover:cursor-pointer"
                    >
                        <span className="mb-1">Menu</span>
                        <div className="w-12 h-[2px] bg-white group-hover:w-6 transition-all" />
                    </button>
                </div>

                {/* BOTTOM RIGHT: CONTACT TRIGGER */}
                <div className="absolute bottom-10 right-10 pointer-events-auto">
                    <button
                        onClick={() => setOpenView("contact")}
                        className="uppercase tracking-[0.4em] text-xs font-bold hover:line-through transition-all hover:cursor-pointer"
                    >
                        Contact
                    </button>
                </div>
            </div>

            {/* THE SLIDES */}
            <SlideMenus
                isMenuOpen={openView === "menu"}
                isContactOpen={openView === "contact"}
                onClose={() => setOpenView("none")}
            />
        </>
    );
}