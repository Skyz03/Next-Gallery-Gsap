"use client";
import { motion, AnimatePresence, Variants } from "framer-motion";

interface Props {
    isMenuOpen: boolean;
    isContactOpen: boolean;
    onClose: () => void;
}

// Shared style to match your Namaste Flux branding exactly
const brandStyle = "uppercase tracking-[5px] font-lighter";

const menuVariants: Variants = {
    initial: { y: "-100%" },
    animate: { y: 0, transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } },
    exit: { y: "-100%", transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] } },
};

const contactVariants: Variants = {
    initial: { x: "100%" },
    animate: { x: 0, transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } },
    exit: { x: "100%", transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] } },
};

export default function SlideMenus({ isMenuOpen, isContactOpen, onClose }: Props) {
    return (
        <>
            <AnimatePresence>
                {/* --- MENU SLIDE (FROM TOP) --- */}
                {isMenuOpen && (
                    <motion.div
                        variants={menuVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="fixed inset-0 z-[200] bg-[#1a1a1a] text-white p-10 md:p-20 flex flex-col justify-center"
                    >
                        <button
                            onClick={onClose}
                            className={`absolute top-10 right-10 ${brandStyle} text-[10px] hover:line-through cursor-pointer`}
                        >
                            Close — Menu
                        </button>

                        <nav className="flex flex-col gap-4 md:gap-8">
                            <p className={`${brandStyle} text-[10px] opacity-30 mb-4`}>Directory</p>
                            {["Portfolio", "Editorial", "About", "Archive"].map((item) => (
                                <a
                                    key={item}
                                    href="#"
                                    className={`${brandStyle} text-4xl md:text-7xl lg:text-8xl hover:opacity-40 transition-opacity leading-none`}
                                >
                                    {item}
                                </a>
                            ))}
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {/* --- CONTACT SLIDE (FROM RIGHT) --- */}
                {isContactOpen && (
                    <motion.div
                        variants={contactVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="fixed inset-0 z-[200] bg-[#faf9f6] text-black p-10 md:p-20 flex flex-col justify-between"
                    >
                        <button
                            onClick={onClose}
                            className={`absolute top-10 right-10 ${brandStyle} text-[10px] hover:line-through cursor-pointer`}
                        >
                            Close — Contact
                        </button>

                        <div className="mt-20">
                            <p className={`${brandStyle} text-[10px] opacity-40 mb-10`}>Get in touch</p>
                            <a
                                href="mailto:hello@namasterflux.com"
                                className={`${brandStyle} text-2xl md:text-5xl lg:text-6xl leading-tight border-b-2 border-black/10 pb-4 block hover:opacity-60 transition-opacity break-all`}
                            >
                                hello@namasterflux.com
                            </a>
                        </div>

                        <div className="flex flex-col md:flex-row justify-between items-end gap-10">
                            <div className="space-y-4">
                                <p className={`${brandStyle} text-[10px] opacity-40`}>Follow</p>
                                <div className="flex gap-8">
                                    <a href="#" className={`${brandStyle} text-sm md:text-lg hover:opacity-50 transition-opacity`}>Instagram</a>
                                    <a href="#" className={`${brandStyle} text-sm md:text-lg hover:opacity-50 transition-opacity`}>Vimeo</a>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className={`${brandStyle} text-[10px] opacity-40 mb-2`}>Based in</p>
                                <p className={`${brandStyle} text-sm md:text-lg`}>Kathmandu Nepal</p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}