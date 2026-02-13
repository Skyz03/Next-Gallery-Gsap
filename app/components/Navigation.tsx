"use client";
import { useState } from "react";
import SlideMenus from "./SlideMenus";

export default function Navigation() {
    const [openView, setOpenView] = useState<"none" | "menu" | "contact">("none");

    // We define a shared class to ensure they are identical
    const uiTextStyle = "uppercase tracking-[0.5em] text-[10px] font-bold transition-all cursor-pointer";

    return (
        <>
            <div className="fixed z-[100] inset-0 pointer-events-none p-10 mix-blend-difference text-white">

                {/* TOP LEFT: BRANDING - Styled like the buttons, but scaled for impact */}
                <div className="absolute top-10 left-10 pointer-events-auto">
                    <button
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="uppercase tracking-[0.5em] text-[13px] md:text-[15px] font-bold leading-[1.8] hover:opacity-50 text-left transition-all cursor-pointer"
                    >
                        Namaste<br />
                        Gallery
                    </button>
                </div>  

                {/* TOP RIGHT: MENU TRIGGER */}
                <div className="absolute top-10 right-10 pointer-events-auto text-right">
                    <button
                        onClick={() => setOpenView("menu")}
                        className={`group flex flex-col items-end gap-1 ${uiTextStyle}`}
                    >
                        <span className="mb-1">Menu</span>
                        <div className="w-12 h-[1px] bg-white group-hover:w-6 transition-all duration-700 ease-in-out" />
                    </button>
                </div>

                {/* BOTTOM RIGHT: CONTACT TRIGGER */}
                <div className="absolute bottom-10 right-10 pointer-events-auto">
                    <button
                        onClick={() => setOpenView("contact")}
                        className={`${uiTextStyle} hover:line-through`}
                    >
                        Contact
                    </button>
                </div>
            </div>

            <SlideMenus
                isMenuOpen={openView === "menu"}
                isContactOpen={openView === "contact"}
                onClose={() => setOpenView("none")}
            />
        </>
    );
}