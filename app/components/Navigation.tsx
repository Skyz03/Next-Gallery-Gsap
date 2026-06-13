"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import SlideMenus from "./SlideMenus";

export default function Navigation() {
    const pathname = usePathname();
    const [openView, setOpenView] = useState<"none" | "menu" | "contact">("none");

    // ProjectView has its own complete nav on detail pages — hide the global one to prevent overlap
    if (pathname.startsWith("/admin") || /^\/(projects|music)\/.+/.test(pathname)) return null;

    // We define a shared class to ensure they are identical
    const uiTextStyle = "uppercase tracking-[0.5em] text-[10px] font-bold transition-all cursor-pointer md:text-md lg:text-lg";

    return (
        <>
            <div className="fixed z-[100] inset-0 pointer-events-none p-10 mix-blend-difference text-white">

                {/* TOP LEFT: BRANDING - Styled like the buttons, but scaled for impact */}
                <div className="absolute top-10 left-10 pointer-events-auto">
                    {pathname === "/" ? (
                        <button
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                            className={` ${uiTextStyle}`}
                        >
                            Weds<br />
                            Echos
                        </button>
                    ) : (
                        <Link href="/" className={` ${uiTextStyle}`}>
                            Weds<br />
                            Echos
                        </Link>
                    )}
                </div>

                {/* TOP RIGHT: MENU TRIGGER */}
                <div className="absolute top-10 right-10 pointer-events-auto text-right">
                    <button
                        onClick={() => setOpenView("menu")}
                        className={`group flex flex-col items-end gap-1 ${uiTextStyle}`}
                    >
                        <span className="[writing-mode:vertical-lr] rotate-180">Menu</span>
                    </button>
                </div>

                {/* BOTTOM RIGHT: CONTACT TRIGGER */}
                <div className="absolute bottom-10 right-10 pointer-events-auto">
                    <button
                        onClick={() => setOpenView("contact")}
                        className={`${uiTextStyle} hover:line-through`}
                    >
                        <span className="[writing-mode:vertical-lr] rotate-180">Contact</span>
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