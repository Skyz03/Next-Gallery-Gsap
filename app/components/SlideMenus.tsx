"use client";
import { useRef, useEffect } from "react";
import { FaInstagram, FaFacebook, FaYoutube } from "react-icons/fa";
import Link from "next/link";
import gsap from "gsap";

interface Props {
    isMenuOpen: boolean;
    isContactOpen: boolean;
    onClose: () => void;
}

const brandStyle = "uppercase tracking-[5px] font-lighter";
const ease = "power3.inOut";

export default function SlideMenus({ isMenuOpen, isContactOpen, onClose }: Props) {
    const menuRef = useRef<HTMLDivElement>(null);
    const contactRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        gsap.to(menuRef.current, {
            y: isMenuOpen ? "0%" : "-100%",
            duration: isMenuOpen ? 0.8 : 0.6,
            ease,
        });
    }, [isMenuOpen]);

    useEffect(() => {
        gsap.to(contactRef.current, {
            x: isContactOpen ? "0%" : "100%",
            duration: isContactOpen ? 0.8 : 0.6,
            ease,
        });
    }, [isContactOpen]);

    return (
        <>
            {/* --- MENU SLIDE (FROM TOP) --- */}
            <div
                ref={menuRef}
                style={{ transform: "translateY(-100%)" }}
                className="fixed inset-0 z-[500] bg-[#1a1a1a] text-white flex flex-col"
            >
                <div className="flex items-center justify-between px-10 md:px-20 py-8 md:py-10 border-b border-white/10">
                    <p className={`${brandStyle} text-[10px] opacity-40`}>Directory</p>
                    <button onClick={onClose} className={`${brandStyle} text-[10px] hover:line-through cursor-pointer`}>
                        Close
                    </button>
                </div>

                <div className="flex-1 flex flex-col md:flex-row">
                    <div className="flex items-center px-10 md:px-20 py-10 md:py-0 md:w-1/2 border-b border-white/10 md:border-b-0 md:border-r md:border-white/10">
                        <nav aria-label="Primary navigation" className="flex flex-col gap-6 md:gap-10">
                            <Link href="/" onClick={onClose} className={`${brandStyle} text-4xl md:text-6xl lg:text-7xl hover:opacity-40 transition-opacity leading-none`}>
                                Weddings
                            </Link>
                            <Link href="/music" onClick={onClose} className={`${brandStyle} text-4xl md:text-6xl lg:text-7xl hover:opacity-40 transition-opacity leading-none`}>
                                Music
                            </Link>
                            <Link href="/about" onClick={onClose} className={`${brandStyle} text-4xl md:text-6xl lg:text-7xl hover:opacity-40 transition-opacity leading-none`}>
                                About
                            </Link>
                        </nav>
                    </div>
                    <div className="flex flex-col justify-center gap-10 md:gap-14 px-10 md:px-16 py-10 md:py-0 md:w-1/2">
                        <div>
                            <p className={`${brandStyle} text-[9px] opacity-30 mb-3`}>Weddings</p>
                            <p className="text-[12px] md:text-[13px] leading-relaxed opacity-60 max-w-sm">
                                We capture the moments that live between the planned ones — the glance before the vows, the laugh no one expected. Cinematic, unhurried wedding photo and video, rooted in Kathmandu.
                            </p>
                        </div>
                        <div className="border-t border-white/10 pt-10 md:pt-14">
                            <p className={`${brandStyle} text-[9px] opacity-30 mb-3`}>Model Portfolios</p>
                            <p className="text-[12px] md:text-[13px] leading-relaxed opacity-60 max-w-sm">
                                We don&apos;t just shoot weddings. If you&apos;re a model — new to the industry or building your book — we create editorial-quality images that get you noticed. Beginners are welcome.
                            </p>
                            <a href="https://www.instagram.com/wedsechos/" target="_blank" rel="noopener noreferrer" className={`${brandStyle} text-[9px] opacity-50 hover:opacity-100 transition-opacity mt-4 inline-block border-b border-white/20 pb-0.5`}>
                                DM to get featured →
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- CONTACT SLIDE (FROM RIGHT) --- */}
            <div
                ref={contactRef}
                style={{ transform: "translateX(100%)" }}
                className="fixed inset-0 z-[500] bg-[#faf9f6] text-black flex flex-col"
            >
                <div className="flex items-center justify-between px-10 md:px-20 py-8 md:py-10 border-b border-black/10">
                    <p className={`${brandStyle} text-[10px] opacity-40`}>Contact</p>
                    <button onClick={onClose} className={`${brandStyle} text-[10px] hover:line-through cursor-pointer`}>
                        Close
                    </button>
                </div>
                <div className="flex-1 flex flex-col justify-between px-10 md:px-20 py-10 md:py-16">
                    <div>
                        <p className={`${brandStyle} text-[10px] opacity-40 mb-10`}>Book your date</p>
                        <a href="tel:+9779813741089" className={`${brandStyle} text-2xl md:text-5xl lg:text-6xl leading-tight border-b-2 border-black/10 pb-4 block hover:opacity-60 transition-opacity break-all`}>
                            +977 9813741089
                        </a>
                    </div>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-8">
                        <div className="space-y-4">
                            <p className={`${brandStyle} text-[10px] opacity-40`}>Follow</p>
                            <div className="flex items-center gap-6">
                                <a href="https://www.instagram.com/wedsechos/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-black/70 hover:text-black transition-colors"><FaInstagram size={22} /></a>
                                <a href="https://www.facebook.com/profile.php?id=61576426967402" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-black/70 hover:text-black transition-colors"><FaFacebook size={22} /></a>
                                <a href="https://www.youtube.com/@WeddingEcho" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="text-black/70 hover:text-black transition-colors"><FaYoutube size={24} /></a>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className={`${brandStyle} text-[10px] opacity-40 mb-2`}>Based in</p>
                            <p className={`${brandStyle} text-sm md:text-lg`}>Kathmandu, Nepal</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
