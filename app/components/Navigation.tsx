"use client";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";

export default function Navigation() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    
    // 1. Reveal background blur after 100px of scroll
    if (latest > 100) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }

    // 2. Hide nav on scroll down, show on scroll up
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  return (
    <motion.nav
      variants={{
        visible: { y: 0 },
        hidden: { y: "-100%" },
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 w-full z-50 px-8 py-6 flex justify-between items-center transition-colors duration-500 ${
        isScrolled ? "bg-white/80 backdrop-blur-md border-b border-black/5" : "bg-transparent"
      }`}
    >
      {/* Left Menu Button */}
      <button className="text-[10px] uppercase tracking-[0.3em] font-medium flex items-center gap-2 group">
        <span className="w-8 h-[1px] bg-current transition-all group-hover:w-12" />
        Menu
      </button>

      {/* Center Logo */}
      <div className="absolute left-1/2 -translate-x-1/2">
        <h2 className={`font-serif text-2xl tracking-tighter transition-colors duration-500 ${
          isScrolled ? "text-black" : "text-white"
        }`}>
          B53
        </h2>
      </div>

      {/* Right Contact Link */}
      <div className="flex gap-8 items-center">
        <a href="#" className="hidden md:block text-[10px] uppercase tracking-[0.3em]">Journal</a>
        <a href="#" className="text-[10px] uppercase tracking-[0.3em] bg-black text-white px-6 py-3 rounded-full hover:bg-black/80 transition-all">
          Inquire
        </a>
      </div>
    </motion.nav>
  );
}