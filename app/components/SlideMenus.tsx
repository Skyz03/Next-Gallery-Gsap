"use client";
import { motion, AnimatePresence, Variants } from "framer-motion"; // Import Variants type

interface Props {
    isMenuOpen: boolean;
    isContactOpen: boolean;
    onClose: () => void;
}

// Explicitly typing as Variants fixes the Ease number[] error
const menuVariants: Variants = {
    initial: {
        y: "-100%"
    },
    animate: {
        y: 0,
        transition: {
            duration: 0.8,
            ease: [0.76, 0, 0.24, 1] // TS now knows this is a cubic-bezier array
        }
    },
    exit: {
        y: "-100%",
        transition: {
            duration: 0.6,
            ease: [0.76, 0, 0.24, 1]
        }
    },
};

const contactVariants: Variants = {
    initial: {
        x: "100%"
    },
    animate: {
        x: 0,
        transition: {
            duration: 0.8,
            ease: [0.76, 0, 0.24, 1]
        }
    },
    exit: {
        x: "100%",
        transition: {
            duration: 0.6,
            ease: [0.76, 0, 0.24, 1]
        }
    },
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
                        <button onClick={onClose} className="absolute top-10 right-10 uppercase tracking-[0.4em] text-[10px] hover:line-through hover:cursor-pointer">Close — Menu</button>
                        <nav className="flex flex-col gap-2">
                            <p className="text-[10px] uppercase tracking-[0.8em] opacity-30 mb-8">Directory</p>
                            {["Portfolio", "Editorial", "About", "Archive"].map((item) => (
                                <a key={item} href="#" className="text-6xl md:text-9xl font-serif italic hover:opacity-40 transition-opacity uppercase">
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
                        <button onClick={onClose} className="absolute top-10 right-10 uppercase tracking-[0.4em] text-[10px] hover:line-through hover:cursor-pointer">Close — Contact</button>

                        <div className="mt-20">
                            <p className="text-[10px] uppercase tracking-[0.8em] opacity-40 mb-10">Get in touch</p>
                            <a href="mailto:hello@namasterflux.com" className="text-4xl md:text-8xl font-serif italic leading-none border-b border-black/10 pb-6 block hover:opacity-60 transition-opacity">
                                hello@namasterflux.com
                            </a>
                        </div>

                        <div className="flex flex-col md:flex-row justify-between items-end gap-10">
                            <div className="space-y-2">
                                <p className="text-[10px] uppercase tracking-widest opacity-40">Follow</p>
                                <div className="flex gap-6 font-serif italic text-2xl">
                                    <a href="#">Instagram</a>
                                    <a href="#">Vimeo</a>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] uppercase tracking-widest opacity-40 mb-2">Based in</p>
                                <p className="font-serif italic text-2xl">Kathmandu Nepal</p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}